import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styles from './ScheduleManagement.module.css';
import DataTableContainer from '../../mainContent/DataTableContainer';
import axiosInstance from '../../../../configs/axios';

const ScheduleManagement = () => {
    
    const user = useSelector(state => state.user); // eslint-disable-line no-unused-vars

    const [schedules, setSchedules] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newSchedule, setNewSchedule] = useState({
        name: '',
        date: '',
        startTime: '',
        endTime: '',
        address: '',
        maxSlot: '',
        facilityId: ''
    });

    const fetchSchedules = useCallback(async () => {
        try {
            const response = await axiosInstance.get('schedules/staff-view');
            setSchedules(response.data);
        } catch (error) {
            if (error.response) {
                console.error('Lỗi khi tải danh sách lịch hiến máu:', error.response.data);
                alert(`Lỗi khi tải danh sách lịch hiến máu: ${error.response.data.message || error.response.status}`);
            } else if (error.request) {
                console.error('Không nhận được phản hồi từ server:', error.request);
                alert('Không thể kết nối đến máy chủ để tải lịch hiến máu. Vui lòng thử lại.');
            } else {
                console.error('Lỗi khi thiết lập yêu cầu:', error.message);
                alert('Có lỗi xảy ra khi tải lịch hiến máu. Vui lòng thử lại.');
            }
        }
    }, [setSchedules]);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSchedule(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreateSchedule = async (e) => {
        e.preventDefault();

        const scheduleDataToSend = {
            ...newSchedule,
            startTime: newSchedule.startTime + ':00',
            endTime: newSchedule.endTime + ':00',
            maxSlot: parseInt(newSchedule.maxSlot, 10),
            facilityId: parseInt(newSchedule.facilityId, 10)
        };

        try {
            const response = await axiosInstance.post('schedules', scheduleDataToSend); // eslint-disable-line no-unused-vars
            
            await fetchSchedules();
            
            setNewSchedule({
                name: '', date: '', startTime: '', endTime: '', address: '', maxSlot: '', facilityId: ''
            });
            setShowCreateForm(false);
            alert('Lịch hiến máu đã được tạo thành công!');

        } catch (error) {
            if (error.response) {
                console.error('Lỗi khi tạo lịch hiến máu:', error.response.data);
                alert(`Lỗi khi tạo lịch hiến máu: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                console.error('Không nhận được phản hồi từ server:', error.request);
                alert('Không nhận được phản hồi từ server khi tạo lịch hiến máu. Vui lòng thử lại.');
            } else {
                console.error('Lỗi khi gửi yêu cầu tạo lịch:', error.message);
                alert('Có lỗi xảy ra khi tạo lịch hiến máu. Vui lòng thử lại.');
            }
        }
    };

    const scheduleColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Tên Sự kiện', accessor: 'name' },
        { header: 'Ngày', accessor: 'date' },
        {
            header: 'Thời gian',
            accessor: 'timeRange',
            render: (row) => {
                const start = row.startTime ? row.startTime.substring(0, 5) : '';
                const end = row.endTime ? row.endTime.substring(0, 5) : '';
                return `${start} - ${end}`;
            }
        },
        { header: 'Địa điểm', accessor: 'address' },
        {
            header: 'Cơ sở ID',
            accessor: 'facilityId', // Giữ accessor để đảm bảo cột tồn tại
            render: (row) => row.facility ? row.facility.id : 'N/A' // <-- THAY ĐỔI Ở ĐÂY
        },
        {
            header: 'SL Hiện tại/Tối đa',
            accessor: 'slots',
            render: (row) => `${row.currentSlot || 0}/${row.maxSlot}`
        },
        { header: 'Trạng thái', accessor: 'status' },
    ];

    return (
        <div className={styles.scheduleManagement}>
            <h2 className={styles.pageTitle}>Quản lý Lịch Hiến Máu</h2>

            <button className={styles.createButton} onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Ẩn Form Tạo Lịch' : 'Tạo Lịch Hiến Máu Mới'}
            </button>

            {showCreateForm && (
                <div className={styles.createForm}>
                    <h3>Tạo Lịch Hiến Máu Mới</h3>
                    <form onSubmit={handleCreateSchedule}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Tên sự kiện:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newSchedule.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="facilityId">ID Cơ sở:</label>
                            <input
                                type="number"
                                id="facilityId"
                                name="facilityId"
                                value={newSchedule.facilityId}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="date">Ngày:</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={newSchedule.date}
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
                                value={newSchedule.startTime}
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
                                value={newSchedule.endTime}
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
                                value={newSchedule.address}
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
                                value={newSchedule.maxSlot}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                        </div>
                        <button type="submit" className={styles.submitButton}>Tạo Lịch</button>
                    </form>
                </div>
            )}

            <div className={styles.scheduleList}>
                <h3>Danh sách Lịch Hiến Máu Hiện có</h3>
                {schedules.length > 0 ? (
                    <DataTableContainer>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    {scheduleColumns.map((col, index) => (
                                        <th key={col.header || index}>{col.header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((row, rowIndex) => (
                                    <tr key={row.id || rowIndex}>
                                        {scheduleColumns.map((col, colIndex) => (
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
                    <p>Chưa có lịch hiến máu nào được tạo.</p>
                )}
            </div>
        </div>
    );
};

export default ScheduleManagement;