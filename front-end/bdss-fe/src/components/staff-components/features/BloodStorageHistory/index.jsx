import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./index.module.css";
// Import your existing Modal component
import Modal from "./Modal"; // Adjust path if your Modal component is elsewhere

// Basic Modal component if you don't have one
/*
const Modal = ({ children, onClose }) => {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};
*/

const API_BASE_URL = "http://localhost:8080/blood-storage-history";

// Enums must match backend StatusBloodStorage and StatusVerified
const BloodStorageHistoryStatus = {
    IN_USED: "Đang sử dụng",
    TRANSFERRED: "Đã chuyển giao",
    STORED: "Đã lưu trữ",
    PENDING: "Đang chờ",
    EXPIRED: "Hết hạn",
    REJECTED: "Bị từ chối"
};

const VerifiedStatus = {
    SUCCESS: "Thành công",
    FAILED: "Thất bại",
    PENDING: "Đang chờ"
};

// Utility function to get auth data (reused from previous components)
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

// Utility function to format date-time
const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

const BloodStorageHistoryList = () => {
    const [historyRecords, setHistoryRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState(""); // For IN_USED, TRANSFERRED
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { token } = getAuthData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchHistoryRecords = useCallback(async () => {
        setLoading(true);
        setError(null);
        setHistoryRecords([]);

        if (!token) {
            toast.error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
            setError("Không có token xác thực.");
            setLoading(false);
            return;
        }

        try {
            let url = `${API_BASE_URL}`;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {},
            };

            if (selectedStatusFilter && selectedStatusFilter !== "ALL") {
                url = `${API_BASE_URL}/status`;
                config.params.status = selectedStatusFilter;
            }

            const response = await axios.get(url, config);
            if (response.status === 200) {
                setHistoryRecords(response.data);
                toast.success(
                    `Tải dữ liệu lịch sử kho máu thành công! (${response.data.length} bản ghi)`
                );
            } else {
                toast.warn("Không thể tải dữ liệu lịch sử kho máu.");
            }
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu lịch sử kho máu:", err);
            setError("Không thể tải dữ liệu lịch sử kho máu. Vui lòng thử lại.");
            if (err.response) {
                console.error("Server response:", err.response.data);
                console.error("Server status:", err.response.status);
                if (err.response.status === 403) {
                    toast.error("Bạn không có quyền truy cập chức năng này.");
                } else if (err.response.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
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
            setLoading(false);
        }
    }, [selectedStatusFilter, token]);

    useEffect(() => {
        fetchHistoryRecords();
    }, [fetchHistoryRecords]); // Re-fetch when filter or token changes

    const handleStatusFilterChange = (e) => {
        setSelectedStatusFilter(e.target.value);
    };

    const handleViewDetails = (record) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Lịch Sử Kho Máu</h2>

            <div className={styles.topControls}>
                <div className={styles.filterSection}>
                    <label htmlFor="statusFilter" className={styles.label}>
                        Lọc theo trạng thái:
                    </label>
                    <select
                        id="statusFilter"
                        className={styles.selectField}
                        value={selectedStatusFilter}
                        onChange={handleStatusFilterChange}
                        disabled={loading}
                    >
                        <option value="">Tất cả</option>
                        {/* Only show IN_USED and TRANSFERRED as per backend API restriction */}
                        {Object.values(BloodStorageHistoryStatus).map((status) => (
                            <option key={status} value={status}>
                                {status.replace(/_/g, " ")}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && (
                <p className={styles.loadingMessage}>Đang tải dữ liệu lịch sử kho máu...</p>
            )}
            {error && <p className={styles.errorMessage}>{error}</p>}

            {!loading && !error && historyRecords.length === 0 && (
                <p className={styles.noDataMessage}>Không có dữ liệu lịch sử kho máu nào.</p>
            )}

            {!loading && !error && historyRecords.length > 0 && (
                <div className={styles.cardGrid}>
                    {historyRecords.map((item) => (
                        <div
                            key={item.id}
                            className={styles.historyCard}
                            onClick={() => handleViewDetails(item)}
                        >
                            <p className={styles.cardId}><strong>ID Lịch sử:</strong> {item.id}</p>
                            <p>
                                <strong>ID Kho gốc:</strong> {item.originalBloodStorageId}
                            </p>
                            <p>
                                <strong>Người hiến:</strong> {item.donorFullName} ({item.donorPhone})
                            </p>
                            <p>
                                <strong>Nhóm máu:</strong> {item.bloodType}
                            </p>
                            <p>
                                <strong>Thành phần:</strong> {item.bloodComponent}
                            </p>
                            <p>
                                <strong>Số lượng:</strong> {item.quantity}
                            </p>
                            <p>
                                <strong>Trạng thái:</strong>{" "}
                                <span
                                    className={`${styles.statusBadge} ${styles[item.bloodStatus?.toLowerCase()]}`}
                                >
                                    {BloodStorageHistoryStatus[item.bloodStatus] || item.bloodStatus}
                                </span>
                            </p>
                            <p className={styles.cardCreated}>
                                <strong>Thời điểm tạo lịch sử:</strong> {formatDateTime(item.createAt)}
                            </p>
                            {item.archivedAt && (
                                <p className={styles.cardArchived}>
                                    <strong>Thời điểm lưu trữ:</strong> {formatDateTime(item.archivedAt)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && selectedRecord && (
                <Modal onClose={handleCloseModal}>
                    <div className={styles.modalContent}>
                        <h3>Chi Tiết Lịch Sử Kho Máu ID: {selectedRecord.id}</h3>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>ID Kho gốc:</strong>
                            </p>
                            <p>{selectedRecord.originalBloodStorageId}</p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Người hiến:</strong>
                            </p>
                            <p>{selectedRecord.donorFullName || "N/A"} ({selectedRecord.donorPhone || "N/A"})</p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Nhóm máu:</strong>
                            </p>
                            <p>{selectedRecord.bloodType || "N/A"}</p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Thành phần:</strong>
                            </p>
                            <p>{selectedRecord.bloodComponent || "N/A"}</p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Số lượng:</strong>
                            </p>
                            <p>{selectedRecord.quantity || "N/A"}</p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Trạng thái:</strong>
                            </p>
                            <p
                                className={`${styles.statusBadge} ${styles[selectedRecord.bloodStatus?.toLowerCase()]}`}
                                >
                                    {BloodStorageHistoryStatus[selectedRecord.bloodStatus] || selectedRecord.bloodStatus}
                            </p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Thời điểm tạo lịch sử:</strong>
                            </p>
                            <p>{formatDateTime(selectedRecord.createAt)}</p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Người tạo ID:</strong>
                            </p>
                            <p>{selectedRecord.createdById || "N/A"}</p>
                        </div>

                        {selectedRecord.approvedAt && (
                            <>
                                <h4>Thông tin Duyệt:</h4>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Thời điểm duyệt:</strong>
                                    </p>
                                    <p>{formatDateTime(selectedRecord.approvedAt)}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Người duyệt ID:</strong>
                                    </p>
                                    <p>{selectedRecord.approvedById || "N/A"}</p>
                                </div>
                            </>
                        )}

                        {selectedRecord.takeAt && (
                            <>
                                <h4>Thông tin Sử dụng/Chuyển giao:</h4>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Thời điểm sử dụng:</strong>
                                    </p>
                                    <p>{formatDateTime(selectedRecord.takeAt)}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Lý do sử dụng:</strong>
                                    </p>
                                    <p>{selectedRecord.usageReason || "N/A"}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Người thực hiện ID:</strong>
                                    </p>
                                    <p>{selectedRecord.takeById || "N/A"}</p>
                                </div>
                            </>
                        )}

                        {selectedRecord.verifiedAt && (
                            <>
                                <h4>Thông tin Xác minh:</h4>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Thời điểm xác minh:</strong>
                                    </p>
                                    <p>{formatDateTime(selectedRecord.verifiedAt)}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Trạng thái xác minh:</strong>
                                    </p>
                                    <p
                                    className={`${styles.detailRow} ${styles[selectedRecord.verifiedStatus?.toLowerCase()]}`}
                                    >
                                        {VerifiedStatus[selectedRecord.verifiedStatus] || selectedRecord.verifiedStatus}
                                    </p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Ghi chú xác minh:</strong>
                                    </p>
                                    <p>{selectedRecord.note || "N/A"}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Người xác minh ID:</strong>
                                    </p>
                                    <p>{selectedRecord.verifiedById || "N/A"}</p>
                                </div>
                            </>
                        )}
                        
                        {selectedRecord.archivedAt && (
                            <div className={styles.detailRow}>
                                <p>
                                    <strong>Thời điểm lưu trữ:</strong>
                                </p>
                                <p>{formatDateTime(selectedRecord.archivedAt)}</p>
                            </div>
                        )}

                        <button
                            onClick={handleCloseModal}
                            className={styles.closeModalButton}
                        >
                            Đóng
                        </button>
                    </div>
                </Modal>
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
        </div>
    );
};

export default BloodStorageHistoryList;