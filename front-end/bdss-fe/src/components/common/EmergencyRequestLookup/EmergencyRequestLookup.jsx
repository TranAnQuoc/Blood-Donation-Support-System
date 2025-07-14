import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './EmergencyRequestLookup.module.css';

const EmergencyRequestLookup = () => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [requestDetails, setRequestDetails] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    const handleLookup = async (e) => {
        e.preventDefault();
        setRequestDetails(null);
        setShowImageModal(false);
        setCurrentImageUrl('');

        if (!fullName.trim() || !phone.trim()) {
            toast.error('Vui lòng nhập đầy đủ Họ và Tên cùng Số Điện Thoại.');
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            toast.error('Số điện thoại phải có 10 chữ số.');
            return;
        }

        const token = localStorage.getItem('access_token'); // 🔑 Lấy token

        if (!token) {
            toast.error('Bạn cần đăng nhập để tra cứu.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/emergency-process/emergency-lookup`, {
                params: { fullName, phone },
                headers: {
                    Authorization: `Bearer ${token}` // ✅ Gửi token
                }
            });

            if (response.data && response.data.length > 0) {
                setRequestDetails(response.data[0]);
                toast.success('Tìm thấy yêu cầu!');
            } else {
                toast.info('Không tìm thấy yêu cầu phù hợp hoặc đã hoàn tất/hủy.');
            }

        } catch (err) {
            console.error("Lỗi khi tra cứu yêu cầu:", err);
            if (err.response && err.response.status === 404) {
                toast.info('Không tìm thấy yêu cầu phù hợp.');
            } else {
                const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
                toast.error(errorMessage);
            }
        }
    };

    const handleViewProof = (fileUrl) => {
        setCurrentImageUrl(`http://localhost:8080${fileUrl}`);
        setShowImageModal(true);
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'PENDING':
                return { text: 'Đang chờ duyệt', class: styles.statusPending };
            case 'APPROVED':
                return { text: 'Đã duyệt', class: styles.statusApproved };
            case 'REJECTED':
                return { text: 'Đã từ chối', class: styles.statusRejected };
            case 'IN_PROCESS':
                return { text: 'Đang xử lý', class: styles.statusInProcess };
            case 'COMPLETED':
                return { text: 'Đã hoàn tất', class: styles.statusCompleted };
            case 'CANCELED':
                return { text: 'Đã hủy', class: styles.statusCanceled };
            default:
                return { text: 'Không xác định', class: '' };
        }
    };

    return (
        <div className={styles.lookupContainer}>
            <h3 className={styles.lookupTitle}>Tra Cứu Yêu Cầu Khẩn Cấp</h3>

            <form onSubmit={handleLookup} className={styles.lookupForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="lookupFullName" className={styles.label}>
                        Họ và Tên <span style={{ color: "red" }}>*</span>:
                    </label>
                    <input
                        type="text"
                        id="lookupFullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className={styles.input}
                        placeholder="Nhập họ và tên"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="lookupPhone" className={styles.label}>
                        Số Điện Thoại <span style={{ color: "red" }}>*</span>:
                    </label>
                    <input
                        type="text"
                        id="lookupPhone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className={styles.input}
                        placeholder="Nhập số điện thoại (10 chữ số)"
                    />
                </div>
                <button type="submit" className={styles.lookupButton}>Tra Cứu</button>
            </form>

            {requestDetails && (
                <div className={styles.lookupResult}>
                    <h4>Thông tin yêu cầu của bạn:</h4>
                    <p><strong>ID Yêu cầu:</strong> {requestDetails.idRequest}</p>
                    <p><strong>Tóm tắt kiểm tra sức khỏe:</strong> {requestDetails.healthCheckSummary || "N/A"}</p>
                    <p><strong>Triệu chứng:</strong> {requestDetails.symptoms || "N/A"}</p>
                    <p><strong>Huyết áp:</strong> {requestDetails.bloodPressure || "N/A"}</p>
                    <p><strong>Mạch:</strong> {requestDetails.pulse || "N/A"}</p>
                    <p><strong>Nhịp thở:</strong> {requestDetails.respiratoryRate || "N/A"}</p>
                    <p><strong>Nhiệt độ:</strong> {requestDetails.temperature || "N/A"}</p>
                    <p><strong>Mức Hemoglobin:</strong> {requestDetails.hemoglobinLevel || "N/A"}</p>
                    <p><strong>Nhóm máu xác nhận:</strong> {requestDetails.bloodGroupConfirmed ? "Đã xác nhận" : "Chưa xác nhận"}</p>
                    <p><strong>Kết quả Crossmatch:</strong> {requestDetails.crossmatchResult || "N/A"}</p>
                    <p><strong>Thành phần cần:</strong> {requestDetails.needComponent || "N/A"}</p>
                    <p><strong>Lý do truyền máu:</strong> {requestDetails.reasonForTransfusion || "N/A"}</p>
                    <p><strong>Số lượng máu (ml):</strong> {requestDetails.quantity || "N/A"}</p>
                    <p>
                        <strong>Trạng thái quy trình:</strong>{" "}
                        <span className={getStatusInfo(requestDetails.status).class}>
                            {getStatusInfo(requestDetails.status).text}
                        </span>
                    </p>

                    {requestDetails.healthFileUrl && (
                        <p>
                            <strong>Hồ sơ sức khỏe:</strong>{" "}
                            <button
                                className={styles.viewProofButton}
                                onClick={() => handleViewProof(requestDetails.healthFileUrl)}
                            >
                                Xem Hồ sơ
                            </button>
                        </p>
                    )}
                </div>
            )}

            {showImageModal && (
                <div className={styles.modalOverlay} onClick={() => setShowImageModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeModalButton} onClick={() => setShowImageModal(false)}>
                            &times;
                        </button>
                        <h3>Hồ sơ sức khỏe</h3>
                        <img
                            src={currentImageUrl}
                            alt="Hồ sơ sức khỏe"
                            className={styles.modalImage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmergencyRequestLookup;
