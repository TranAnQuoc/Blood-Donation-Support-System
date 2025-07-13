import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./BloodStorage.module.css";
import Modal from "../Modal";
import { useNavigate } from "react-router-dom";

import BloodStorageUseAction from "../use/index"; // GIỮ LẠI DÒNG NÀY

const API_BASE_URL = "http://localhost:8080/api/blood-storage";

// Dữ liệu Blood Components tĩnh dựa trên backend init
// Cần đảm bảo ID khớp với ID mà backend sẽ gán khi khởi tạo (thường là 1, 2, 3...)
// Nếu ID không chắc chắn, bạn cần kiểm tra cơ sở dữ liệu hoặc logic backend.
// Ở đây tôi giả định ID tăng dần từ 1.
const STATIC_BLOOD_COMPONENTS = [
    // { id: 1, componentName: "Unknow" },
    { id: 2, componentName: "Toàn phần" },
    { id: 3, componentName: "Huyết tương" },
    { id: 4, componentName: "Hồng cầu" },
    { id: 5, componentName: "Tiểu cầu" },
    { id: 6, componentName: "Bạch cầu" },
];

// Dữ liệu Blood Types tĩnh dựa trên backend init
// Tương tự, giả định ID tăng dần từ 1.
const STATIC_BLOOD_TYPES = [
    // { id: 1, bloodTypeName: "UNKNOWN", rhType: "UNKNOWN" },
    { id: 2, bloodTypeName: "A", rhType: "+" },
    { id: 3, bloodTypeName: "A", rhType: "-" },
    { id: 4, bloodTypeName: "B", rhType: "+" },
    { id: 5, bloodTypeName: "B", rhType: "-" },
    { id: 6, bloodTypeName: "AB", rhType: "+" },
    { id: 7, bloodTypeName: "AB", rhType: "-" },
    { id: 8, bloodTypeName: "O", rhType: "+" },
    { id: 9, bloodTypeName: "O", rhType: "-" },
];

const Role = {
    ADMIN: "Quản trị viên",
    STAFF: "Nhân viên",
    MEMBER: "Thành viên",
}

const verifiedStatus = {
    CONFIRMED: "Đã xác minh",
    UNCONFIRMED: "Chưa xác minh",
}

// Enum cho trạng thái kho máu (phải khớp với backend)
const BloodStorageStatus = {
    PENDING: "Đang chờ",
    REJECTED: "Bị từ chối",
    STORED: "Đã lưu",
    IN_USED: "Đang sử dụng",
    TRANSFERRED: "Đã chuyển giao",
    EXPIRED: "Đã hết hạn",
};

// Hàm tiện ích để format ngày giờ
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

// ==========================================================
// HÀM HỖ TRỢ ĐỂ LẤY TOKEN VÀ ROLE TỪ LOCALSTORAGE (cập nhật từ component trước)
// ==========================================================
const getAuthData = () => {
    const userString = localStorage.getItem('user');
    let token = null;
    let userRole = null;
    let isLoggedIn = false;

    if (userString) {
        try {
            const userObj = JSON.parse(userString);
            if (userObj.token) {
                token = userObj.token;
                isLoggedIn = true;
            }
            if (userObj.role) {
                userRole = Array.isArray(userObj.role) ? userObj.role[0] : userObj.role;
            }
        } catch (e) {
            console.error("Lỗi khi giải mã đối tượng 'user' từ localStorage:", e);
        }
    }
    return { token, userRole, isLoggedIn };
};
// ==========================================================

const BloodStorageList = () => {
    const [bloodStorages, setBloodStorages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");

    // State mới cho lọc theo nhóm máu và thành phần máu
    const [selectedBloodTypeId, setSelectedBloodTypeId] = useState("");
    const [selectedBloodComponentId, setSelectedBloodComponentId] = useState("");

    const [selectedStorage, setSelectedStorage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const { token, userRole } = getAuthData();

    // Hàm tải danh sách kho máu, có thêm tham số filter
    const fetchBloodStorages = async () => {
        setLoading(true);
        setError(null);
        setBloodStorages([]);

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

            // Kiểm tra xem có bất kỳ filter tìm kiếm nào được chọn không (theo type/component)
            const isSearchingByTypeOrComponent = selectedBloodTypeId || selectedBloodComponentId;

            if (isSearchingByTypeOrComponent) {
                url = `${API_BASE_URL}/search`; // Sử dụng endpoint /search
                if (selectedBloodTypeId) {
                    config.params.bloodTypeId = selectedBloodTypeId;
                }
                if (selectedBloodComponentId) {
                    config.params.bloodComponentId = selectedBloodComponentId;
                }
                // Khi tìm kiếm theo type/component, bỏ qua filter status
                config.params.status = undefined;
            } else if (selectedStatus && selectedStatus !== "ALL") {
                // Chỉ áp dụng filter status nếu không có filter type/component
                url = `${API_BASE_URL}/status`; // Sử dụng endpoint /status
                config.params.status = selectedStatus;
            }
            // Nếu không có filter nào, URL vẫn là API_BASE_URL và params rỗng,
            // nghĩa là sẽ gọi GET /api/blood-storage (lấy tất cả)

            const response = await axios.get(url, config);
            if (response.status === 200) {
                setBloodStorages(response.data);
                toast.success(
                    `Tải dữ liệu kho máu thành công! (${response.data.length} bản ghi)`
                );
            } else {
                toast.warn("Không thể tải dữ liệu kho máu.");
            }
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu kho máu:", err);
            setError("Không thể tải dữ liệu kho máu. Vui lòng thử lại.");
            if (err.response) {
                console.error("Server response:", err.response.data);
                console.error("Server status:", err.response.status);
                if (err.response.status === 403) {
                    toast.error("Bạn không có quyền truy cập chức năng này.");
                } else if (err.response.status === 404) {
                    toast.error("Không tìm thấy đường dẫn API. Vui lòng kiểm tra lại backend.");
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
    };

    useEffect(() => {
        // Tải dữ liệu kho máu mỗi khi filter hoặc token thay đổi
        fetchBloodStorages();
    }, [selectedStatus, selectedBloodTypeId, selectedBloodComponentId, token]);

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        // Reset các filter khác khi thay đổi status chính
        setSelectedBloodTypeId("");
        setSelectedBloodComponentId("");
    };

    const handleBloodTypeChange = (e) => {
        setSelectedBloodTypeId(e.target.value);
        // Reset status khi filter theo type/component
        setSelectedStatus("");
    };

    const handleBloodComponentChange = (e) => {
        setSelectedBloodComponentId(e.target.value);
        // Reset status khi filter theo type/component
        setSelectedStatus("");
    };

    const handleViewDetails = (storageItem) => {
        setSelectedStorage(storageItem);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStorage(null);
    };

    // Hàm này sẽ được gọi khi BloodStorageUseAction thực hiện hành động thành công
    const handleActionSuccess = () => {
        setIsModalOpen(false);
        setSelectedStorage(null);
        fetchBloodStorages(); // Tải lại danh sách kho máu
    };

    const handleCreateNew = () => {
        navigate('/staff-dashboard/blood-storage/create'); // Điều hướng đến trang tạo mới
    };

    // Kiểm tra quyền STAFF để hiển thị nút "Tạo mới"
    const canCreate = userRole?.toUpperCase() === 'STAFF';

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Danh Sách Kho Máu</h2>

            <div className={styles.topControls}>
                <div className={styles.filterSection}>
                    <div className={styles.filterGroup}>
                        <label htmlFor="statusFilter" className={styles.label}>
                            Lọc theo trạng thái:
                        </label>
                        <select
                            id="statusFilter"
                            className={styles.selectField}
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            disabled={loading}
                        >
                            <option value="">Tất cả</option>
                            {Object.values(BloodStorageStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status.replace(/_/g, " ")}{" "}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Bộ lọc theo Nhóm máu */}
                    <div className={styles.filterGroup}>
                        <label htmlFor="bloodTypeFilter" className={styles.label}>
                            Lọc theo Nhóm máu:
                        </label>
                        <select
                            id="bloodTypeFilter"
                            className={styles.selectField}
                            value={selectedBloodTypeId}
                            onChange={handleBloodTypeChange}
                            disabled={loading}
                        >
                            <option value="">Tất cả Nhóm máu</option>
                            {STATIC_BLOOD_TYPES.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.bloodTypeName} {type.rhType}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Bộ lọc theo Thành phần máu */}
                    <div className={styles.filterGroup}>
                        <label htmlFor="bloodComponentFilter" className={styles.label}>
                            Lọc theo Thành phần:
                        </label>
                        <select
                            id="bloodComponentFilter"
                            className={styles.selectField}
                            value={selectedBloodComponentId}
                            onChange={handleBloodComponentChange}
                            disabled={loading}
                        >
                            <option value="">Tất cả Thành phần</option>
                            {STATIC_BLOOD_COMPONENTS.map((component) => (
                                <option key={component.id} value={component.id}>
                                    {component.componentName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {canCreate && (
                    <button className={styles.createButton} onClick={handleCreateNew}>
                        Tạo mới kho máu
                    </button>
                )}
            </div>

            {loading && (
                <p className={styles.loadingMessage}>Đang tải dữ liệu kho máu...</p>
            )}
            {error && <p className={styles.errorMessage}>{error}</p>}

            {!loading && !error && bloodStorages.length === 0 && (
                <p className={styles.noDataMessage}>Không có dữ liệu kho máu nào.</p>
            )}

            {!loading && !error && bloodStorages.length > 0 && (
                <div className={styles.cardGrid}>
                    {bloodStorages.map((item) => (
                        <div
                            key={item.id}
                            className={styles.bloodStorageCard}
                            onClick={() => handleViewDetails(item)}
                        >
                            <p className={styles.cardId}><strong>ID: {item.id}</strong></p>
                            <p>
                                <strong>Nhóm máu:</strong> {item.bloodTypeName}
                                {item.bloodTypeRh}
                            </p>
                            <p>
                                <strong>Thành phần:</strong> {item.bloodComponentName}
                            </p>
                            <p>
                                <strong>Số lượng:</strong> {item.quantity}
                            </p>
                            <p>
                                <strong>Trạng thái:</strong>{" "}
                                <span className={`${styles.statusBadge} ${styles[item.bloodStatus?.toLowerCase()]}`}>
                                    {BloodStorageStatus[item.bloodStatus] || item.bloodStatus?.replace(/_/g, " ")}
                                </span>
                            </p>
                            <p className={styles.cardCreated}>
                                <strong>Ngày tạo:</strong> {formatDateTime(item.createAt)}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && selectedStorage && (
                <Modal onClose={handleCloseModal}>
                    <div className={styles.modalContent}>
                        <h3>Chi Tiết Kho Máu ID: {selectedStorage.id}</h3>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Nhóm máu:</strong>
                            </p>
                            <p>
                                {selectedStorage.bloodTypeName}
                                {selectedStorage.bloodTypeRh}
                            </p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Thành phần:</strong>
                            </p>
                            <p>{selectedStorage.bloodComponentName}</p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Số lượng:</strong>
                            </p>
                            <p>{selectedStorage.quantity}</p>
                        </div>
                        <div className={styles.detailRow}>
                            <p><strong>Trạng thái:</strong></p>
                            <p
                                className={`${styles.statusBadge} ${
                                    styles[selectedStorage.bloodStatus?.toLowerCase()]
                                }`}
                            >
                                {BloodStorageStatus[selectedStorage.bloodStatus] || selectedStorage.bloodStatus?.replace(/_/g, " ")}
                            </p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Ngày tạo:</strong>
                            </p>
                            <p>{formatDateTime(selectedStorage.createAt)}</p>
                        </div>

                        {/* Thông tin Người hiến */}
                        <h4>Thông tin Người hiến:</h4>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Tên:</strong>
                            </p>
                            <p>{selectedStorage.donorName || "N/A"}</p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>SĐT:</strong>
                            </p>
                            <p>{selectedStorage.donorPhone || "N/A"}</p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Vai trò:</strong>
                            </p>
                            <p>{Role[selectedStorage.donorRole] || "N/A"}</p>
                        </div>

                        {/* Thông tin Người tạo */}
                        <h4>Thông tin Người tạo:</h4>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Tên:</strong>
                            </p>
                            <p>{selectedStorage.createdByName || "N/A"}</p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>SĐT:</strong>
                            </p>
                            <p>{selectedStorage.createdByPhone || "N/A"}</p>
                        </div>
                        <div className={styles.detailRow}>
                            <p>
                                <strong>Vai trò:</strong>
                            </p>
                            <p>{Role[selectedStorage.createdByRole] || "N/A"}</p>
                        </div>

                        {/* Thông tin Người duyệt */}
                        {selectedStorage.approvedAt && (
                            <>
                                <h4>Thông tin Người duyệt:</h4>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Ngày duyệt:</strong>
                                    </p>
                                    <p>{formatDateTime(selectedStorage.approvedAt)}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Tên:</strong>
                                    </p>
                                    <p>{selectedStorage.approvedByName || "N/A"}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>SĐT:</strong>
                                    </p>
                                    <p>{selectedStorage.approvedByPhone || "N/A"}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Vai trò:</strong>
                                    </p>
                                    <p>{Role[selectedStorage.approvedByRole] || "N/A"}</p>
                                </div>
                            </>
                        )}

                        {/* Thông tin Người sử dụng */}
                        {selectedStorage.takeAt && (
                            <>
                                <h4>Thông tin Người sử dụng:</h4>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Ngày sử dụng:</strong>
                                    </p>
                                    <p>{formatDateTime(selectedStorage.takeAt)}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Lý do:</strong>
                                    </p>
                                    <p>{selectedStorage.usageReason || "N/A"}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Tên:</strong>
                                    </p>
                                    <p>{selectedStorage.takeByName || "N/A"}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>SĐT:</strong>
                                    </p>
                                    <p>{selectedStorage.takeByPhone || "N/A"}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Vai trò:</strong>
                                    </p>
                                    <p>{Role[selectedStorage.takeByRole] || "N/A"}</p>
                                </div>
                            </>
                        )}

                        {/* Thông tin Xác minh */}
                        {selectedStorage.verifiedAt && (
                            <>
                                <h4>Thông tin Xác minh:</h4>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Ngày xác minh:</strong>
                                    </p>
                                    <p>{formatDateTime(selectedStorage.verifiedAt)}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Trạng thái xác minh:</strong>
                                    </p>
                                    <p
                                            className={`${styles.statusBadge} ${
                                            styles[selectedStorage.verifiedStatus?.toLowerCase()]
                                        }`}
                                    >
                                        {verifiedStatus[selectedStorage.verifiedStatus] || "N/A"}
                                    </p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Ghi chú:</strong>
                                    </p>
                                    <p>{selectedStorage.verifiedNote || "N/A"}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Tên người xác minh:</strong>
                                    </p>
                                    <p>{selectedStorage.verifiedByName || "N/A"}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>SĐT người xác minh:</strong>
                                    </p>
                                    <p>{selectedStorage.verifiedByPhone || "N/A"}</p>
                                </div>
                                <div className={styles.detailRow}>
                                    <p>
                                        <strong>Vai trò người xác minh:</strong>
                                    </p>
                                    <p>{Role[selectedStorage.verifiedByRole] || "N/A"}</p>
                                </div>
                            </>
                        )}

                        {/* Component để sử dụng/chuyển giao (chỉ STAFF) */}
                        <BloodStorageUseAction
                            storageId={selectedStorage.id}
                            onActionSuccess={handleActionSuccess}
                            currentStatus={selectedStorage.bloodStatus}
                            userRole={userRole}
                        />

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

export default BloodStorageList;