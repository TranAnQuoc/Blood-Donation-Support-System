import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./index.module.css"; // Sẽ tạo file CSS này

const API_BASE_URL = "http://localhost:8080/api/blood-storage";

// Enum cho trạng thái xác thực (phải khớp với backend)
const StatusVerified = {
    CONFIRMED: "CONFIRMED",
    UNCONFIRMED: "UNCONFIRMED",
};

// Hàm hỗ trợ lấy token (lặp lại từ BloodStorageList để đảm bảo độc lập)
const getAuthToken = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            const userObj = JSON.parse(userString);
            return userObj.token || null;
        } catch (e) {
            console.error("Lỗi khi giải mã đối tượng 'user' từ localStorage:", e);
            return null;
        }
    }
    return null;
};

const VerifiedBloodStorage = ({ storageId, currentStatus, verifiedStatus, onVerifiedSuccess, userRole }) => {
    const [status, setStatus] = useState(verifiedStatus || ""); // Giá trị mặc định nếu đã xác minh
    const [verifiedNote, setVerifiedNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = getAuthToken();

    // Điều kiện để hiển thị component:
    // 1. Phải là ADMIN
    // 2. Trạng thái hiện tại của kho máu là IN_USED hoặc TRANSFERRED
    // 3. Trạng thái xác minh chưa được đặt (hoặc bạn muốn cho phép xác minh lại)
    const canVerify = userRole === 'ADMIN' &&
        (currentStatus === "IN_USED" || currentStatus === "TRANSFERRED");
    // Nếu đã xác minh rồi (CONFIRMED hoặc UNCONFIRMED), không hiển thị lại form
    if (verifiedStatus === StatusVerified.CONFIRMED || verifiedStatus === StatusVerified.UNCONFIRMED) {
        return null;
    }


    // Nếu đã có trạng thái xác minh và bạn không muốn cho phép thay đổi
    // if (verifiedStatus && verifiedStatus !== "") {
    //     // Nếu đã xác minh rồi thì không hiển thị form nữa
    //     // Hoặc có thể hiển thị thông tin đã xác minh mà không cho sửa
    //     return (
    //         <div className={styles.verifiedInfo}>
    //             <p><strong>Trạng thái xác minh:</strong> {verifiedStatus}</p>
    //             <p><strong>Ghi chú xác minh:</strong> {verifiedNote}</p>
    //             <p className={styles.verifiedMessage}>Mẫu máu này đã được xác minh.</p>
    //         </div>
    //     );
    // }

    if (!canVerify) {
        return null; // Không hiển thị component nếu không đủ điều kiện
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
            return;
        }
        if (!status) {
            toast.error("Vui lòng chọn trạng thái xác thực (Xác nhận/Hủy xác nhận).");
            return;
        }
        if (!verifiedNote.trim()) {
            toast.error("Vui lòng nhập ghi chú xác thực.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.put(
                `${API_BASE_URL}/verify/${storageId}`,
                { status, verifiedNote }, // Body của request
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Xác thực kho máu thành công!");
                onVerifiedSuccess(); // Gọi hàm callback để parent component tải lại dữ liệu
            } else {
                toast.warn("Xác thực kho máu không thành công.");
            }
        } catch (err) {
            console.error("Lỗi khi xác thực kho máu:", err);
            if (err.response) {
                if (err.response.status === 400) {
                    toast.error(`Dữ liệu không hợp lệ: ${err.response.data?.message || 'Vui lòng kiểm tra lại thông tin.'}`);
                } else if (err.response.status === 403) {
                    toast.error("Bạn không có quyền xác thực kho máu này.");
                } else if (err.response.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                } else {
                    toast.error(`Lỗi server: ${err.response.data?.message || err.message}`);
                }
            } else if (err.request) {
                toast.error("Không thể kết nối đến máy chủ.");
            } else {
                toast.error("Đã xảy ra lỗi không xác định khi xác thực.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.verifyContainer}>
            <h4>Xác minh Kho Máu</h4>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="verifyStatus" className={styles.label}>Trạng thái xác thực:</label>
                    <select
                        id="verifyStatus"
                        className={styles.selectField}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={isSubmitting}
                    >
                        <option value="">Chọn trạng thái</option>
                        {Object.values(StatusVerified).map((st) => (
                            <option key={st} value={st}>
                                {st === StatusVerified.CONFIRMED ? "Xác nhận" : "Hủy xác nhận"}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="verifiedNote" className={styles.label}>Ghi chú xác thực:</label>
                    <textarea
                        id="verifiedNote"
                        className={styles.textareaField}
                        rows="3"
                        value={verifiedNote}
                        onChange={(e) => setVerifiedNote(e.target.value)}
                        placeholder="Nhập ghi chú xác thực..."
                        disabled={isSubmitting}
                    ></textarea>
                </div>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? "Đang xử lý..." : "Gửi Xác minh"}
                </button>
            </form>
        </div>
    );
};

export default VerifiedBloodStorage;