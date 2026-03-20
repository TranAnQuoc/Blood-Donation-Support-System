import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./index.module.css";
import ConfirmationModal from "../confirm"; // Sử dụng lại component modal xác nhận

const API_BASE_URL = "http://localhost:8080/api/blood-storage";

// Enum cho trạng thái kho máu (phải khớp với backend)
const StatusBloodStorage = {
    PENDING: "PENDING",
    REJECTED: "REJECTED",
    STORED: "STORED",
    IN_USED: "IN_USED",
    TRANSFERRED: "TRANSFERRED",
    EXPIRED: "EXPIRED",
};

// Hàm hỗ trợ để lấy token từ localStorage
const getAuthToken = () => {
    try {
        const userString = localStorage.getItem("user");
        if (userString) {
            const user = JSON.parse(userString);
            return user.token;
        }
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
    }
    return null;
};

const BloodStorageUseAction = ({ storageId, onActionSuccess, currentStatus, userRole }) => {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionTypePending, setActionTypePending] = useState(null); // Lưu trữ hành động đang chờ xác nhận (IN_USED/TRANSFERRED)

    // Hàm thực sự gửi yêu cầu API sau khi xác nhận
    const executeUseAction = async (targetStatus) => {
        const token = getAuthToken();

        setIsSubmitting(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
            const payload = {
                status: targetStatus,
                reason: reason.trim(), // Gửi lý do
            };

            const response = await axios.put(`${API_BASE_URL}/use/${storageId}`, payload, config);

            if (response.status === 200) {
                const actionMessage = targetStatus === StatusBloodStorage.IN_USED ? "sử dụng" : "chuyển giao";
                toast.success(`Kho máu ID: ${storageId} đã được ${actionMessage} thành công!`);
                onActionSuccess();
            } else {
                toast.warn("Không thể thực hiện hành động này.");
            }
        } catch (err) {
            console.error("Lỗi khi thực hiện hành động sử dụng/chuyển giao kho máu:", err);
            if (err.response) {
                if (err.response.status === 403) {
                    toast.error("Bạn không có quyền thực hiện chức năng này. (Chỉ STAFF)");
                } else if (err.response.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                } else if (err.response.status === 404) {
                    toast.error("Không tìm thấy kho máu.");
                } else if (err.response.status === 400 || err.response.status === 409) { // 409 Conflict cho lỗi "Túi máu không sẵn sàng"
                    toast.error(`Yêu cầu không hợp lệ: ${err.response.data?.message || err.message}`);
                } else {
                    toast.error(
                        `Lỗi server: ${err.response.data?.message || err.message}`
                    );
                }
            } else if (err.request) {
                toast.error("Không thể kết nối đến máy chủ.");
            } else {
                toast.error("Đã xảy ra lỗi không xác định.");
            }
        } finally {
            setIsSubmitting(false);
            setShowConfirmModal(false);
            setActionTypePending(null);
            setReason(""); // Xóa lý do sau khi gửi
        }
    };

    // Hàm gọi khi người dùng bấm nút Use/Transfer (trước khi xác nhận)
    const handleInitiateUseAction = (targetStatus) => {
        const token = getAuthToken();

        if (!token) {
            toast.error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
            return;
        }

        // Kiểm tra quyền hạn
        if (userRole?.toUpperCase() !== 'STAFF') {
            toast.error("Bạn không có quyền sử dụng/chuyển giao kho máu.");
            return;
        }

        // Kiểm tra trạng thái hiện tại
        if (currentStatus !== StatusBloodStorage.STORED) {
            toast.warn("Chỉ có thể sử dụng hoặc chuyển giao các kho máu ở trạng thái STORED.");
            return;
        }

        // Kiểm tra lý do
        if (reason.trim() === '') {
            toast.error("Vui lòng nhập lý do sử dụng/chuyển giao.");
            return;
        }

        setActionTypePending(targetStatus);
        setShowConfirmModal(true);
    };

    // Hàm xử lý khi người dùng xác nhận trong modal
    const handleConfirm = () => {
        if (actionTypePending) {
            executeUseAction(actionTypePending);
        }
    };

    // Hàm xử lý khi người dùng hủy bỏ trong modal
    const handleCancel = () => {
        setShowConfirmModal(false);
        setActionTypePending(null);
    };

    // Chỉ hiển thị các nút và input nếu trạng thái là STORED và người dùng là STAFF
    const shouldShowControls = currentStatus === StatusBloodStorage.STORED && userRole?.toUpperCase() === 'STAFF';

    if (!shouldShowControls) {
        return null;
    }

    const confirmMessage = actionTypePending === StatusBloodStorage.IN_USED
        ? `Bạn có chắc chắn muốn SỬ DỤNG kho máu ID: ${storageId} này không? Lý do: "${reason.trim()}"`
        : `Bạn có chắc chắn muốn CHUYỂN GIAO kho máu ID: ${storageId} này không? Lý do: "${reason.trim()}"`;


    return (
        <div className={styles.bloodStorageUseActionContainer}>
            <div className={styles.reasonSection}>
                <label htmlFor="useReason">Lý do sử dụng/chuyển giao:</label>
                <textarea
                    id="useReason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập lý do sử dụng hoặc chuyển giao"
                    rows="3"
                    className={styles.reasonInput}
                    disabled={isSubmitting}
                />
            </div>
            <div className={styles.actionButtons}>
                <button
                    className={styles.useButton}
                    onClick={() => handleInitiateUseAction(StatusBloodStorage.IN_USED)}
                    disabled={isSubmitting}
                    title="Sử dụng kho máu (chuyển sang IN_USED)"
                >
                    Sử dụng
                </button>
                <button
                    className={styles.transferButton}
                    onClick={() => handleInitiateUseAction(StatusBloodStorage.TRANSFERRED)}
                    disabled={isSubmitting}
                    title="Chuyển giao kho máu (chuyển sang TRANSFERRED)"
                >
                    Chuyển giao
                </button>
            </div>

            {/* Modal xác nhận */}
            {showConfirmModal && (
                <ConfirmationModal
                    message={confirmMessage}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    isProcessing={isSubmitting}
                />
            )}
        </div>
    );
};

export default BloodStorageUseAction;