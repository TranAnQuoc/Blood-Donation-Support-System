import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios';
import styles from './DonationProcess.module.css';
import { useNavigate } from 'react-router-dom';

const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        if (isoString.includes('T')) {
            const date = new Date(isoString);
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            return date.toLocaleString('vi-VN', options);
        } else {
            const [year, month, day] = isoString.split('-');
            return `${day}/${month}/${year}`;
        }
    } catch (e) {
        console.error("Chuỗi ngày/giờ không hợp lệ:", isoString, e);
        return 'Ngày/giờ không hợp lệ';
    }
};

const getStatusName = (status) => {
    switch (status) {
        case 'WAITING': return 'Đang chờ';
        case 'SCREENING': return 'Đang sàng lọc';
        case 'SCREENING_FAILED': return 'Sàng lọc thất bại';
        case 'IN_PROCESS': return 'Đang tiến hành';
        case 'COMPLETED': return 'Hoàn thành';
        case 'FAILED': return 'Thất bại';
        case 'DONOR_CANCEL': return 'Người hiến hủy bỏ';
        default: return 'Không xác định';
    }
};

const DonationProcess = () => {
    const navigate = useNavigate();
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProcesses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/donation-processes/list');
            setProcesses(response.data);
            console.log("Đã tải danh sách quy trình hiến máu:", response.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách quy trình:", err);
            setError('Không thể tải danh sách quy trình hiến máu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProcesses();
    }, []);

    const handleViewDetailClick = (processId) => {
        navigate(`/staff-dashboard/donation-process/${processId}`);
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải danh sách quy trình hiến máu...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.donationProcessListContainer}>
            <h2>Danh sách Quy trình Hiến máu</h2>
            
            {processes.length === 0 ? (
                <p className={styles.noProcessesMessage}>Không có quy trình hiến máu nào đang chờ xử lý.</p>
            ) : (
                <div className={styles.processCardsContainer}>
                    {processes.map((process) => (
                        <div key={process.id} className={styles.processCard}>
                            <h3>ID Quy trình: {process.id}</h3>
                            <p><strong>Người hiến:</strong> {process.donorFullName || 'N/A'}</p>
                            <p><strong>Nhóm máu ĐK:</strong> {process.donorBloodType ? `${process.donorBloodType.type}${process.donorBloodType.rhFactor}` : 'N/A'}</p>
                            <p><strong>Sự kiện:</strong> {process.eventName || 'N/A'}</p>
                            <p><strong>Ngày sự kiện:</strong> {formatDateTime(process.date) || 'N/A'}</p>
                            <p><strong>Giờ sự kiện:</strong> {formatDateTime(process.startTime) || 'N/A'}</p>
                            <p>
                                <strong>Trạng thái:</strong>
                                <span className={`${styles.statusBadge} ${styles[process.process ? process.process.toLowerCase() : '']}`}>
                                    {getStatusName(process.process)}
                                </span>
                            </p>
                            <button
                                className={styles.viewDetailButton}
                                onClick={() => handleViewDetailClick(process.id)}
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DonationProcess;
