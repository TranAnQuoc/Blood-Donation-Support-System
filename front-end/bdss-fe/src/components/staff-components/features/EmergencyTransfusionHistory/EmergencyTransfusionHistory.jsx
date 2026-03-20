import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './EmergencyTransfusionHistory.module.css'; // Import CSS Modules

// Định nghĩa các tùy chọn cho kết quả Crossmatch
const CROSSMATCH_OPTIONS = [
    { value: 'PENDING', label: 'Đang chờ kết quả' },
    { value: 'COMPATIBLE', label: 'Tương thích' },
    { value: 'INCOMPATIBLE', label: 'Không tương thích' }
];

// Định nghĩa các tùy chọn cho kết quả của yêu cầu (FULFILLED, UNFULFILLED, PARTIAL)
const RESULT_OPTIONS = [
    { value: 'FULFILLED', label: 'Đã hoàn thành' },
    { value: 'UNFULFILLED', label: 'Chưa hoàn thành' },
    { value: 'PARTIAL', label: 'Hoàn thành một phần' }
];

// Định nghĩa các tùy chọn cho EmergencyPlace
const EMERGENCY_PLACE_OPTIONS = [
    { value: 'AT_CENTER', label: 'Tại cơ sở' },
    { value: 'TRANSFER', label: 'Chuyển đến nơi khác' }
];

// Dữ liệu tĩnh cho Blood Types dựa trên initBloodTypes của backend
const BLOOD_TYPES = [
    { id: 1, type: "UNKNOWN", rhFactor: "UNKNOWN", label: "UNKNOWN - UNKNOWN" },
    { id: 2, type: "A", rhFactor: "+", label: "A+" },
    { id: 3, type: "A", rhFactor: "-", label: "A-" },
    { id: 4, type: "B", rhFactor: "+", label: "B+" },
    { id: 5, type: "B", rhFactor: "-", label: "B-" },
    { id: 6, type: "AB", rhFactor: "+", label: "AB+" },
    { id: 7, type: "AB", rhFactor: "-", label: "AB-" },
    { id: 8, type: "O", rhFactor: "+", label: "O+" },
    { id: 9, type: "O", rhFactor: "-", label: "O-" }
];

// Dữ liệu tĩnh cho Blood Components dựa trên initBloodComponents của backend
const BLOOD_COMPONENTS = [
    { id: 1, name: "Unknow" },
    { id: 2, name: "Toàn phần" },
    { id: 3, name: "Huyết tương" },
    { id: 4, name: "Hồng cầu" },
    { id: 5, name: "Tiểu cầu" },
    { id: 6, name: "Bạch cầu" }
];


const EmergencyTransfusionHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    // State cho Modal hiển thị ảnh (từ cột "Ảnh Minh Chứng")
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentHealthFileBase64, setCurrentHealthFileBase64] = useState('');

    // State cho Modal hiển thị chi tiết đầy đủ
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedItemDetails, setSelectedItemDetails] = useState(null);

    useEffect(() => {
        const fetchEmergencyHistory = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/emergency-histories', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data)) {
                    setHistory(response.data);
                } else {
                    console.error("Lỗi: Dữ liệu lịch sử nhận được từ API không phải là một mảng:", response.data);
                    setError("Dữ liệu lịch sử nhận được không hợp lệ. Vui lòng liên hệ quản trị viên.");
                }
            } catch (err) {
                console.error('Lỗi khi tải lịch sử khẩn cấp:', err);
                if (err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        setError('Phiên làm việc đã hết hạn hoặc không có quyền truy cập. Vui lòng đăng nhập lại.');
                    } else {
                        setError(`Lỗi từ server: ${err.response.data.message || 'Không thể tải lịch sử khẩn cấp. Vui lòng thử lại sau.'}`);
                    }
                } else if (err.request) {
                    setError('Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo backend đang chạy.');
                } else {
                    setError('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchEmergencyHistory();
        } else {
            setError('Không có token xác thực. Vui lòng đăng nhập.');
            setLoading(false);
        }
    }, [token]);

    // Hàm xử lý khi bấm nút "Xem File" (cho cột Ảnh Minh Chứng)
    const handleViewHealthFile = (base64String) => {
        setCurrentHealthFileBase64(base64String);
        setShowImageModal(true);
    };

    // Hàm đóng modal hiển thị ảnh
    const handleCloseImageModal = () => {
        setShowImageModal(false);
        setCurrentHealthFileBase64('');
    };

    // Hàm xử lý khi bấm nút "Xem Chi Tiết" (cho modal chi tiết đầy đủ)
    const handleViewDetails = (item) => {
        setSelectedItemDetails(item);
        setShowDetailsModal(true);
    };

    // Hàm đóng modal hiển thị chi tiết đầy đủ
    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedItemDetails(null);
    };

    // Helper function to get display label from options
    const getOptionLabel = (options, value) => {
        return options.find(opt => opt.value === value)?.label || value || 'N/A';
    };

    // Helper function to render a detail field conditionally
    const renderDetailField = (label, value, options = null) => {
        // Check for null, undefined, empty string, or 'N/A' string
        if (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim().toUpperCase() === 'N/A')) {
            return null; // Don't render if value is not significant
        }

        let displayValue = value;

        // Apply specific formatting based on label or type
        if (label === 'Thời Gian Giải Quyết' && value) {
            displayValue = new Date(value).toLocaleString();
        } else if (label === 'Nhiệt Độ' && typeof value === 'number') {
            displayValue = `${value}°C`;
        } else if (label === 'Mức Hemoglobin' && typeof value === 'number') {
            displayValue = `${value} g/dL`;
        } else if (label === 'Số Lượng Máu' && typeof value === 'number') {
            displayValue = `${value} ml`;
        } else if (label === 'Xác Nhận Nhóm Máu' && typeof value === 'boolean') {
            displayValue = value ? 'Đã xác nhận' : 'Chưa xác nhận';
        } else if (options) { // For fields using predefined options (enums)
            displayValue = getOptionLabel(options, value);
        }

        return (
            <p className={styles.detailItem}>
                <span className={styles.detailLabel}>{label}:</span>{" "}
                <span className={styles.detailValue}>{displayValue}</span>
            </p>
        );
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải lịch sử...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (!Array.isArray(history)) {
        console.error("Lỗi: history không phải là một mảng khi render. Giá trị hiện tại:", history);
        return <div className={styles.errorMessage}>Đã xảy ra lỗi nội bộ với dữ liệu lịch sử. Vui lòng thử lại hoặc liên hệ hỗ trợ.</div>;
    }

    return (
        <div className={styles.emergencyHistoryContainer}>
            <h2 className={styles.listTitle}>Lịch Sử Yêu Cầu Khẩn Cấp</h2>
            {history.length === 0 ? (
                <p className={styles.noDataMessage}>Không có lịch sử yêu cầu khẩn cấp nào.</p>
            ) : (
                <div className={styles.tableWrapper} style={{ overflowX: 'auto' }}>
                    <table className={styles.emergencyHistoryTable}>
                        <thead>
                            <tr>
                                <th>Họ Tên</th>
                                <th>SĐT</th>
                                <th>Ảnh Minh Chứng</th> {/* Renamed from File SK */}
                                <th>Trạng thái (Emergency Place)</th> {/* New Column */}
                                <th>Thao tác</th> {/* New Column for View Details button */}
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => {
                                // Tìm label tiếng Việt cho EmergencyPlace
                                const emergencyPlaceLabel = EMERGENCY_PLACE_OPTIONS.find(
                                    (opt) => opt.value === item.emergencyPlace
                                )?.label || item.emergencyPlace || 'N/A';

                                return (
                                    <tr key={item.id || `row-${item.requestId}-${Math.random()}`}>
                                        <td>{item.fullNameSnapshot || 'N/A'}</td>
                                        <td>{item.phoneSnapshot || 'N/A'}</td>
                                        <td>
                                            {/* Button to view the image (healthFile) */}
                                            {item.healthFile ? (
                                                <button
                                                    className={styles.viewProofButton}
                                                    onClick={() => handleViewHealthFile(item.healthFile)}
                                                >
                                                    Xem Ảnh
                                                </button>
                                            ) : (
                                                "Không có"
                                            )}
                                        </td>
                                        <td>{emergencyPlaceLabel}</td> {/* Display Emergency Place */}
                                        <td>
                                            <button
                                                className={styles.viewDetailsButton} // Add a new style for this button
                                                onClick={() => handleViewDetails(item)}
                                            >
                                                Xem Chi Tiết
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal hiển thị ảnh (cho cột Ảnh Minh Chứng) */}
            {showImageModal && (
                <div className={styles.modalOverlay} onClick={handleCloseImageModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeModalButton} onClick={handleCloseImageModal}>
                            &times;
                        </button>
                        <h3 className={styles.modalTitle}>Ảnh Minh Chứng Sức Khỏe</h3>
                        {currentHealthFileBase64 ? (
                            <img src={`data:image/jpeg;base64,${currentHealthFileBase64}`} alt="File sức khỏe" className={styles.modalImage} />
                        ) : (
                            <p>Không tìm thấy ảnh.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Modal hiển thị chi tiết đầy đủ */}
            {showDetailsModal && selectedItemDetails && (
                <div className={styles.modalOverlay} onClick={handleCloseDetailsModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeModalButton} onClick={handleCloseDetailsModal}>
                            &times;
                        </button>
                        <h3 className={styles.modalTitle}>Chi Tiết Yêu Cầu Khẩn Cấp</h3>
                        <div className={styles.detailsGrid}>
                            {renderDetailField('ID Lịch Sử', selectedItemDetails.id)}
                            {renderDetailField('ID Yêu Cầu', selectedItemDetails.requestId)}
                            {renderDetailField('Thời Gian Giải Quyết', selectedItemDetails.resolvedAt)}
                            {renderDetailField('Họ Tên Người Cần Máu', selectedItemDetails.fullNameSnapshot)}
                            {renderDetailField('Số Điện Thoại', selectedItemDetails.phoneSnapshot)}
                            {renderDetailField('Trạng Thái Khẩn Cấp', selectedItemDetails.emergencyPlace, EMERGENCY_PLACE_OPTIONS)}

                            {/* Blood Type and Component mapping */}
                            {renderDetailField('Nhóm Máu', BLOOD_TYPES.find(bt => bt.id === selectedItemDetails.bloodTypeId)?.label)}
                            {renderDetailField('Thành Phần Máu', BLOOD_COMPONENTS.find(bc => bc.id === selectedItemDetails.componentId)?.name)}

                            {renderDetailField('Số Lượng Máu', selectedItemDetails.quantity)}
                            {renderDetailField('Kết Quả Yêu Cầu', selectedItemDetails.result, RESULT_OPTIONS)}
                            {renderDetailField('Ghi Chú', selectedItemDetails.notes)}
                            {renderDetailField('Lý Do Truyền Máu', selectedItemDetails.reasonForTransfusion)}
                            {renderDetailField('Thành Phần Máu Cần', selectedItemDetails.needComponent)}
                            {renderDetailField('Kết Quả Crossmatch', selectedItemDetails.crossmatchResult, CROSSMATCH_OPTIONS)}
                            {renderDetailField('Mức Hemoglobin', selectedItemDetails.hemoglobinLevel)}
                            {renderDetailField('Xác Nhận Nhóm Máu', selectedItemDetails.bloodGroupConfirmed)}
                            {renderDetailField('Mạch', selectedItemDetails.pulse)}
                            {renderDetailField('Nhiệt Độ', selectedItemDetails.temperature)}
                            {renderDetailField('Nhịp Thở', selectedItemDetails.respiratoryRate)}
                            {renderDetailField('Huyết Áp', selectedItemDetails.bloodPressure)}
                            {renderDetailField('Triệu Chứng', selectedItemDetails.symptoms)}
                            
                            {/* Display Health File Image within details modal */}
                            {selectedItemDetails.healthFile && (
                                <div className={styles.detailItemImage}>
                                    <span className={styles.detailLabel}>Ảnh Minh Chứng Sức Khỏe:</span>
                                    <img src={`data:image/jpeg;base64,${selectedItemDetails.healthFile}`} alt="Ảnh minh chứng sức khỏe" className={styles.modalImageSmall} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmergencyTransfusionHistory;