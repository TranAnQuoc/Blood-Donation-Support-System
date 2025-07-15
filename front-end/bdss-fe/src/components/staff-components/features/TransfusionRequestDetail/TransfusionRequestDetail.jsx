import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../configs/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './TransfusionRequestDetail.module.css';

// Enum cho trạng thái yêu cầu (giả định từ backend)
const StatusRequest = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    CANCELLED: "CANCELLED",
};

// Enum cho trạng thái hệ thống (soft delete)
const Status = {
    ACTIVE: "ACTIVE",
    DELETED: "DELETED",
};

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
        console.error("Chuỗi ngày không hợp lệ:", isoString, e);
        return "Ngày không hợp lệ";
    }
};

const getUserRole = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            const userObj = JSON.parse(userString);
            // Giả sử role được lưu dưới dạng chuỗi 'ADMIN', 'STAFF', 'MEMBER' hoặc mảng ['ROLE_ADMIN']
            return Array.isArray(userObj.role) ? userObj.role[0].replace('ROLE_', '') : userObj.role;
        } catch (e) {
            console.error("Error parsing user from localStorage:", e);
            return null;
        }
    }
    return null;
};

const TransfusionRequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [formData, setFormData] = useState({
        recipientId: '',
        bloodComponentNeeded: '',
        quantityNeeded: '',
        doctorDiagnosis: '',
        preCheckNotes: '',
        address: '', // Thêm trường address
    });

    useEffect(() => {
        setUserRole(getUserRole());
    }, []);

    const fetchRequestDetail = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/transfusion-requests/${id}`);
            setRequest(response.data);
            setFormData({
                recipientId: response.data.recipientId || '',
                bloodComponentNeeded: response.data.bloodComponentNeeded || '',
                quantityNeeded: response.data.quantityNeeded || '',
                doctorDiagnosis: response.data.doctorDiagnosis || '',
                preCheckNotes: response.data.preCheckNotes || '',
                address: response.data.address || '', // Cập nhật formData
            });
            console.log(`Chi tiết yêu cầu ID ${id}:`, response.data);
            // toast.success("Đã tải chi tiết yêu cầu thành công!"); // Có thể comment dòng này để tránh pop-up liên tục
        } catch (err) {
            console.error(`Lỗi khi lấy chi tiết yêu cầu ID ${id}:`, err);
            setError('Không thể tải chi tiết yêu cầu này. Vui lòng thử lại sau.');
            toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
            if (err.response?.status === 403) {
                navigate('/unauthorized');
            } else if (err.response?.status === 404) {
                navigate('/not-found');
            }
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (id) {
            fetchRequestDetail();
        } else {
            setError("Không tìm thấy ID yêu cầu.");
            setLoading(false);
        }
    }, [id, fetchRequestDetail]);

    // Hàm để cập nhật thông tin yêu cầu (không phải duyệt/từ chối)
    const handleUpdateInfo = async () => {
        if (userRole !== 'STAFF' && userRole !== 'ADMIN') {
            toast.error("Bạn không có quyền cập nhật thông tin này.");
            return;
        }

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
                address: formData.address, // Thêm address vào payload
            };
            
            // Endpoint PUT cho cập nhật thông tin: PUT /transfusion-requests/{id}
            const response = await axiosInstance.put(`/transfusion-requests/${id}/approve`, payload);
            setRequest(response.data);
            setIsEditingInfo(false);
            toast.success('Cập nhật thông tin yêu cầu thành công!');
        } catch (err) {
            console.error(`Lỗi khi cập nhật thông tin yêu cầu ID ${id}:`, err);
            toast.error(`Lỗi khi cập nhật thông tin: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleRejectInfo = async () => {
        if (userRole !== 'STAFF' && userRole !== 'ADMIN') {
            toast.error("Bạn không có quyền cập nhật thông tin này.");
            return;
        }

        try {
            // Endpoint PUT cho cập nhật thông tin: PUT /transfusion-requests/{id}
            const response = await axiosInstance.put(`/transfusion-requests/${id}/reject`);
            setRequest(response.data);
            setIsEditingInfo(false);
            toast.success('Cập nhật thông tin yêu cầu thành công!');
        } catch (err) {
            console.error(`Lỗi khi cập nhật thông tin yêu cầu ID ${id}:`, err);
            toast.error(`Lỗi khi cập nhật thông tin: ${err.response?.data?.message || err.message}`);
        }
    };

    // Hàm xử lý duyệt/từ chối/hủy (cập nhật statusRequest)
    const handleStatusAction = async (actionType) => {
        if (userRole !== 'STAFF' && userRole !== 'ADMIN') {
            toast.error("Bạn không có quyền thực hiện hành động này.");
            return;
        }
        if (!request || !request.id) {
            toast.error("Không có dữ liệu yêu cầu.");
            return;
        }

        let confirmMessage = '';
        let successMessage = '';
        let apiUrl = '';

        switch (actionType) {
            case 'approve':
                confirmMessage = `Bạn có chắc chắn muốn DUYỆT yêu cầu truyền máu #${request.id} này không?`;
                successMessage = 'Yêu cầu truyền máu đã được duyệt thành công!';
                apiUrl = `/transfusion-requests/${request.id}/approve`;
                break;
            case 'reject':
                confirmMessage = `Bạn có chắc chắn muốn TỪ CHỐI yêu cầu truyền máu #${request.id} này không?`;
                successMessage = 'Yêu cầu truyền máu đã được từ chối thành công!';
                apiUrl = `/transfusion-requests/${request.id}/reject`;
                break;
            case 'cancel': // Nếu bạn muốn có nút "Hủy" riêng cho người tạo hoặc STAFF/ADMIN
                confirmMessage = `Bạn có chắc chắn muốn HỦY yêu cầu truyền máu #${request.id} này không?`;
                successMessage = 'Yêu cầu truyền máu đã được hủy thành công!';
                apiUrl = `/transfusion-requests/${request.id}/cancel`; // Giả định có endpoint /cancel
                break;
            case 'delete_soft': // Xóa mềm (cập nhật trạng thái hệ thống Status.DELETED)
                if (userRole !== 'ADMIN') {
                    toast.error("Bạn không có quyền xóa mềm yêu cầu này.");
                    return;
                }
                confirmMessage = `Bạn có chắc chắn muốn XÓA MỀM yêu cầu truyền máu #${request.id} này không? Thao tác này sẽ chuyển trạng thái hệ thống thành DELETED.`;
                successMessage = 'Yêu cầu truyền máu đã được xóa mềm thành công!';
                apiUrl = `/transfusion-requests/${request.id}/soft-delete`; // Giả định có endpoint soft-delete
                break;
            default:
                return;
        }

        if (!window.confirm(confirmMessage)) {
            return;
        }

        setLoading(true);
        try {
            // Đối với các hành động duyệt/từ chối/hủy, thường là PUT hoặc POST mà không cần payload đầy đủ
            await axiosInstance.put(apiUrl); // Hoặc axiosInstance.post(apiUrl); tùy API
            toast.success(successMessage);
            fetchRequestDetail(); // Tải lại chi tiết để cập nhật trạng thái
            if (actionType === 'delete_soft') {
                navigate('/staff-dashboard/transfusion-requests-management'); // Chuyển hướng sau khi xóa mềm
            }
        } catch (err) {
            console.error(`Lỗi khi ${actionType} yêu cầu ID ${request.id}:`, err);
            toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };


    const handleEditInfoToggle = () => {
        if (userRole !== 'STAFF' && userRole !== 'ADMIN') {
            toast.error("Bạn không có quyền chỉnh sửa thông tin này.");
            return;
        }
        setIsEditingInfo(prev => !prev);
        if (!isEditingInfo && request) {
            setFormData({
                recipientId: request.recipientId || '',
                bloodComponentNeeded: request.bloodComponentNeeded || '',
                quantityNeeded: request.quantityNeeded || '',
                doctorDiagnosis: request.doctorDiagnosis || '',
                preCheckNotes: request.preCheckNotes || '',
                address: request.address || '', // Cập nhật formData khi toggle
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                address: request.address || '',
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

    // Quyền chỉnh sửa thông tin cơ bản
    const canEditInfo = userRole === 'STAFF' || userRole === 'ADMIN';
    // Quyền duyệt/từ chối (chỉ khi trạng thái là PENDING)
    const canApproveOrReject = (userRole === 'STAFF' || userRole === 'ADMIN') && request.statusRequest === StatusRequest.PENDING;
    // Quyền xóa mềm (chỉ ADMIN và khi trạng thái hệ thống KHÔNG phải DELETED)
    const canSoftDelete = userRole === 'ADMIN' && request.status !== Status.DELETED;
    // Quyền hủy (nếu bạn có chức năng hủy cho STAFF/ADMIN khi không ở PENDING)
    //const canCancel = (userRole === 'STAFF' || userRole === 'ADMIN') && request.statusRequest !== StatusRequest.CANCELLED && request.statusRequest !== StatusRequest.REJECTED;


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
                {/* Thêm trường địa chỉ */}
                <div className={styles.detailItem}>
                    <strong>Địa chỉ:</strong>
                    {isEditingInfo ? (
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={styles.editInput}
                            rows="2"
                        />
                    ) : (
                        <span>{request.address || "Chưa có"}</span>
                    )}
                </div>

                <div className={styles.detailItem}>
                    <strong>Trạng thái yêu cầu:</strong>
                    <span className={`${styles.statusBadge} ${styles[request.statusRequest?.toLowerCase()]}`}>
                        {request.statusRequest === StatusRequest.PENDING ? "Đang chờ"
                        : request.statusRequest === StatusRequest.APPROVED ? "Đã duyệt"
                        : request.statusRequest === StatusRequest.REJECTED ? "Đã từ chối"
                        : request.statusRequest === StatusRequest.CANCELLED ? "Đã hủy"
                        : request.statusRequest || "N/A"}
                    </span>
                </div>
                <div className={styles.detailItem}>
                    <strong>Trạng thái hệ thống:</strong>
                    <span className={`${styles.statusBadge} ${styles[request.status?.toLowerCase()]}`}>
                        {request.status === Status.ACTIVE ? "Hoạt động"
                        : request.status === Status.DELETED ? "Đã xóa"
                        : request.status || "N/A"}
                    </span>
                </div>
                <div className={styles.detailItem}>
                    <strong>Yêu cầu lúc:</strong>
                    <span>{formatDateTime(request.requestedAt)}</span>
                </div>
                <div className={styles.detailItem}>
                    <strong>Thời gian duyệt:</strong>
                    <span>{formatDateTime(request.approvedAt)}</span>
                </div>
            
            </div>
            <div className={styles.actions}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>Quay lại Danh sách</button>

                {canEditInfo && ( // Nút chỉnh sửa thông tin cơ bản
                    <>
                        {!isEditingInfo ? (
                            <button className={styles.editButton} onClick={handleEditInfoToggle}>Chỉnh sửa thông tin</button>
                        ) : (
                            <>
                                <button className={styles.saveButton} onClick={handleUpdateInfo}>Duyệt đơn</button>
                                <button className={styles.rejectButton} onClick={handleRejectInfo}>Hủy đơn</button>
                                <button className={styles.cancelButton} onClick={handleCancelEdit}>Hủy</button>
                            </>
                        )}
                    </>
                )}

                {canApproveOrReject && ( // Các nút duyệt/từ chối chỉ hiển thị khi PENDING và có quyền
                    <>
                        <button className={`${styles.actionButton} ${styles.approveButton}`} onClick={() => handleStatusAction('approve')} disabled={loading}>Duyệt yêu cầu</button>
                        <button className={`${styles.actionButton} ${styles.rejectButton}`} onClick={() => handleStatusAction('reject')} disabled={loading}>Từ chối yêu cầu</button>
                    </>
                )}

                {/* Nếu bạn có một hành động "Hủy" riêng biệt không phải "Từ chối" và không phải "Xóa mềm" */}
                {/* {canCancel && request.statusRequest !== StatusRequest.PENDING && (
                    <button className={`${styles.actionButton} ${styles.cancelButton}`} onClick={() => handleStatusAction('cancel')} disabled={loading}>Hủy yêu cầu</button>
                )} */}

                {canSoftDelete && ( 
                    <button className={styles.deleteButton} onClick={() => handleStatusAction('delete_soft')}>Xóa mềm yêu cầu</button>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default TransfusionRequestDetail;