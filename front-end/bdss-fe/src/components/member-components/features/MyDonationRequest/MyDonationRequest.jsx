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

const formatBoolean = (value) => {
    if (value === true) return 'Có';
    if (value === false) return 'Không';
    return 'N/A';
};

const MyDonationRequests = () => {
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
    const [selectedRequestToCancel, setSelectedRequestToCancel] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRequestDetail, setSelectedRequestDetail] = useState(null);
    const navigate = useNavigate();

    const fetchMyDonationRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.get('/donation-requests/my-requests');
            setMyRequests(res.data || []);
        } catch (err) {
            console.error("Lỗi khi tải yêu cầu hiến máu:", err);
            setError('Không thể tải thông tin yêu cầu hiến máu. Vui lòng thử lại sau.');
            toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyDonationRequests();
    }, []);

    const handleCancelRequest = async () => {
        if (!selectedRequestToCancel) return;

        try {
            await axiosInstance.put(`/donation-requests/cancel/${selectedRequestToCancel.id}`);
            toast.success('Đơn đăng ký đã được hủy thành công!');
            setShowConfirmCancelModal(false);
            setSelectedRequestToCancel(null);
            fetchMyDonationRequests();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Không thể hủy đơn. Vui lòng thử lại.';
            toast.error(`Lỗi: ${errorMsg}`);
        }
    };

    const handleOpenCancelModal = (request) => {
        setSelectedRequestToCancel(request);
        setShowConfirmCancelModal(true);
    };

    const handleCloseCancelModal = () => {
        setShowConfirmCancelModal(false);
        setSelectedRequestToCancel(null);
    };

    const handleOpenDetailModal = (request) => {
        setSelectedRequestDetail(request);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedRequestDetail(null);
    };

    const handleGoBack = () => navigate(-1);

    if (loading) return <div className={styles.loadingMessage}>Đang tải danh sách đơn đăng ký hiến máu của bạn...</div>;
    if (error) return <div className={styles.errorMessage}>{error}</div>;

    return (
        <div className={styles.myDonationRequestsContainer}>
            <h2 className={styles.pageTitle}>Đơn Đăng Ký Hiến Máu Của Tôi</h2>

            {myRequests.length === 0 ? (
                <>
                    <div className={styles.noRequestsMessage}>
                        <p>Bạn chưa có đơn đăng ký hiến máu nào.</p>
                    </div>

                    <div className={styles.backSection}>
                        <button className={styles.backButton} onClick={handleGoBack}>
                            Quay lại
                        </button>
                    </div>
                </>
            ) : (
                <div className={styles.requestList}>
                    {myRequests.map((request) => (
                        <div key={request.id} className={styles.requestCard}>
                            <div className={styles.cardHeader}>
                                <h3>Tên sự kiện: {request.eventName || 'N/A'}</h3>
                                
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.infoGroup}>
                                    <span className={styles.label}>Ngày đăng ký:</span>
                                    <span className={styles.value}>{formatDateTime(request.requestTime)}</span>
                                </div>
                                <div className={styles.infoGroup}>
                                    <span className={styles.label}>Nhóm máu đăng Ký:</span>
                                    <span className={styles.value}>
                                        {request.donorBloodType
                                            ? `${request.donorBloodType.type}${request.donorBloodType.rhFactor}`
                                            : 'N/A'}
                                    </span>
                                </div>
                                <div className={styles.infoGroup}>
                                    <span className={styles.label}>Trạng thái:</span>
                                    <span className={`${styles.statusBadge} ${styles[request.statusRequest?.toLowerCase()]}`}>
                                    {request.statusRequest === 'PENDING' ? 'Đang chờ' :
                                     request.statusRequest === 'APPROVED' ? 'Đã duyệt' :
                                     request.statusRequest === 'REJECTED' ? 'Đã từ chối' :
                                     request.statusRequest === 'CANCELED' ? 'Đã hủy' :
                                     request.statusRequest || 'N/A'}
                                </span>
                                </div>
                            </div>
                            <div className={styles.cardActions}>
                                <button
                                    className={styles.detailButton}
                                    onClick={() => handleOpenDetailModal(request)}
                                >
                                    Xem chi tiết
                                </button>
                                {request.statusRequest === 'PENDING' && (
                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => handleOpenCancelModal(request)}
                                    >
                                        Hủy Đơn
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button className={styles.backButton} onClick={handleGoBack}>
                        Quay lại
                    </button>
                </div>

                
            )}

            {showConfirmCancelModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <p>Bạn có chắc chắn muốn <strong>HỦY</strong> đơn đăng ký hiến máu cho sự kiện **{selectedRequestToCancel?.eventName || 'này'}** không?</p>
                        <div className={styles.modalActions}>
                            <button className={styles.confirmButton} onClick={handleCancelRequest}>
                                Xác nhận
                            </button>
                            <button className={styles.cancelButton} onClick={handleCloseCancelModal}>
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDetailModal && selectedRequestDetail && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContentLarge}>
                        <h3 className={styles.modalTitle}>Chi Tiết Đơn Đăng Ký Hiến Máu</h3>
                        <div className={styles.detailGrid}>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>ID Yêu cầu:</span>
                                <span className={styles.value}>{selectedRequestDetail.id}</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Tên người hiến:</span>
                                <span className={styles.value}>{selectedRequestDetail.donorFullName || 'N/A'}</span>
                            </div>
                             <div className={styles.infoGroup}>
                                <span className={styles.label}>Giới tính:</span>
                                <span className={styles.value}>{selectedRequestDetail.donorGender === 'MALE' ? 'Nam' : selectedRequestDetail.donorGender === 'FEMALE' ? 'Nữ' : 'N/A'}</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Nhóm máu ĐK:</span>
                                <span className={styles.value}>
                                    {selectedRequestDetail.donorBloodType
                                        ? `${selectedRequestDetail.donorBloodType.type}${selectedRequestDetail.donorBloodType.rhFactor}`
                                        : 'N/A'}
                                </span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Sự kiện:</span>
                                <span className={styles.value}>{selectedRequestDetail.eventName || 'N/A'}</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Thời gian yêu cầu:</span>
                                <span className={styles.value}>{formatDateTime(selectedRequestDetail.requestTime)}</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Trạng thái:</span>
                                <span className={`${styles.statusBadge} ${styles[selectedRequestDetail.statusRequest?.toLowerCase()]}`}>
                                    {selectedRequestDetail.statusRequest === 'PENDING' ? 'Đang chờ' :
                                     selectedRequestDetail.statusRequest === 'APPROVED' ? 'Đã duyệt' :
                                     selectedRequestDetail.statusRequest === 'REJECTED' ? 'Đã từ chối' :
                                     selectedRequestDetail.statusRequest === 'CANCELED' ? 'Đã hủy' :
                                     selectedRequestDetail.statusRequest || 'N/A'}
                                </span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Thời gian duyệt:</span>
                                <span className={styles.value}>{formatDateTime(selectedRequestDetail.approvedTime)}</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Lý do đăng ký:</span>
                                <span className={styles.value}>{selectedRequestDetail.reason || 'Không có'}</span>
                            </div>
                            <div className={styles.infoGroup}>
                                <span className={styles.label}>Ghi chú của hệ thống:</span>
                                <span className={styles.value}>{selectedRequestDetail.note || 'Không có'}</span>
                            </div>

                            <h4 className={styles.surveyTitle}>Kết Quả Khảo Sát Sức Khỏe</h4>
                            <div className={styles.surveyGrid}>
                                <div className={styles.infoGroup}>
                                    <span className={styles.label}>Khỏe mạnh hôm nay:</span>
                                    <span className={styles.value}>{formatBoolean(selectedRequestDetail.isHealthyToday)}</span>
                                </div>
                                <div className={styles.infoGroup}>
                                    <span className={styles.label}>Có triệu chứng:</span>
                                    <span className={styles.value}>{formatBoolean(selectedRequestDetail.hasSymptoms)}</span>
                                </div>
                                <div className={styles.infoGroup}>
                                    <span className={styles.label}>Mắc bệnh truyền nhiễm:</span>
                                    <span className={styles.value}>{formatBoolean(selectedRequestDetail.hasInfectiousDiseases)}</span>
                                </div>
                                <div className={styles.infoGroup}>
                                    <span className={styles.label}>Quan hệ không an toàn:</span>
                                    <span className={styles.value}>{formatBoolean(selectedRequestDetail.unsafeSex)}</span>
                                </div>
                                <div className={styles.infoGroup}>
                                    <span className={styles.label}>Phẫu thuật/xăm gần đây:</span>
                                    <span className={styles.value}>{formatBoolean(selectedRequestDetail.recentSurgeryTattoo)}</span>
                                </div>
                                <div className={styles.infoGroup}>
                                    <span className={styles.label}>Tiêm vaccine gần đây:</span>
                                    <span className={styles.value}>{formatBoolean(selectedRequestDetail.recentVaccination)}</span>
                                </div>
                                <div className={styles.infoGroup}>
                                    <span className={styles.label}>Đang sử dụng thuốc:</span>
                                    <span className={styles.value}>{formatBoolean(selectedRequestDetail.onMedication)}</span>
                                </div>
                                <div className={styles.infoGroup}>
                                    <span className={styles.label}>Có bệnh mãn tính:</span>
                                    <span className={styles.value}>{formatBoolean(selectedRequestDetail.hasChronicDisease)}</span>
                                </div>
                                {selectedRequestDetail.hasChronicDisease === true && (
                                    <div className={styles.infoGroupFullWidth}> {/* Apply class for full width */}
                                        <span className={styles.label}>Ghi chú bệnh mãn tính:</span>
                                        <span className={styles.value}>{selectedRequestDetail.chronicDiseaseNote || 'Không có'}</span>
                                    </div>
                                )}
                                <div className={styles.infoGroup}>
                                    <span className={styles.label}>Ngày từ lần hiến gần nhất:</span>
                                    <span className={styles.value}>
                                        {selectedRequestDetail.lastDonationDays !== null && selectedRequestDetail.lastDonationDays !== undefined
                                            ? `${selectedRequestDetail.lastDonationDays} ngày`
                                            : 'Chưa từng hiến/Không có thông tin'}
                                    </span>
                                </div>
                                <div className={styles.infoGroup}>
                                    <span className={styles.label}>Phản ứng sau hiến:</span>
                                    <span className={styles.value}>{formatBoolean(selectedRequestDetail.hadReactionPreviousDonation)}</span>
                                </div>
                                {selectedRequestDetail.hadReactionPreviousDonation === true && (
                                    <div className={styles.infoGroupFullWidth}> {/* Apply class for full width */}
                                        <span className={styles.label}>Ghi chú phản ứng:</span>
                                        <span className={styles.value}>{selectedRequestDetail.previousReactionNote || 'Không có'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.backButton} onClick={handleCloseDetailModal}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDonationRequests;