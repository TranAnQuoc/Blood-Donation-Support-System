import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import styles from './MyDonationRequest.module.css';

const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
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
    } catch (e) {
        console.error("Chuỗi ngày/giờ không hợp lệ:", isoString, e);
        return 'Ngày/giờ không hợp lệ';
    }
};

const MyDonationRequests = () => {
    const [myRequest, setMyRequest] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchMyDonationRequest = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/donation-requests/my-latest');
            if (Array.isArray(response.data) && response.data.length > 0) {
                setMyRequest(response.data[0]); 
                console.log("Đã tải yêu cầu hiến máu gần nhất:", response.data[0]);
            } else {
                setMyRequest(null); 
                console.log("Không tìm thấy yêu cầu hiến máu nào.");
            }
        } catch (err) {
            console.error("Lỗi khi tải yêu cầu hiến máu của tôi:", err);
            setError('Không thể tải thông tin yêu cầu hiến máu của bạn. Vui lòng thử lại sau.');
            toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyDonationRequest();
    }, []);

    const handleCancelRequest = async (requestId) => {
        if (window.confirm('Bạn có chắc chắn muốn HỦY đơn đăng ký hiến máu này không?')) {
            try {
                await axiosInstance.put(`/donation-requests/cancel/${requestId}`);
                toast.success('Đơn đăng ký đã được hủy thành công!');
                fetchMyDonationRequest(); 
            } catch (err) {
                console.error('Lỗi khi hủy đơn đăng ký:', err);
                const errorMessage = err.response?.data?.message || 'Không thể hủy đơn đăng ký. Vui lòng thử lại.';
                toast.error(`Lỗi: ${errorMessage}`);
            }
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải đơn đăng ký hiến máu của bạn...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.myDonationRequestsContainer}>
            <h2 className={styles.pageTitle}>Đơn Đăng Ký Hiến Máu Của Tôi</h2>

            {!myRequest ? (
                <div className={styles.noRequestsMessage}>
                    <p>Bạn chưa có đơn đăng ký hiến máu nào.</p>
                    <button className={styles.backButton} onClick={handleGoBack}>
                        Quay lại
                    </button>
                </div>
            ) : (
                <div className={styles.detailSection}>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>ID Yêu cầu:</span>
                        <span className={styles.value}>{myRequest.id}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Sự kiện:</span>
                        <span className={styles.value}>{myRequest.eventName || 'N/A'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Nhóm máu ĐK:</span>
                        <span className={styles.value}>
                            {myRequest.donorBloodType
                                ? `${myRequest.donorBloodType.type}${myRequest.donorBloodType.rhFactor}`
                                : 'N/A'}
                        </span>
                    </div>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Lý do đăng ký:</span>
                        <span className={styles.value}>{myRequest.reason || 'Không có'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Thời gian yêu cầu:</span>
                        <span className={styles.value}>{formatDateTime(myRequest.requestTime)}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Trạng thái:</span>
                        <span className={`${styles.statusBadge} ${styles[myRequest.statusRequest ? myRequest.statusRequest.toLowerCase() : '']}`}>
                            {myRequest.statusRequest === 'PENDING' ? 'Đang chờ' :
                             myRequest.statusRequest === 'APPROVED' ? 'Đã duyệt' :
                             myRequest.statusRequest === 'REJECTED' ? 'Đã từ chối' :
                             myRequest.statusRequest === 'CANCELED' ? 'Đã hủy' :
                             myRequest.statusRequest || 'N/A'}
                        </span>
                    </div>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Người duyệt:</span>
                        <span className={styles.value}>{myRequest.approverFullName || 'Chưa duyệt'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Thời gian duyệt:</span>
                        <span className={styles.value}>{formatDateTime(myRequest.approvedTime)}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Ghi chú:</span>
                        <span className={styles.value}>{myRequest.note || 'Không có'}</span>
                    </div>

                    <div className={styles.actionButtons}>
                        {myRequest.statusRequest === 'PENDING' && (
                            <button 
                                className={styles.cancelButton} 
                                onClick={() => handleCancelRequest(myRequest.id)}
                            >
                                Hủy Đơn Đăng Ký
                            </button>
                        )}
                        <button className={styles.backButton} onClick={handleGoBack}>
                            Quay lại
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDonationRequests;
