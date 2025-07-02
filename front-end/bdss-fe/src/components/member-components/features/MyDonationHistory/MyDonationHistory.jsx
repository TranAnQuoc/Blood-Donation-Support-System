import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import styles from './MyDonationHistory.module.css';

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

const MyDonationHistory = () => {
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchMyDonationHistories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/donation-histories/my-history');
            console.log("Dữ liệu lịch sử hiến máu của tôi:", response.data);
            
            const completedHistories = response.data.filter(history => history.status === "COMPLETED");
            setHistories(completedHistories);
        } catch (err) {
            console.error("Lỗi khi tải lịch sử hiến máu của tôi:", err);
            setError('Không thể tải lịch sử hiến máu của bạn. Vui lòng thử lại sau.');
            toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyDonationHistories();
    }, []);

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải lịch sử hiến máu của bạn...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.myDonationHistoryContainer}>
            <h2 className={styles.pageTitle}>Lịch Sử Hiến Máu Của Tôi</h2>

            {histories.length === 0 ? (
                <div className={styles.noHistoryMessage}>
                    <p>Bạn chưa có lịch sử hiến máu nào được ghi nhận.</p>
                    <button className={styles.backButton} onClick={handleGoBack}>
                        Quay lại
                    </button>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.historyTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ngày hiến</th>
                                <th>Loại hiến</th>
                                <th>Số lượng (ml)</th>
                                <th>Cơ sở</th>
                                <th>Địa chỉ</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                                <th>Nhân viên xử lý</th>
                            </tr>
                        </thead>
                        <tbody>
                            {histories.map((history) => (
                                <tr key={history.id}>
                                    <td>{history.id}</td>
                                    <td>{formatDateTime(history.donationDate) || 'N/A'}</td>
                                    <td>{history.donationType || 'N/A'}</td>
                                    <td>{history.quantity || 'N/A'}</td>
                                    <td>{history.facilityName || 'N/A'}</td>
                                    <td>{history.address || 'N/A'}</td>
                                    <td>{history.note || 'Không có'}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[history.status ? history.status.toLowerCase() : '']}`}>
                                            {history.status === 'COMPLETED' ? 'Hoàn thành' :
                                             (history.status === 'FAILED' ? 'Thất bại' : history.status || 'N/A')}
                                        </span>
                                    </td>
                                    <td>{history.staffName || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={styles.actionButtons}>
                        <button className={styles.backButton} onClick={handleGoBack}>
                            Quay lại
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDonationHistory;
