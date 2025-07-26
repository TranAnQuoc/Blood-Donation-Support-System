import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../../configs/axios"; // Sử dụng axiosInstance
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

// API base URLs
const API_MY_PROCESS_URL = "/donation-processes/my-process"; // Đường dẫn tương đối nếu dùng axiosInstance
const API_START_PROCESS_URL_BASE = "/donation-processes/start"; // Đường dẫn tương đối nếu dùng axiosInstance

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
                userRole = Array.isArray(userObj.role) ? userObj.role[0] : userObj.role;
            }
        } catch (e) {
            console.error("Error parsing user from localStorage:", e);
        }
    }
    return { token, userRole };
};

// Utility function to format date and time (handles both LocalDate and LocalDateTime)
const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    try {
        if (isoString.includes('T')) { // Likely LocalDateTime
            const date = new Date(isoString);
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            return date.toLocaleString('vi-VN', options);
        } else { // Likely LocalDate (YYYY-MM-DD)
            const [year, month, day] = isoString.split('-');
            return `${day}/${month}/${year}`;
        }
    } catch (e) {
        console.error("Invalid date/time string:", isoString, e);
        return 'Invalid Date/Time';
    }
};

// Utility functions for enum to display text
const getStatusProcessName = (status) => {
    switch (status) {
        case 'WAITING': return 'Đang chờ';
        case 'IN_PROCESS': return 'Đang tiến hành';
        case 'COMPLETED': return 'Hoàn thành';
        case 'FAILED': return 'Thất bại';
        case 'DONOR_CANCEL': return 'Người hiến hủy bỏ';
        default: return 'Không xác định';
    }
};

const getStatusHealthCheckName = (status) => {
    switch (status) {
        case 'PASS': return 'Đạt';
        case 'FAIL': return 'Không đạt';
        case 'UNKNOWN': return 'Chưa xác định';
        default: return 'N/A';
    }
};

const getGenderName = (gender) => {
    switch (gender) {
        case 'MALE': return 'Nam';
        case 'FEMALE': return 'Nữ';
        case 'OTHER': return 'Khác';
        default: return 'N/A';
    }
};

const getDonationTypeName = (type) => {
    switch (type) {
        case 'WHOLE_BLOOD': return 'Máu toàn phần';
        case 'PLATELETS': return 'Tiểu cầu';
        case 'PLASMA': return 'Huyết tương';
        default: return 'N/A';
    }
};

const MyDonationProcess = () => {
    const [processData, setProcessData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { token } = getAuthData();

    const fetchMyProcess = useCallback(async () => {
        setLoading(true);
        setError(null);
        setProcessData(null);

        if (!token) {
            toast.error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.", { position: "top-right" });
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

            const response = await axiosInstance.get(API_MY_PROCESS_URL, config);

            if (response.status === 200 && (Object.keys(response.data).length === 0 || (Array.isArray(response.data) && response.data.length === 0))) {
                setProcessData(null);
                setError(null);
                toast.info("Bạn chưa có tiến trình hiến máu nào.", { position: "top-right" });
            } else if (response.status === 200 && response.data) {
                setProcessData(response.data);
                toast.success("Tải thông tin tiến trình hiến máu của bạn thành công!", { position: "top-right" });
            } else {
                setProcessData(null);
                setError("Không thể tải thông tin tiến trình hiến máu của bạn.");
                toast.warn("Không thể tải thông tin tiến trình hiến máu của bạn.", { position: "top-right" });
            }
        } catch (err) {
            console.error("Lỗi khi tải tiến trình hiến máu:", err);
            setProcessData(null);

            if (axiosInstance.isAxiosError(err) && err.response) {
                const backendMessage = err.response.data?.message;

                if (err.response.status === 404 || (backendMessage && backendMessage.includes("Bạn chưa có tiến trình hiến máu nào"))) {
                    setError(null);
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

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Tiến Trình Hiến Máu Gần Nhất Của Bạn</h2>

            {loading && (
                <div className={styles.loadingMessage}>Đang tải tiến trình hiến máu...</div>
            )}

            {!loading && error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            {!loading && !processData && !error && (
                <div className={styles.noDataMessage}>
                    <p>Bạn chưa có tiến trình hiến máu nào.</p>
                </div>
            )}

            {!loading && processData && (
                <div className={styles.processCard}>
                    <div className={styles.cardHeader}>
                        <h3>ID: {processData.id}</h3>
                        <span className={`${styles.statusBadge} ${styles[processData.process?.toLowerCase()]}`}>
                            {getStatusProcessName(processData.process)}
                        </span>
                    </div>

                    <div className={styles.section}>
                        <h4>Thông tin Yêu cầu Hiến máu</h4>
                        <div className={styles.detailGrid}>
                            <p><strong>Người hiến:</strong> {processData.donorFullName || 'N/A'}</p>
                            <p><strong>Ngày sinh:</strong> {formatDateTime(processData.donorBirthDate)}</p>
                            <p><strong>SĐT:</strong> {processData.donorPhone || 'N/A'}</p>
                            <p><strong>Giới tính:</strong> {getGenderName(processData.donorGender)}</p>
                            <p><strong>Nhóm máu ĐK:</strong> {processData.donorBloodType ? `${processData.donorBloodType.type}${processData.donorBloodType.rhFactor}` : 'N/A'}</p>
                            <p><strong>Sự kiện:</strong> {processData.eventName || 'N/A'}</p>
                            <p><strong>Thời gian bắt đầu:</strong> {formatDateTime(processData.startTime)}</p>
                            <p><strong>Người thực hiện:</strong> {processData.performerFullName || 'N/A'}</p>
                            <p><strong>Thời gian kết thúc:</strong> {processData.endTime ? formatDateTime(processData.endTime) : 'Chưa kết thúc'}</p>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h4>Thông số Sức khỏe & Sàng lọc</h4>
                        <div className={styles.detailGrid}>
                            <p><strong>Trạng thái sàng lọc:</strong>
                                <span className={`${styles.statusBadge} ${styles[processData.statusHealthCheck?.toLowerCase()]}`}>
                                    {getStatusHealthCheckName(processData.statusHealthCheck)}
                                </span>
                            </p>
                            <p><strong>Nhịp tim:</strong> {processData.heartRate || "N/A"} bpm</p>
                            <p><strong>Nhiệt độ:</strong> {processData.temperature !== null ? `${processData.temperature}°C` : "N/A"}</p>
                            <p><strong>Cân nặng:</strong> {processData.weight !== null ? `${processData.weight} kg` : "N/A"}</p>
                            <p><strong>Chiều cao:</strong> {processData.height !== null ? `${processData.height} cm` : "N/A"}</p>
                            <p><strong>Hemoglobin:</strong> {processData.hemoglobin !== null ? `${processData.hemoglobin} g/dL` : "N/A"}</p>
                            <p><strong>Huyết áp:</strong> {processData.bloodPressure || "N/A"}</p>
                            {processData.statusHealthCheck === 'FAIL' && (
                                <p className={styles.fullWidth}><strong>Lý do sàng lọc thất bại:</strong> {processData.failureReason || 'N/A'}</p>
                            )}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h4>Thông tin Hiến máu</h4>
                        <div className={styles.detailGrid}>
                            <p><strong>Lượng máu hiến:</strong> {processData.quantity !== null && processData.quantity !== 0 ? `${processData.quantity} ml` : "N/A"}</p>
                            <p><strong>Loại hiến:</strong> {getDonationTypeName(processData.typeDonation)}</p>
                            <p className={styles.fullWidth}><strong>Ghi chú quy trình:</strong> {processData.notes || "N/A"}</p>
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