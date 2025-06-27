import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styles from './EventManagement.module.css';
import DataTableContainer from '../../mainContent/DataTableContainer';
import axiosInstance from '../../../../configs/axios';

const EventManagement = () => {
    
    const user = useSelector(state => state.user); // eslint-disable-line no-unused-vars

    const [events, setEvents] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        name: '',
        date: '',
        startTime: '',
        endTime: '',
        address: '',
        maxSlot: '',
    });

    const fetchEvents = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('/event/staff-view');
            setEvents(data);
        } catch (error) {
            if (error.response) {
                console.error('Lỗi khi tải danh sách sự kiện hiến máu:', error.response.data);
                alert(`Lỗi khi tải danh sách sự kiện hiến máu: ${error.response.data.message || error.response.status}`);
            } else if (error.request) {
                console.error('Không nhận được phản hồi từ server:', error.request);
                alert('Không thể kết nối đến máy chủ để tải sự kiện hiến máu. Vui lòng thử lại.');
            } else {
                console.error('Lỗi khi thiết lập yêu cầu:', error.message);
                alert('Có lỗi xảy ra khi tải sự kiện hiến máu. Vui lòng thử lại.');
            }
        }
    }, [setEvents]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewEvent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreateEvent = async (event) => {
        event.preventDefault();

        const startTimeToSend = `${newEvent.startTime}:00`;
        const endTimeToSend = `${newEvent.endTime}:00`;
        
        const eventDataToSend = {
            ...newEvent,
            startTime: startTimeToSend,
            endTime: endTimeToSend,
            maxSlot: parseInt(newEvent.maxSlot, 10),
            facilityId: 1
        };

        try {
            await axiosInstance.post('/event', eventDataToSend);
            alert('Sự kiện hiến máu đã được tạo thành công!');
            
            await fetchEvents();
            
            setNewEvent({
                name: '', date: '', startTime: '', endTime: '', address: '', maxSlot: ''
            });
            setShowCreateForm(false);

        } catch (error) {
            if (error.response) {
                console.error('Lỗi khi tạo sự kiện hiến máu:', error.response.data);
                alert(`Lỗi khi tạo sự kiện hiến máu: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                console.error('Không nhận được phản hồi từ server:', error.request);
                alert('Không nhận được phản hồi từ server khi tạo sự kiện hiến máu. Vui lòng thử lại.');
            } else {
                console.error('Lỗi khi gửi yêu cầu tạo sự kiện:', error.message);
                alert('Có lỗi xảy ra khi tạo sự kiện hiến máu. Vui lòng thử lại.');
            }
        }
    };

    const eventColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Tên Sự kiện', accessor: 'name' },
        { header: 'Ngày', accessor: 'date' },
        {
            header: 'Thời gian',
            accessor: 'timeRange',
            render: (row) => {
                const formatTime = (timeString) => {
                    if (!timeString) return '';
                    try {
                        const dateObj = new Date(`2000-01-01T${timeString}`);
                        return dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: true });
                    } catch (error) { // eslint-disable-line no-unused-vars
                        if (typeof timeString === 'string' && timeString.length >= 5) {
                            return timeString.substring(0, 5);
                        }
                        return timeString;
                    }
                };
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
                    'UPCOMING': 'Sắp diễn ra',
                    'CANCELLED': 'Đã hủy',
                };
                return statusMap[row.status] || row.status;
            }
        },
    ];

    return (
        <div className={styles.eventManagement}>
            <h2 className={styles.pageTitle}>Quản lý Sự kiện Hiến Máu</h2>

            <button className={styles.createButton} onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Ẩn Form Tạo Sự kiện' : 'Tạo Sự kiện Hiến Máu Mới'}
            </button>

            {showCreateForm && (
                <div className={styles.createForm}>
                    <h3>Tạo Sự kiện Hiến Máu Mới</h3>
                    <form onSubmit={handleCreateEvent}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Tên sự kiện:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newEvent.name}
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
                                value={newEvent.date}
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
                                value={newEvent.startTime}
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
                                value={newEvent.endTime}
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
                                value={newEvent.address}
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
                                value={newEvent.maxSlot}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                        </div>
                        <button type="submit" className={styles.submitButton}>Tạo Sự kiện</button>
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