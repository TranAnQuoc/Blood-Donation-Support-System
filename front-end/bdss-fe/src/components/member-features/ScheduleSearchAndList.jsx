// src/components/common/ScheduleSearchAndList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../configs/axios';
import DataTable from '../common/Table/DataTable'; // Đảm bảo đường dẫn này đúng với vị trí DataTable.jsx
import styles from './ScheduleSearchAndList.module.css';

const ScheduleSearchAndList = () => {
    const [schedules, setSchedules] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [dateError, setDateError] = useState(''); // <-- THÊM STATE MỚI CHO LỖI NGÀY

    // Hàm fetchSchedules được cập nhật để nhận tham số ngày
    const fetchSchedulesByDate = useCallback(async (start, end) => {
        try {
            let url = 'schedules/by-date';
            const params = {};

            if (start) {
                params.from = start; // Sửa lại nếu backend dùng 'startDate'
            }
            if (end) {
                params.to = end; // Sửa lại nếu backend dùng 'endDate'
            }

            const response = await axiosInstance.get(url, { params });
            setSchedules(response.data);
            setHasSearched(true);
            console.log('Lịch hiến máu theo ngày:', response.data);
        } catch (error) {
            console.error('Lỗi khi tải lịch hiến máu theo ngày:', error);
            setSchedules([]);
            setHasSearched(true);
            // Xử lý lỗi từ backend (ví dụ: lỗi tham số 'from' không có)
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Lỗi từ máy chủ: ${error.response.data.message}`);
            } else {
                alert('Không thể tải lịch hiến máu. Vui lòng thử lại.');
            }
        }
    }, []);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setStartDate(today);
        // fetchSchedulesByDate(today, ''); // Có thể tự động gọi tìm kiếm khi tải trang
    }, [fetchSchedulesByDate]);


    const handleSearch = (e) => {
        e.preventDefault();
        setDateError(''); // <-- RESET LỖI NGÀY MỖI KHI TÌM KIẾM MỚI

        if (!startDate && !endDate) {
            setDateError('Vui lòng chọn ít nhất một ngày để tìm kiếm.'); // <-- SỬ DỤNG dateError
            setSchedules([]);
            setHasSearched(false);
            return;
        }

        // Đảm bảo startDate <= endDate
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            setDateError('Ngày bắt đầu không được lớn hơn ngày kết thúc.'); // <-- SỬ DỤNG dateError
            setSchedules([]); // Xóa dữ liệu cũ
            setHasSearched(false); // Reset trạng thái tìm kiếm
            return; // Dừng hàm nếu có lỗi ngày
        }
        
        fetchSchedulesByDate(startDate, endDate);
    };

    // Định nghĩa các cột cho DataTable, tương tự như ScheduleManagement nhưng có thể điều chỉnh
    const scheduleColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Tên Sự kiện', accessor: 'name' },
        { header: 'Ngày', accessor: 'date' },
        {
            header: 'Thời gian',
            accessor: 'timeRange',
            render: (row) => {
                const formatTimeToAMPM = (timeString) => {
                    if (!timeString) return '';
                    const [hours, minutes] = timeString.split(':');
                    const hour = parseInt(hours, 10);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
                    return `${formattedHour}:${minutes} ${ampm}`;
                };
                const start = formatTimeToAMPM(row.startTime);
                const end = formatTimeToAMPM(row.endTime);
                return `${start} - ${end}`;
            }
        },
        { header: 'Địa điểm', accessor: 'address' },
        {
            header: 'Cơ sở',
            accessor: 'facilityName',
            render: (row) => row.facility ? row.facility.name : 'N/A'
        },
        {
            header: 'SL Hiện tại/Tối đa',
            accessor: 'slots',
            render: (row) => `${row.currentSlot || 0}/${row.maxSlot}`
        },
        { header: 'Trạng thái', accessor: 'status' },
    ];

    return (
        <div className={styles.scheduleSearchAndList}>
            <h2 className={styles.pageTitle}>Tìm kiếm Lịch Hiến Máu</h2>

            <form onSubmit={handleSearch} className={styles.searchForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="startDate">Từ ngày:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setDateError(''); // Xóa lỗi khi người dùng thay đổi ngày
                        }}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="endDate">Đến ngày:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setDateError(''); // Xóa lỗi khi người dùng thay đổi ngày
                        }}
                    />
                </div>
                <button type="submit" className={styles.searchButton}>Tìm kiếm</button>
            </form>

            {/* HIỂN THỊ THÔNG BÁO LỖI NGÀY Ở ĐÂY */}
            {dateError && (
                <p className={styles.dateErrorMessage}>{dateError}</p>
            )}

            <div className={styles.resultsSection}>
                <h3>Kết quả tìm kiếm</h3>
                {hasSearched ? (
                    schedules.length > 0 ? (
                        <DataTable data={schedules} columns={scheduleColumns} />
                    ) : (
                        <p>Không tìm thấy lịch hiến máu nào trong khoảng thời gian đã chọn.</p>
                    )
                ) : (
                    <p>Sử dụng bộ lọc trên để tìm kiếm lịch hiến máu.</p>
                )}
            </div>
        </div>
    );
};

export default ScheduleSearchAndList;