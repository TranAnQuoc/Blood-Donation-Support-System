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
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);


    const donationTypeMap = {
        WHOLE_BLOOD: 'Toàn phần',
        PLATELETS: 'Tiểu cầu',
        PLASMA: 'Huyết tương',
        OTHER: 'Khác'
    };

    const translateDonationType = (type) => donationTypeMap[type] || 'Không xác định';


    const fetchMyDonationHistories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/donation-histories/my-history');
            console.log("Dữ liệu lịch sử hiến máu của tôi:", response.data);
            
            // const completedHistories = response.data.filter(history => history.status === "COMPLETED");
            // setHistories(completedHistories);
            setHistories(response.data);
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
            <h2 className={styles.pageTitle}>LỊCH SỬ HIẾN MÁU CỦA TÔI</h2>

            {histories.length === 0 ? (
                <>
                    <div className={styles.noHistoryMessage}>
                        <p>Bạn chưa có lịch sử hiến máu nào được ghi nhận.</p>
                    </div>
                    
                    <div>
                        <button className={styles.backButton} onClick={handleGoBack}>
                            Quay lại
                        </button>
                    </div>
                </>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.historyTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ngày hiến</th>
                                <th>Loại hiến</th>
                                <th>Số lượng (ml)</th>
                                {/* <th>Cơ sở</th> */}
                                <th>Địa chỉ</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                                <th>Nhân viên xử lý</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {histories.map((history) => (
                                <tr key={history.id}>
                                    <td>{history.id}</td>
                                    <td>{formatDateTime(history.donationDate) || 'N/A'}</td>
                                    <td>{translateDonationType(history.donationType)}</td>
                                    <td>{history.quantity || 'N/A'}</td>
                                    {/* <td>{history.facilityName || 'N/A'}</td> */}
                                    <td>{history.address || 'N/A'}</td>
                                    <td>{history.note || 'Không có'}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[history.status ? history.status.toLowerCase() : '']}`}>
                                            {history.status === 'COMPLETED' ? 'Hoàn thành' :
                                            (history.status === 'FAILED' ? 'Thất bại' : history.status || 'N/A')}
                                        </span>
                                    </td>
                                    <td>{history.staff?.fullName || 'N/A'}</td>
                                    <td>
                                        <button
                                            className={styles.detailButton}
                                            onClick={() => {
                                                setSelectedHistory(history);
                                                setShowDetailModal(true);
                                            }}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
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

            {showDetailModal && selectedHistory && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContentLarge}>
                        <h3 className={styles.modalTitle}>Chi tiết lịch sử hiến máu</h3>
                        <div className={styles.detailGrid}>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>ID:</span>
                                <span className={styles.value}>{selectedHistory.id}</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Ngày hiến:</span>
                                <span className={styles.value}>{formatDateTime(selectedHistory.donationDate)}</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Loại hiến:</span>
                                <span className={styles.value}>{translateDonationType(selectedHistory.donationType)}</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Số lượng:</span>
                                <span className={styles.value}>{selectedHistory.quantity} ml</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Địa chỉ:</span>
                                <span className={styles.value}>{selectedHistory.address}</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Ghi chú:</span>
                                <span className={styles.value}>{selectedHistory.note || 'Không có'}</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Trạng thái:</span>
                                <span className={styles.value}>
                                    {selectedHistory.status === 'COMPLETED' ? 'Hoàn thành' : 'Thất bại'}
                                </span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Nhân viên xử lý:</span>
                                <span className={styles.value}>{selectedHistory.staff?.fullName || 'N/A'}</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Huyết áp:</span>
                                <span className={styles.value}>{selectedHistory.bloodPressure || 'N/A'}</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Nhiệt độ:</span>
                                <span className={styles.value}>{selectedHistory.temperature || 'N/A'} °C</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Nhịp tim:</span>
                                <span className={styles.value}>{selectedHistory.heartRate || 'N/A'} bpm</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Cân nặng:</span>
                                <span className={styles.value}>{selectedHistory.weight || 'N/A'} kg</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Chiều cao:</span>
                                <span className={styles.value}>{selectedHistory.height || 'N/A'} cm</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Hemoglobin:</span>
                                <span className={styles.value}>{selectedHistory.hemoglobin || 'N/A'} g/L</span>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.closeButton}
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedHistory(null);
                                }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDonationHistory;
