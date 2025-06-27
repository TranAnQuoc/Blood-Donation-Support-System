import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
import styles from './TransfusionRequestDetail.module.css';

const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    try {
        const date = new Date(isoString);
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        };
        return date.toLocaleString("vi-VN", options);
    } catch (e) {
        console.error("Invalid date string:", isoString, e);
        return "Invalid Date";
    }
};

const TransfusionRequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [formData, setFormData] = useState({
        recipientId: '',
        bloodComponentNeeded: '',
        quantityNeeded: '',
        doctorDiagnosis: '',
        preCheckNotes: '',
    });

    useEffect(() => {
        const fetchRequestDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axiosInstance.get(`/transfusions/requests/${id}`);
                setRequest(response.data);
                setFormData({
                    recipientId: response.data.recipientId || '',
                    bloodComponentNeeded: response.data.bloodComponentNeeded || '',
                    quantityNeeded: response.data.quantityNeeded || '',
                    doctorDiagnosis: response.data.doctorDiagnosis || '',
                    preCheckNotes: response.data.preCheckNotes || '',
                });
                console.log(`Chi tiết yêu cầu ID ${id}:`, response.data);
            } catch (err) {
                console.error(`Lỗi khi lấy chi tiết yêu cầu ID ${id}:`, err);
                setError('Không thể tải chi tiết yêu cầu này. Vui lòng thử lại sau.');
                toast.error('Lỗi: Không thể tải chi tiết yêu cầu.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRequestDetail();
        } else {
            setError("Không tìm thấy ID yêu cầu.");
            setLoading(false);
        }
    }, [id]);

    const handleDeleteRequest = async () => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa yêu cầu truyền máu #${request.id} này không? Thao tác này không thể hoàn tác.`)) {
            return;
        }

        try {
            await axiosInstance.delete(`/transfusions/requests/${id}`);
            toast.success('Yêu cầu truyền máu đã được xóa thành công!');
            navigate('/staff-dashboard/transfusion-requests-management');
        } catch (err) {
            console.error(`Lỗi khi xóa yêu cầu ID ${id}:`, err);
            toast.error(`Lỗi khi xóa yêu cầu: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleEditInfoToggle = () => {
        setIsEditingInfo(prev => !prev);
        if (!isEditingInfo && request) {
            setFormData({
                recipientId: request.recipientId || '',
                bloodComponentNeeded: request.bloodComponentNeeded || '',
                quantityNeeded: request.quantityNeeded || '',
                doctorDiagnosis: request.doctorDiagnosis || '',
                preCheckNotes: request.preCheckNotes || '',
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveInfo = async () => {
        try {
            if (!formData.recipientId || !formData.bloodComponentNeeded || !formData.quantityNeeded) {
                toast.error("Vui lòng điền đầy đủ các trường bắt buộc.");
                return;
            }

            const parsedQuantity = parseInt(formData.quantityNeeded, 10);
            if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
                toast.error("Lượng cần phải là một số dương.");
                return;
            }

            const payload = {
                recipientId: parseInt(formData.recipientId, 10),
                bloodComponentNeeded: formData.bloodComponentNeeded,
                quantityNeeded: parsedQuantity,
                doctorDiagnosis: formData.doctorDiagnosis,
                preCheckNotes: formData.preCheckNotes,
            };
            
            const response = await axiosInstance.put(`/transfusions/requests/${id}`, payload);
            setRequest(response.data);
            setIsEditingInfo(false);
            toast.success('Cập nhật thông tin yêu cầu thành công!');
        } catch (err) {
            console.error(`Lỗi khi cập nhật thông tin yêu cầu ID ${id}:`, err);
            toast.error(`Lỗi khi cập nhật thông tin: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleCancelEdit = () => {
        setIsEditingInfo(false);
        if (request) {
            setFormData({
                recipientId: request.recipientId || '',
                bloodComponentNeeded: request.bloodComponentNeeded || '',
                quantityNeeded: request.quantityNeeded || '',
                doctorDiagnosis: request.doctorDiagnosis || '',
                preCheckNotes: request.preCheckNotes || '',
            });
        }
    };


    if (loading) {
        return <div className={styles.container}>Đang tải chi tiết yêu cầu...</div>;
    }

    if (error) {
        return <div className={styles.container}><p className={styles.errorText}>{error}</p><button className={styles.backButton} onClick={() => navigate(-1)}>Quay lại</button></div>;
    }

    if (!request) {
        return <div className={styles.container}><p>Không tìm thấy thông tin yêu cầu.</p><button className={styles.backButton} onClick={() => navigate(-1)}>Quay lại</button></div>;
    }

    return (
        <div className={styles.container}>
            <h2>Chi Tiết Yêu Cầu Truyền Máu #{request.id}</h2>
            <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                    <strong>ID Yêu Cầu:</strong>
                    <span>{request.id}</span>
                </div>
                <div className={styles.detailItem}>
                    <strong>ID Người Nhận:</strong>
                    {isEditingInfo ? (
                        <input
                            type="number"
                            name="recipientId"
                            value={formData.recipientId}
                            onChange={handleChange}
                            className={styles.editInput}
                        />
                    ) : (
                        <span>{request.recipientId}</span>
                    )}
                </div>
                <div className={styles.detailItem}>
                    <strong>Thành phần máu cần:</strong>
                    {isEditingInfo ? (
                        <input
                            type="text"
                            name="bloodComponentNeeded"
                            value={formData.bloodComponentNeeded}
                            onChange={handleChange}
                            className={styles.editInput}
                        />
                    ) : (
                        <span>{request.bloodComponentNeeded}</span>
                    )}
                </div>
                <div className={styles.detailItem}>
                    <strong>Lượng cần (ml):</strong>
                    {isEditingInfo ? (
                        <input
                            type="number"
                            name="quantityNeeded"
                            value={formData.quantityNeeded}
                            onChange={handleChange}
                            className={styles.editInput}
                        />
                    ) : (
                        <span>{request.quantityNeeded}</span>
                    )}
                </div>
                <div className={styles.detailItem}>
                    <strong>Chẩn đoán của bác sĩ:</strong>
                    {isEditingInfo ? (
                        <textarea
                            name="doctorDiagnosis"
                            value={formData.doctorDiagnosis}
                            onChange={handleChange}
                            className={styles.editInput}
                            rows="3"
                        />
                    ) : (
                        <span>{request.doctorDiagnosis || "Chưa có"}</span>
                    )}
                </div>
                <div className={styles.detailItem}>
                    <strong>Ghi chú tiền kiểm tra:</strong>
                    {isEditingInfo ? (
                        <textarea
                            name="preCheckNotes"
                            value={formData.preCheckNotes}
                            onChange={handleChange}
                            className={styles.editInput}
                            rows="3"
                        />
                    ) : (
                        <span>{request.preCheckNotes || "Chưa có"}</span>
                    )}
                </div>
                <div className={styles.detailItem}>
                    <strong>Trạng thái:</strong>
                    <span className={`${styles.statusBadge} ${styles[request.status.toLowerCase()]}`}>
                        {request.status === "PENDING" ? "Đang chờ"
                        : request.status === "APPROVED" ? "Đã duyệt"
                        : request.status === "REJECTED" ? "Đã từ chối"
                        : request.status === "CANCELLED" ? "Đã hủy"
                        : request.status}
                    </span>
                </div>
                <div className={styles.detailItem}>
                    <strong>Yêu cầu lúc:</strong>
                    <span>{formatDateTime(request.requestedAt)}</span>
                </div>
                <div className={styles.detailItem}>
                    <strong>Người duyệt:</strong>
                    <span>{request.approvedById || "Chưa duyệt"}</span>
                </div>
                <div className={styles.detailItem}>
                    <strong>Thời gian duyệt:</strong>
                    <span>{formatDateTime(request.approvedAt)}</span>
                </div>
                <div className={styles.detailItem}>
                    <strong>ID Cơ sở:</strong>
                    <span>{request.facilityId || "Chưa gán"}</span>
                </div>
            </div>
            <div className={styles.actions}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>Quay lại Danh sách</button>

                {!isEditingInfo ? (
                    <button className={styles.editButton} onClick={handleEditInfoToggle}>Chỉnh sửa thông tin</button>
                ) : (
                    <>
                        <button className={styles.saveButton} onClick={handleSaveInfo}>Lưu thay đổi</button>
                        <button className={styles.cancelButton} onClick={handleCancelEdit}>Hủy</button>
                    </>
                )}
                <button className={styles.deleteButton} onClick={handleDeleteRequest}>Xóa yêu cầu</button>
            </div>
        </div>
    );
};

export default TransfusionRequestDetail;