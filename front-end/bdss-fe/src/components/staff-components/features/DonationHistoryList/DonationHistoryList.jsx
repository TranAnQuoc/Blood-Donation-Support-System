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

    const fetchDonationHistories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/donation-histories/all');
            setHistories(response.data);
            console.log("Đã tải lịch sử hiến máu:", response.data);
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
            {/* <ContentHeader title="Lịch Sử Hiến Máu" /> */}
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
                                <th>Cơ sở</th>
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
                                    <td>{history.bloodType ? `${history.bloodType.type}${history.bloodType.rhFactor}` : 'N/A'}</td>
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
                )}
            </div>
        </div>
    );
};

export default DonationHistoryList;