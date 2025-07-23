import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './MyDonationRequest.module.css';

const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        const date = new Date(isoString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    } catch {
        return 'Ngày/giờ không hợp lệ';
    }
};

const MyDonationRequests = () => {
    const [myRequest, setMyRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const navigate = useNavigate();

    const fetchMyDonationRequest = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.get('/donation-requests/my-requests');
            if (Array.isArray(res.data) && res.data.length > 0) {
                setMyRequest(res.data[0]);
            } else {
                setMyRequest(null);
            }
        } catch (err) {
            console.error("Lỗi khi tải yêu cầu hiến máu:", err);
            setError('Không thể tải thông tin yêu cầu hiến máu. Vui lòng thử lại sau.');
            toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyDonationRequest();
    }, []);

    const handleCancelRequest = async () => {
        try {
            await axiosInstance.put(`/donation-requests/cancel/${myRequest.id}`);
            toast.success('Đơn đăng ký đã được hủy thành công!');
            setShowConfirmModal(false);
            fetchMyDonationRequest();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Không thể hủy đơn. Vui lòng thử lại.';
            toast.error(`Lỗi: ${errorMsg}`);
        }
    };

    const handleGoBack = () => navigate(-1);

    if (loading) return <div className={styles.loadingMessage}>Đang tải đơn đăng ký hiến máu của bạn...</div>;
    if (error) return <div className={styles.errorMessage}>{error}</div>;

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
                        <span className={`${styles.statusBadge} ${styles[myRequest.statusRequest?.toLowerCase()]}`}>
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
                        <span className={styles.label}>Ghi chú của người duyệt:</span>
                        <span className={styles.value}>{myRequest.note || 'Không có'}</span>
                    </div>

                    <div className={styles.actionButtons}>
                        {myRequest.statusRequest === 'PENDING' && (
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowConfirmModal(true)}
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

            {showConfirmModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <p>Bạn có chắc chắn muốn <strong>HỦY</strong> đơn đăng ký hiến máu này không?</p>
                        <div className={styles.modalActions}>
                            <button className={styles.confirmButton} onClick={handleCancelRequest}>
                                Xác nhận
                            </button>
                            <button className={styles.cancelButton} onClick={() => setShowConfirmModal(false)}>
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDonationRequests;
