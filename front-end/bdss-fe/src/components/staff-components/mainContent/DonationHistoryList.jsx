// src/components/staff-components/mainContent/DonationHistoryList.jsx
import React, { useState, useEffect } from 'react';
import styles from './DonationHistoryList.module.css';

const DonationHistoryList = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDonationHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Thay thế bằng URL API thực tế của bạn
                // Ví dụ: GET /api/donations/history (lịch sử tất cả các lần hiến máu đã hoàn thành)
                const response = await fetch('http://localhost:8080/api/donations/history', {
                    headers: {
                        // Nếu cần xác thực: 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Không thể tải lịch sử hiến máu.');
                }

                const data = await response.json();
                setHistory(data);
            } catch (err) {
                console.error("Lỗi khi fetch lịch sử hiến máu:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDonationHistory();
    }, []);

    if (isLoading) {
        return <div className={styles.loadingMessage}>Đang tải lịch sử hiến máu...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>Lỗi: {error}</div>;
    }

    if (history.length === 0) {
        return <div className={styles.noDataMessage}>Không có dữ liệu lịch sử hiến máu.</div>;
    }

    return (
        <div className={styles.tableContainer}>
            <h2 className={styles.title}>Lịch Sử Hiến Máu</h2>
            <p className={styles.description}>Tổng hợp các lần hiến máu đã được thực hiện.</p>

            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th className={styles.tableCell}>ID Hiến Máu</th>
                        <th className={styles.tableCell}>Tên Người Hiến</th>
                        <th className={styles.tableCell}>Nhóm Máu</th>
                        <th className={styles.tableCell}>Ngày Hiến</th>
                        <th className={styles.tableCell}>Số Lượng (ml)</th>
                        <th className={styles.tableCell}>Cơ Sở</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map(item => (
                        <tr key={item.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>{item.id}</td>
                            <td className={styles.tableCell}>{item.donorName || item.user?.fullName || 'N/A'}</td>
                            <td className={styles.tableCell}>{item.bloodType}</td>
                            <td className={styles.tableCell}>{new Date(item.donationDate).toLocaleDateString()}</td>
                            <td className={styles.tableCell}>{item.quantity}</td>
                            <td className={styles.tableCell}>{item.facilityName || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DonationHistoryList;