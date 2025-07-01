import React, { useState, useEffect, useCallback } from 'react';

import styles from './EventManagement.module.css';
import DataTableContainer from '../../mainContent/DataTableContainer';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';

const EventManagement = () => {

    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        name: '',
        date: '',
        startTime: '',
        endTime: '',
        address: '',
        maxSlot: '',
    });
    const [editingEvent, setEditingEvent] = useState(null);

    const formatTime = (timeString) => {
        if (!timeString) return '';
        try {
            let dateObj;
            if (timeString.includes('T')) {
                dateObj = new Date(timeString);
            } else { 
                dateObj = new Date(`2000-01-01T${timeString}`);
            }
            
            if (isNaN(dateObj.getTime())) {
                return timeString.substring(0, 5); 
            }

            return dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
        } catch (error) {
            console.error("Lỗi định dạng thời gian:", timeString, error);
            return timeString.substring(0, 5);
        }
    };

    const isEventOverdue = (eventDate, eventEndTime) => {
        if (!eventDate || !eventEndTime) return false;

        const now = new Date();
        try {
            const eventEndDateTime = new Date(`${eventDate}T${eventEndTime}`);
            return eventEndDateTime < now; 
        } catch (e) {
            console.error("Lỗi khi kiểm tra thời gian quá hạn:", eventDate, eventEndTime, e);
            return false;
        }
    };

    const fetchEvents = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('/event/staff-view');
            setEvents(data);
            console.log('Danh sách sự kiện đã tải:', data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách sự kiện hiến máu:', error);
            if (error.response) {
                toast.error(`Lỗi khi tải danh sách sự kiện hiến máu: ${error.response.data.message || error.response.status}`);
            } else if (error.request) {
                toast.error('Không thể kết nối đến máy chủ để tải sự kiện hiến máu. Vui lòng thử lại.');
            } else {
                toast.error('Có lỗi xảy ra khi tải sự kiện hiến máu. Vui lòng thử lại.');
            }   
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingEvent) {
            setEditingEvent(prevState => ({
                ...prevState,
                [name]: value
            }));
        } else {
            setNewEvent(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmitEvent = async (e) => {
        e.preventDefault();

        const dataToSubmit = editingEvent || newEvent;

        const startTimeToSend = `${dataToSubmit.startTime}:00`;
        const endTimeToSend = `${dataToSubmit.endTime}:00`;
        
        const eventDataToSend = {
            ...dataToSubmit,
            startTime: startTimeToSend,
            endTime: endTimeToSend,
            maxSlot: parseInt(dataToSubmit.maxSlot, 10),
            facilityId: 1
        };

        try {
            if (editingEvent) {
                await axiosInstance.put(`/event/${editingEvent.id}`, eventDataToSend);
                toast.success('Sự kiện hiến máu đã được cập nhật thành công!');
            } else {
                await axiosInstance.post('/event', eventDataToSend);
                toast.success('Sự kiện hiến máu đã được tạo thành công!');
            }
            
            await fetchEvents();
            
            setNewEvent({ name: '', date: '', startTime: '', endTime: '', address: '', maxSlot: '' });
            setEditingEvent(null);
            setShowForm(false);

        } catch (error) {
            console.error('Lỗi khi xử lý sự kiện hiến máu:', error);
            if (error.response) {
                toast.error(`Lỗi: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                toast.error('Không nhận được phản hồi từ server. Vui lòng thử lại.');
            } else {
                toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        }
    };

    const handleEditClick = (event) => {
        setEditingEvent({
            ...event,
            startTime: event.startTime ? event.startTime.substring(0, 5) : '',
            endTime: event.endTime ? event.endTime.substring(0, 5) : '',
            date: event.date
        });
        setShowForm(true);
    };

    const handleDeleteClick = async (eventId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này không?')) {
            try {
                await axiosInstance.delete(`/event/${eventId}`);
                toast.success('Sự kiện đã được xóa thành công!');
                fetchEvents();
            } catch (error) {
                console.error('Lỗi khi xóa sự kiện:', error);
                if (error.response) {
                    toast.error(`Lỗi khi xóa sự kiện: ${error.response.data.message || error.response.statusText}`);
                } else {
                    toast.error('Không thể xóa sự kiện. Vui lòng thử lại.');
                }
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingEvent(null);
        setNewEvent({ name: '', date: '', startTime: '', endTime: '', address: '', maxSlot: '' });
        setShowForm(false);
    };

    const eventColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Tên Sự kiện', accessor: 'name' },
        { header: 'Ngày', accessor: 'date' },
        {
            header: 'Thời gian',
            accessor: 'timeRange',
            render: (row) => {
                const start = formatTime(row.startTime);
                const end = formatTime(row.endTime);
                return `${start} - ${end}`;
            }
        },
        { header: 'Địa điểm', accessor: 'address' },
        {
            header: 'ID Cơ sở',
            accessor: 'facilityId',
            render: (row) => row.facilityId || 'N/A'
        },
        {
            header: 'SL Hiện tại/Tối đa',
            accessor: 'slots',
            render: (row) => `${row.currentSlot || 0}/${row.maxSlot}`
        },
        {
            header: 'Trạng thái',
            accessor: 'status',
            render: (row) => {
                const statusMap = {
                    'ACTIVE': 'Đang diễn ra',
                    'INACTIVE': 'Đã kết thúc',
                };
                return statusMap[row.status] || row.status;
            }
        },
        {
            header: 'Hành động',
            accessor: 'actions',
            render: (row) => {
                const isOverdue = isEventOverdue(row.date, row.endTime);
                const canDelete = row.status === 'INACTIVE' || (row.status === 'ACTIVE' && isOverdue);

                return (
                    <div className={styles.actionButtons}>
                        <button 
                            className={styles.editButton} 
                            onClick={() => handleEditClick(row)}
                        >
                            Chỉnh sửa
                        </button>
                        {canDelete ? (
                            <button 
                                className={styles.deleteButton} 
                                onClick={() => handleDeleteClick(row.id)}
                            >
                                Xóa
                            </button>
                        ) : (
                            <span className={styles.disabledAction}>Không thể xóa</span>
                        )}
                    </div>
                );
            }
        },
    ];

    return (
        <div className={styles.eventManagement}>
            <h2 className={styles.pageTitle}>Quản lý Sự kiện Hiến Máu</h2>

            <button className={styles.toggleFormButton} onClick={() => {
                setShowForm(!showForm);
                if (showForm) {
                    setEditingEvent(null);
                    setNewEvent({ name: '', date: '', startTime: '', endTime: '', address: '', maxSlot: '' });
                }
            }}>
                {showForm ? 'Ẩn Form' : 'Tạo Sự kiện Hiến Máu Mới'}
            </button>

            {showForm && (
                <div className={styles.createForm}>
                    <h3>{editingEvent ? 'Chỉnh sửa Sự kiện' : 'Tạo Sự kiện Hiến Máu Mới'}</h3>
                    <form onSubmit={handleSubmitEvent}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Tên sự kiện:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={editingEvent ? editingEvent.name : newEvent.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="date">Ngày:</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={editingEvent ? editingEvent.date : newEvent.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="startTime">Giờ bắt đầu:</label>
                            <input
                                type="time"
                                id="startTime"
                                name="startTime"
                                value={editingEvent ? editingEvent.startTime : newEvent.startTime}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="endTime">Giờ kết thúc:</label>
                            <input
                                type="time"
                                id="endTime"
                                name="endTime"
                                value={editingEvent ? editingEvent.endTime : newEvent.endTime}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="address">Địa chỉ:</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={editingEvent ? editingEvent.address : newEvent.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="maxSlot">Số lượng tối đa (slots):</label>
                            <input
                                type="number"
                                id="maxSlot"
                                name="maxSlot"
                                value={editingEvent ? editingEvent.maxSlot : newEvent.maxSlot}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                        </div>
                        <div className={styles.formActions}>
                            <button type="submit" className={styles.submitButton}>
                                {editingEvent ? 'Cập nhật Sự kiện' : 'Tạo Sự kiện'}
                            </button>
                            {editingEvent && (
                                <button type="button" className={styles.cancelButton} onClick={handleCancelEdit}>
                                    Hủy
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.eventList}>
                <h3>Danh sách Sự kiện Hiến Máu Hiện có</h3>
                {events.length > 0 ? (
                    <DataTableContainer>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    {eventColumns.map((col, index) => (
                                        <th key={col.header || index}>{col.header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((row, rowIndex) => (
                                    <tr key={row.id || rowIndex}>
                                        {eventColumns.map((col, colIndex) => (
                                            <td key={colIndex}>
                                                {col.render ? col.render(row) : row[col.accessor]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </DataTableContainer>
                ) : (
                    <p>Chưa có sự kiện hiến máu nào được tạo.</p>
                )}
            </div>
        </div>
    );
};

export default EventManagement;
