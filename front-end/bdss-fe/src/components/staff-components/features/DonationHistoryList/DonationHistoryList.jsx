import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios';
import styles from './DonationHistoryList.module.css';

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

const DonationHistoryList = () => {
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatDonationType = (type) => {
        switch (type) {
            case 'WHOLE_BLOOD': return 'Toàn phần';
            case 'PLASMA': return 'Huyết tương';
            case 'PLATELETS': return 'Tiểu cầu';
            default: return type || 'N/A';
        }
    };

    const formatStatus = (status) => {
        switch (status) {
            case 'WAITING': return 'Chờ xử lý';
            case 'SCREENING': return 'Đang khám sàng lọc';
            case 'SCREENING_FAILED': return 'Không đạt sàng lọc';
            case 'IN_PROCESS': return 'Đang thực hiện';
            case 'COMPLETED': return 'Hoàn thành';
            case 'FAILED': return 'Thất bại';
            case 'DONOR_CANCEL': return 'Người hiến hủy';
            default: return status || 'N/A';
        }
    };

    const fetchDonationHistories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/donation-histories/all');
            setHistories(response.data);
            console.log("Đã tải lịch sử hiến máu:", response.data);
            // Lọc chỉ các quy trình có trạng thái "COMPLETED"
            // const completedHistories = response.data.filter(history => history.status === "COMPLETED");
            // setHistories(completedHistories);
            // console.log("Đã tải và lọc lịch sử hiến máu (chỉ Hoàn thành):", completedHistories);
        } catch (err) {
            console.error("Lỗi khi tải lịch sử hiến máu:", err);
            setError('Không thể tải lịch sử hiến máu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonationHistories();
    }, []);

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải lịch sử hiến máu...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.donationHistoryListContainer}>
            <h2 className={styles.listTitle}>Danh Sách Lịch Sử Hiến Máu</h2>
            <div className={styles.tableWrapper}>
                {histories.length === 0 ? (
                    <p className={styles.noHistoryMessage}>Không có lịch sử hiến máu nào.</p>
                ) : (
                    <table className={styles.donationHistoryTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Người hiến</th>
                                <th>SĐT</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>Nhóm máu</th>
                                <th>Ngày hiến</th>
                                <th>Loại hiến</th>
                                <th>Số lượng (ml)</th>
                                <th>Địa chỉ</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                                <th>Nhân viên</th>
                            </tr>
                        </thead>
                        <tbody>
                            {histories.map((history) => (
                                <tr key={history.id}>
                                    <td>{history.id}</td>
                                    <td>{history.donorName || 'N/A'}</td>
                                    <td>{history.donorPhone || 'N/A'}</td>
                                    <td>{history.donorGender === 'MALE' ? 'Nam' : (history.donorGender === 'FEMALE' ? 'Nữ' : 'Khác')}</td>
                                    <td>{formatDateTime(history.donorDateOfBirth) || 'N/A'}</td>
                                    <td>{history.bloodType}</td>
                                    <td>{formatDateTime(history.donationDate) || 'N/A'}</td>
                                    <td>{formatDonationType(history.donationType) || 'N/A'}</td>
                                    <td>{history.quantity || 'N/A'}</td>
                                    <td>{history.address || 'N/A'}</td>
                                    <td>{history.note || 'Không có'}</td>
                                    <td>
                                        <span
                                            className={`${styles.statusBadge} ${
                                                styles[history.status?.toLowerCase()]
                                            }`}
                                            >
                                            {formatStatus(history.status)}
                                        </span>
                                    </td>
                                    <td>{history.staffName || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DonationHistoryList;