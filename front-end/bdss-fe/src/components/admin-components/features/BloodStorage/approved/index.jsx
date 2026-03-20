import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./index.module.css";
import ConfirmationModal from "./confirm";

const API_BASE_URL = "http://localhost:8080/api/blood-storage";

const StatusBloodStorage = {
    PENDING: "PENDING",
    REJECTED: "REJECTED",
    STORED: "STORED",
    IN_USED: "IN_USED",
    TRANSFERRED: "TRANSFERRED",
    EXPIRED: "EXPIRED",
};

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

const ApprovalAction = ({ storageId, onActionSuccess, currentStatus, userRole }) => {
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionTypePending, setActionTypePending] = useState(null); // Lưu trữ hành động đang chờ xác nhận (STORED/REJECTED)

    // Hàm thực sự gửi yêu cầu API sau khi xác nhận
    const executeAction = async (actionStatus) => {
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
                status: actionStatus,
                note: actionStatus === StatusBloodStorage.REJECTED ? note.trim() : "", // Gửi ghi chú chỉ khi REJECTED
            };

            const response = await axios.put(`${API_BASE_URL}/approve/${storageId}`, payload, config);

            if (response.status === 200) {
                const actionMessage = actionStatus === StatusBloodStorage.STORED ? "duyệt" : "từ chối";
                toast.success(`Kho máu ID: ${storageId} đã được ${actionMessage} thành công!`);
                if (typeof onActionSuccess === 'function') {
                    onActionSuccess();
                }
            } else {
                toast.warn("Không thể thực hiện hành động này.");
            }
        } catch (err) {
            console.error("Lỗi khi thực hiện hành động:", err);
            if (err.response) {
                if (err.response.status === 403) {
                    toast.error("Bạn không có quyền thực hiện chức năng này. (Chỉ ADMIN)");
                } else if (err.response.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                } else if (err.response.status === 404) {
                    toast.error("Không tìm thấy kho máu.");
                } else if (err.response.status === 400) {
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
            setShowConfirmModal(false); // Đóng modal xác nhận dù thành công hay thất bại
            setActionTypePending(null);
            if (actionStatus === StatusBloodStorage.REJECTED) {
                setNote(""); // Xóa ghi chú sau khi gửi (để chuẩn bị cho lần sau)
            }
        }
    };

    // Hàm gọi khi người dùng bấm nút Approve/Reject (trước khi xác nhận)
    const handleInitiateAction = (actionStatus) => {
        const token = getAuthToken();

        if (!token) {
            toast.error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
            return;
        }

        if (userRole?.toUpperCase() !== 'ADMIN') {
            toast.error("Bạn không có quyền thực hiện hành động này.");
            return;
        }

        if (currentStatus !== StatusBloodStorage.PENDING) {
            toast.warn("Chỉ có thể duyệt hoặc từ chối các kho máu ở trạng thái PENDING.");
            return;
        }

        if (actionStatus === StatusBloodStorage.REJECTED && note.trim() === '') {
            toast.error("Vui lòng nhập ghi chú khi từ chối kho máu.");
            return;
        }

        setActionTypePending(actionStatus); // Lưu hành động đang chờ
        setShowConfirmModal(true); // Hiển thị modal xác nhận
    };

    // Hàm xử lý khi người dùng xác nhận trong modal
    const handleConfirm = () => {
        if (actionTypePending) {
            executeAction(actionTypePending);
        }
    };

    // Hàm xử lý khi người dùng hủy bỏ trong modal
    const handleCancel = () => {
        setShowConfirmModal(false);
        setActionTypePending(null);
    };

    // Chỉ hiển thị các nút và input nếu trạng thái là PENDING và người dùng là ADMIN
    const shouldShowControls = currentStatus === StatusBloodStorage.PENDING && userRole?.toUpperCase() === 'ADMIN';

    if (!shouldShowControls) {
        return null;
    }

    const confirmMessage = actionTypePending === StatusBloodStorage.STORED
        ? `Bạn có chắc chắn muốn DUYỆT kho máu ID: ${storageId} này không?`
        : `Bạn có chắc chắn muốn TỪ CHỐI kho máu ID: ${storageId} này không? Ghi chú: "${note.trim()}"`;


    return (
        <div className={styles.approvalActionContainer}>
            <div className={styles.noteSection}>
                <label htmlFor="rejectNote">Ghi chú (bắt buộc nếu Từ chối):</label>
                <textarea
                    id="rejectNote"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú từ chối"
                    rows="3"
                    className={styles.noteInput}
                    disabled={isSubmitting}
                />
            </div>
            <div className={styles.actionButtons}>
                <button
                    className={styles.approveButton}
                    onClick={() => handleInitiateAction(StatusBloodStorage.STORED)}
                    disabled={isSubmitting}
                    title="Duyệt kho máu (chuyển sang STORED)"
                >
                    Duyệt Kho máu
                </button>
                <button
                    className={styles.rejectButton}
                    onClick={() => handleInitiateAction(StatusBloodStorage.REJECTED)}
                    disabled={isSubmitting}
                    title="Từ chối kho máu (chuyển sang REJECTED, cần ghi chú)"
                >
                    Từ chối Kho máu
                </button>
            </div>

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

export default ApprovalAction;