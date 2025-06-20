import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../configs/axios';
import DataTable from '../../common/Table/DataTable';
import styles from './ScheduleSearchAndList.module.css';
import { useNavigate } from 'react-router-dom';

const ScheduleSearchAndList = () => {
    const [schedules, setSchedules] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [dateError, setDateError] = useState('');
    const navigate = useNavigate();

    const fetchSchedulesByDate = useCallback(async (start, end) => {
        try {
            let url = 'schedules/by-date';
            const params = {};

            if (start) {
                params.from = start;
            }
            if (end) {
                params.to = end;
            }

            const response = await axiosInstance.get(url, { params });
            setSchedules(response.data);
            setHasSearched(true);
            console.log('Lịch hiến máu theo ngày:', response.data);
        } catch (error) {
            console.error('Lỗi khi tải lịch hiến máu theo ngày:', error);
            setSchedules([]);
            setHasSearched(true);
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
    }, [fetchSchedulesByDate]);


    const handleSearch = (e) => {
        e.preventDefault();
        setDateError('');

        if (!startDate && !endDate) {
            setDateError('Vui lòng chọn ít nhất một ngày để tìm kiếm.');
            setSchedules([]);
            setHasSearched(false);
            return;
        }

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            setDateError('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
            setSchedules([]);
            setHasSearched(false);
            return;
        }
        
        fetchSchedulesByDate(startDate, endDate);
    };

    const handleRegisterClick = (scheduleId) => {
        navigate(`/member/register-donation?scheduleId=${scheduleId}`);
    };

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
        {
            header: 'Thao tác',
            accessor: 'actions',
            render: (row) => {
                const isAvailable = row.status === 'ACTIVE' && (row.currentSlot < row.maxSlot);
                return (
                    isAvailable ? (
                        <button
                            className={styles.registerButton} // Sử dụng CSS module
                            onClick={() => handleRegisterClick(row.id)}
                        >
                            Đăng ký
                        </button>
                    ) : (
                        <span className={styles.unavailableText}>Không khả dụng</span>
                    )
                );
            }
        },
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
                            setDateError('');
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
                            setDateError('');
                        }}
                    />
                </div>
                <button type="submit" className={styles.searchButton}>Tìm kiếm</button>
            </form>

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