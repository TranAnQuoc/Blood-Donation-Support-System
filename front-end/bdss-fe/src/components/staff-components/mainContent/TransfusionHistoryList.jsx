// src/components/staff-components/mainContent/TransfusionHistoryList.jsx
import React, { useState, useEffect } from 'react';
import styles from './TransfusionHistoryList.module.css';

const TransfusionHistoryList = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransfusionHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Thay thế bằng URL API thực tế của bạn
                // Ví dụ: GET /api/transfusions/history (lịch sử tất cả các ca truyền máu đã hoàn thành)
                const response = await fetch('http://localhost:8080/api/transfusions/history', {
                    headers: {
                        // Nếu cần xác thực: 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Không thể tải lịch sử nhận máu.');
                }

                const data = await response.json();
                setHistory(data);
            } catch (err) {
                console.error("Lỗi khi fetch lịch sử nhận máu:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransfusionHistory();
    }, []);

    if (isLoading) {
        return <div className={styles.loadingMessage}>Đang tải lịch sử nhận máu...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>Lỗi: {error}</div>;
    }

    if (history.length === 0) {
        return <div className={styles.noDataMessage}>Không có dữ liệu lịch sử nhận máu.</div>;
    }

    return (
        <div className={styles.tableContainer}>
            <h2 className={styles.title}>Lịch Sử Nhận Máu</h2>
            <p className={styles.description}>Tổng hợp các ca truyền máu đã được thực hiện.</p>

            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th className={styles.tableCell}>ID Ca Truyền</th>
                        <th className={styles.tableCell}>Tên Bệnh Nhân</th>
                        <th className={styles.tableCell}>Nhóm Máu</th>
                        <th className={styles.tableCell}>Ngày Truyền</th>
                        <th className={styles.tableCell}>Số Lượng (ml)</th>
                        <th className={styles.tableCell}>Cơ Sở</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map(item => (
                        <tr key={item.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>{item.id}</td>
                            <td className={styles.tableCell}>{item.patientName || item.user?.fullName || 'N/A'}</td>
                            <td className={styles.tableCell}>{item.bloodType}</td>
                            <td className={styles.tableCell}>{new Date(item.transfusionDate).toLocaleDateString()}</td>
                            <td className={styles.tableCell}>{item.quantity}</td>
                            <td className={styles.tableCell}>{item.facilityName || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransfusionHistoryList;