import React, { useState, useEffect, useCallback } from 'react';
import styles from './EventListAdmin.module.css';
import DataTableContainer from '../../mainContent/DataTableContainer';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';

const EventListAdmin = () => {
    const [events, setEvents] = useState([]);

    const formatTime = (timeString) => {
        if (!timeString) return '';
        try {
            const dateObj = new Date(`2000-01-01T${timeString}`);
            return dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
        } catch {
            return timeString.substring(0, 5);
        }
    };

    const fetchEvents = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('/event');
            setEvents(data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách sự kiện hiến máu:', error);
            toast.error('Không thể tải danh sách sự kiện. Vui lòng thử lại.');
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const eventColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Tên Sự kiện', accessor: 'name' },
        {
            header: 'Ngày',
            accessor: 'date',
            render: (row) => {
                if (!row.date) return 'N/A';
                try {
                    const [year, month, day] = row.date.split('-');
                    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
                } catch {
                    return row.date;
                }
            }
        },
        {
            header: 'Thời gian',
            accessor: 'timeRange',
            render: (row) => `${formatTime(row.startTime)} - ${formatTime(row.endTime)}`
        },
        { header: 'Địa điểm', accessor: 'address' },
        {
            header: 'SL Hiện tại/Tối đa',
            accessor: 'slots',
            render: (row) => `${row.currentSlot || 0}/${row.maxSlot}`
        },
        {
            header: 'Trạng thái',
            accessor: 'status',
            render: (row) => row.status === 'ACTIVE' ? 'Đang diễn ra' : 'Đã kết thúc'
        }
    ];

    return (
        <div className={styles.eventManagement}>
            <h2 className={styles.pageTitle}>Danh Sách Sự kiện Hiến Máu</h2>
            <div className={styles.eventList}>
                <h3>Danh sách sự kiện đang diễn ra</h3>
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

export default EventListAdmin;
