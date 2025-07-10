import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";


// API base URLs
const API_MY_PROCESS_URL = "http://localhost:8080/api/donation-processes/my-process";
const API_START_PROCESS_URL_BASE = "http://localhost:8080/api/donation-processes/start";

// Utility function to get auth data (assuming this is how you manage auth)
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

const MyDonationProcess = () => {
    const [processData, setProcessData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // error state for unexpected errors
    const navigate = useNavigate();

    const { token, userRole } = getAuthData();

    // Memoize fetchMyProcess to prevent infinite re-renders
    const fetchMyProcess = useCallback(async () => {
        setLoading(true);
        setError(null); // Clear any previous error on new fetch
        setProcessData(null); // Clear previous data

        if (!token) {
            toast.error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.", { position: "top-right" });
            setError("Không có token xác thực."); // Client-side auth error
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

            // Check if response data is empty or indicates no process
            if (response.status === 200 && (Object.keys(response.data).length === 0 || (Array.isArray(response.data) && response.data.length === 0))) {
                setProcessData(null); // Explicitly set to null if no data
                setError(null); // No error, just no data
                toast.info("Bạn chưa có tiến trình hiến máu nào.", { position: "top-right" });
            } else if (response.status === 200 && response.data) {
                setProcessData(response.data);
                toast.success("Tải thông tin tiến trình hiến máu của bạn thành công!", { position: "top-right" });
            } else {
                // This case might be hit if status is not 200 but no error thrown by axios
                setProcessData(null);
                setError("Không thể tải thông tin tiến trình hiến máu của bạn."); // Generic fetch error
                toast.warn("Không thể tải thông tin tiến trình hiến máu của bạn.", { position: "top-right" });
            }
        } catch (err) {
            console.error("Lỗi khi tải tiến trình hiến máu:", err);
            setProcessData(null); // Ensure processData is null on any error

            if (axios.isAxiosError(err) && err.response) {
                const backendMessage = err.response.data?.message;

                // Specific handling for "no process" message from backend, even if it's a 500 status
                if (err.response.status === 404 || (backendMessage && backendMessage.includes("Bạn chưa có tiến trình hiến máu nào"))) {
                    setError(null); // Clear error state if it's just "no data"
                    toast.info("Bạn chưa có tiến trình hiến máu nào.", { position: "top-right" });
                } else if (err.response.status === 403) {
                    setError("Bạn không có quyền truy cập thông tin này.");
                    toast.error("Bạn không có quyền truy cập thông tin này.", { position: "top-right" });
                } else if (err.response.status === 401) {
                    setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", { position: "top-right" });
                } else {
                    setError(`Lỗi server: ${backendMessage || err.message}`);
                    toast.error(`Lỗi server: ${backendMessage || err.message}`, { position: "top-right" });
                }
            } else if (err.request) {
                setError("Không thể kết nối đến máy chủ.");
                toast.error("Không thể kết nối đến máy chủ.", { position: "top-right" });
            } else {
                setError("Đã xảy ra lỗi không xác định.");
                toast.error("Đã xảy ra lỗi không xác định.", { position: "top-right" });
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
            toast.error("Không có dữ liệu tiến trình hoặc token không hợp lệ.", { position: "top-right" });
            return;
        }

        if (loading || userRole !== 'MEMBER') {
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`${API_START_PROCESS_URL_BASE}/${processData.id}`, null, config);

            if (response.status === 200) {
                toast.success("Xác nhận đã đến thành công!", { position: "top-right" });
                fetchMyProcess(); // Re-fetch to update status
            } else {
                toast.error("Không thể xác nhận đã đến. Vui lòng thử lại.", { position: "top-right" });
            }
        } catch (err) {
            console.error("Lỗi khi xác nhận đã đến:", err);
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 403) {
                    toast.error("Bạn không có quyền thực hiện hành động này.", { position: "top-right" });
                } else if (err.response.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", { position: "top-right" });
                } else {
                    toast.error(`Lỗi: ${err.response.data?.message || err.message}`, { position: "top-right" });
                }
            } else if (err.request) {
                toast.error("Không thể kết nối đến máy chủ.", { position: "top-right" });
            } else {
                toast.error("Đã xảy ra lỗi không xác định khi xác nhận.", { position: "top-right" });
            }
        } finally {
            setLoading(false);
        }
    };

    const displayProcessStatus = (status) => {
        switch (status) {
            case 'WAITING': return 'Đang chờ';
            case 'IN_PROGRESS': return 'Đang tiến hành';
            case 'COMPLETED': return 'Hoàn thành';
            case 'CANCELED': return 'Đã hủy';
            case 'FAILED': return 'Thất bại';
            default: return 'N/A';
        }
    };

    const showConfirmArrivalButton =
        userRole === 'MEMBER' &&
        processData &&
        processData.process === 'WAITING';

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Tiến Trình Hiến Máu Gần Nhất Của Bạn</h2>

            {loading && (
                <div className={styles.loadingMessage}>Đang tải tiến trình hiến máu...</div>
            )}

            {!loading && error && ( // Hiển thị lỗi hệ thống chung (nếu có)
                <div className={styles.errorMessage}>{error}</div>
            )}

            {!loading && !processData && !error && ( // Hiển thị thông báo không có dữ liệu khi không có lỗi khác
                <div className={styles.noDataMessage}>
                    <p>Bạn chưa có tiến trình hiến máu nào.</p>
                    {/* Thêm nút quay lại nếu cần */}
                    {/* <button className={styles.backButton} onClick={() => navigate(-1)}>Quay lại</button> */}
                </div>
            )}

            {!loading && processData && ( // Hiển thị dữ liệu tiến trình khi có
                <div className={styles.processCard}>
                    <div className={styles.cardHeader}>
                        <h3>Tiến trình ID: {processData.id}</h3>
                        <span className={`${styles.statusBadge} ${styles[processData.process?.toLowerCase()]}`}>
                            {displayProcessStatus(processData.process)}
                        </span>
                    </div>

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
                            <p><strong>Tiến Trình:</strong> {displayProcessStatus(processData.process)}</p>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className={styles.backSection}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    Quay lại
                </button>
            </div>

        </div>
        
    );
};

export default MyDonationProcess;
