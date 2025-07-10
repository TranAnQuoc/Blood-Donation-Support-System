import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./index.module.css"; // Giữ nguyên tên file CSS nếu bạn đặt là index.module.css

// API base URLs
const API_MY_PROCESS_URL = "http://localhost:8080/api/donation-processes/my-process";
const API_START_PROCESS_URL_BASE = "http://localhost:8080/api/donation-processes/start";

// Utility function to get auth data
const getAuthData = () => {
    const userString = localStorage.getItem('user');
    let token = null;
    let userRole = null;
    if (userString) {
        try {
            const userObj = JSON.parse(userString);
            if (userObj.token) {
                token = userObj.token;
            }
            if (userObj.role) {
                // Handle case where role might be an array or a string
                userRole = Array.isArray(userObj.role) ? userObj.role[0] : userObj.role;
            }
        } catch (e) {
            console.error("Error parsing user from localStorage:", e);
        }
    }
    return { token, userRole };
};

// Utility function to format date
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
};

// Removed formatDateTime as it's not used by the current DTO
// If your backend changes and sends LocalDateTime fields, re-add it.

const MyDonationProcess = () => {
    const [processData, setProcessData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { token, userRole } = getAuthData();

    // Memoize fetchMyProcess to prevent infinite re-renders
    const fetchMyProcess = useCallback(async () => {
        setLoading(true);
        setError(null);
        setProcessData(null); // Clear previous data on re-fetch

        if (!token) {
            toast.error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
            setError("Không có token xác thực.");
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(API_MY_PROCESS_URL, config);

            if (response.status === 200) {
                setProcessData(response.data);
                toast.success("Tải thông tin tiến trình hiến máu của bạn thành công!");
            } else {
                toast.warn("Không thể tải thông tin tiến trình hiến máu của bạn.");
            }
        } catch (err) {
            console.error("Lỗi khi tải tiến trình hiến máu:", err);
            if (err.response) {
                console.error("Server response:", err.response.data);
                if (err.response.status === 404) {
                    setError("Bạn chưa có tiến trình hiến máu nào.");
                    toast.info("Bạn chưa có tiến trình hiến máu nào.");
                } else if (err.response.status === 403) {
                    setError("Bạn không có quyền truy cập thông tin này.");
                    toast.error("Bạn không có quyền truy cập thông tin này.");
                } else if (err.response.status === 401) {
                    setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                } else {
                    setError(`Lỗi khi tải tiến trình: ${err.response.data?.message || err.message}`);
                    toast.error(`Lỗi server: ${err.response.data?.message || err.message}`);
                }
            } else if (err.request) {
                setError("Không thể kết nối đến máy chủ.");
                toast.error("Không thể kết nối đến máy chủ.");
            } else {
                setError("Đã xảy ra lỗi không xác định.");
                toast.error("Đã xảy ra lỗi không xác định.");
            }
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchMyProcess();
    }, [fetchMyProcess]);

    const handleConfirmArrival = async () => {
        if (!processData || !token || !processData.id) {
            toast.error("Không có dữ liệu tiến trình hoặc token không hợp lệ.");
            return;
        }

        // Disable button if loading or not a MEMBER
        if (loading || userRole !== 'MEMBER') {
            return;
        }

        setLoading(true); // Indicate loading for the button action
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            // Note: The /start/{id} API is @PreAuthorize("hasRole('STAFF')").
            // If MEMBER is calling it, you might need an additional endpoint for MEMBER to "confirm arrival"
            // or the backend logic for STAFF to "start" should handle a previous MEMBER confirmation state.
            // For now, we assume this PUT request from MEMBER is intended to move the process forward.
            const response = await axios.put(`${API_START_PROCESS_URL_BASE}/${processData.id}`, null, config);

            if (response.status === 200) {
                toast.success("Xác nhận đã đến thành công!");
                // Re-fetch data to reflect the updated status (e.g., IN_PROGRESS or next state)
                fetchMyProcess();
            } else {
                toast.error("Không thể xác nhận đã đến. Vui lòng thử lại.");
            }
        } catch (err) {
            console.error("Lỗi khi xác nhận đã đến:", err);
            if (err.response) {
                console.error("Server response:", err.response.data);
                if (err.response.status === 403) {
                    toast.error("Bạn không có quyền thực hiện hành động này.");
                } else if (err.response.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                } else {
                    toast.error(`Lỗi: ${err.response.data?.message || err.message}`);
                }
            } else if (err.request) {
                toast.error("Không thể kết nối đến máy chủ.");
            } else {
                toast.error("Đã xảy ra lỗi không xác định khi xác nhận.");
            }
        } finally {
            setLoading(false); // End loading regardless of success or failure
        }
    };

    // Determine if the "Confirm Arrival" button should be shown
    // NOW: Show only if userRole is MEMBER AND processData.process is 'WAITING'
    const showConfirmArrivalButton =
        userRole === 'MEMBER' &&
        processData &&
        processData.process === 'WAITING'; // Changed condition to 'WAITING'

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Tiến Trình Hiến Máu Gần Nhất Của Bạn</h2>

            {loading && (
                <p className={styles.loadingMessage}>Đang tải tiến trình hiến máu...</p>
            )}
            {error && <p className={styles.errorMessage}>{error}</p>}

            {!loading && !error && !processData && (
                <p className={styles.noDataMessage}>Không tìm thấy tiến trình hiến máu nào cho tài khoản của bạn.</p>
            )}

            {!loading && !error && processData && (
                <div className={styles.processCard}>
                    <div className={styles.cardHeader}>
                        <h3>Tiến trình ID: {processData.id}</h3>
                        <span className={`${styles.statusBadge} ${styles[processData.process?.toLowerCase()]}`}>
                            {processData.process?.replace(/_/g, " ") || "N/A"}
                        </span>
                    </div>

                    {/* Button for MEMBER to confirm arrival */}
                    {showConfirmArrivalButton && (
                        <div className={styles.actionSection}>
                            <button
                                onClick={handleConfirmArrival}
                                className={styles.confirmButton}
                                disabled={loading}
                            >
                                {loading ? "Đang xử lý..." : "Xác nhận đã đến"}
                            </button>
                        </div>
                    )}
                    <div className={styles.section}>
                        <h4>Kiểm tra Sức khỏe & Sàng lọc</h4>
                        <div className={styles.detailGrid}>
                            <p><strong>Kiểm tra sức khỏe:</strong> {processData.healthCheck ? "Đạt" : "Chưa đạt/Chưa kiểm tra"}</p>
                            <p><strong>Nhịp tim:</strong> {processData.heartRate || "N/A"}</p>
                            <p><strong>Nhiệt độ:</strong> {processData.temperature ? `${processData.temperature}°C` : "N/A"}</p>
                            <p><strong>Cân nặng:</strong> {processData.weight ? `${processData.weight} kg` : "N/A"}</p>
                            <p><strong>Chiều cao:</strong> {processData.height ? `${processData.height} cm` : "N/A"}</p>
                            <p><strong>Hemoglobin:</strong> {processData.hemoglobin ? `${processData.hemoglobin} g/dL` : "N/A"}</p>
                            <p><strong>Huyết áp:</strong> {processData.bloodPressure || "N/A"}</p>
                            <p><strong>Bệnh mãn tính:</strong> {processData.hasChronicDisease ? "Có" : "Không"}</p>
                            <p><strong>Xăm gần đây:</strong> {processData.hasRecentTattoo ? "Có" : "Không"}</p>
                            <p><strong>Sử dụng thuốc:</strong> {processData.hasUsedDrugs ? "Có" : "Không"}</p>
                            <p className={styles.fullWidth}><strong>Ghi chú sàng lọc:</strong> {processData.screeningNote || "N/A"}</p>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <h4>Thông tin Hiến máu</h4>
                        <div className={styles.detailGrid}>
                            <p><strong>Ngày hiến:</strong> {formatDate(processData.date)}</p>
                            <p><strong>Loại hiến:</strong> {processData.type?.replace(/_/g, " ") || "N/A"}</p>
                            <p><strong>Số lượng:</strong> {processData.quantity ? `${processData.quantity} ml` : "N/A"}</p>
                            <p><strong>Nhóm máu ID:</strong> {processData.bloodTypeId || "N/A"}</p>
                            <p className={styles.fullWidth}><strong>Ghi chú:</strong> {processData.notes || "N/A"}</p>
                            <p><strong>Tiến Trình</strong> {processData.process || "N/A"}</p>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default MyDonationProcess;