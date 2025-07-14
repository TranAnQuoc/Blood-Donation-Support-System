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
    // Thêm các giá trị khác nếu có trong tương lai
];

// Dữ liệu tĩnh cho Blood Types dựa trên initBloodTypes của backend
// Đảm bảo ID này khớp với ID được tạo trong cơ sở dữ liệu của bạn
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
// Đảm bảo ID này khớp với ID được tạo trong cơ sở dữ liệu của bạn
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

    // State cho Modal hiển thị ảnh (thêm vào đây)
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImageBase64, setCurrentImageBase64] = useState(''); // Thay vì URL, giờ là base64
    const [currentHistoryDetails, setCurrentHistoryDetails] = useState(null); // Lưu chi tiết mục lịch sử


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

    // Hàm xử lý khi bấm nút "Xem File"
    // Giả sử item.healthFileBase64 là trường chứa chuỗi base64 từ backend
    const handleViewHealthFile = (base64String, historyDetails) => {
        setCurrentImageBase64(base64String);
        setCurrentHistoryDetails(historyDetails);
        setShowImageModal(true);
    };

    // Hàm đóng modal
    const handleCloseImageModal = () => {
        setShowImageModal(false);
        setCurrentImageBase64('');
        setCurrentHistoryDetails(null);
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
                                <th>ID Yêu Cầu</th>
                                <th>Thời Gian Giải Quyết</th>
                                <th>Họ Tên</th>
                                <th>SĐT</th>
                                <th>Triệu chứng</th>
                                <th>File SK</th> {/* Cột hiển thị nút xem ảnh */}
                                <th>Huyết áp</th>
                                <th>Mạch</th>
                                <th>Nhịp thở</th>
                                <th>Nhiệt độ</th>
                                <th>Mức Hemoglobin</th>
                                <th>Xác nhận nhóm máu</th>
                                <th>Nhóm Máu</th>
                                <th>Thành Phần Máu</th>
                                <th>Số Lượng (ml)</th>
                                <th>Kết quả Crossmatch</th>
                                <th>Thành phần cần</th>
                                <th>Lý do truyền máu</th>
                                <th>Kết Quả</th>
                                <th>Ghi Chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => {
                                // Tìm label tiếng Việt cho Blood Type và Blood Component
                                const bloodType = BLOOD_TYPES.find(bt => bt.id === item.bloodTypeId);
                                const bloodComponentName = BLOOD_COMPONENTS.find(bc => bc.id === item.componentId);

                                return (
                                    <tr key={item.id || `row-${item.requestId}-${Math.random()}`}>
                                        <td>{item.requestId || 'N/A'}</td>
                                        <td>{item.resolvedAt ? new Date(item.resolvedAt).toLocaleString() : 'N/A'}</td>
                                        <td>{item.fullNameSnapshot || 'N/A'}</td>
                                        <td>{item.phoneSnapshot || 'N/A'}</td>
                                        <td>{item.symptoms || 'N/A'}</td>
                                    
                                        <td>
                                            {/* Gọi handleViewHealthFile với dữ liệu base64 từ item.healthFileBase64 */}
                                            {/* Giả sử backend trả về trường healthFileBase64 */}
                                            {item.healthFile ? (
                                                <button
                                                    className={styles.viewProofButton} // Bạn có thể tái sử dụng hoặc định nghĩa style mới
                                                    onClick={() => handleViewHealthFile(item.healthFile, item)}
                                                >
                                                    Xem File
                                                </button>
                                            ) : (
                                                "Không có"
                                            )}
                                        </td>
                                        <td>{item.bloodPressure || 'N/A'}</td>
                                        <td>{item.pulse !== null ? item.pulse : 'N/A'}</td>
                                        <td>{item.respiratoryRate !== null ? item.respiratoryRate : 'N/A'}</td>
                                        <td>{item.temperature !== null ? `${item.temperature}°C` : 'N/A'}</td>
                                        <td>{item.hemoglobinLevel !== null ? `${item.hemoglobinLevel} g/dL` : 'N/A'}</td>
                                        <td>{item.bloodGroupConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</td>
                                        <td>{bloodType ? bloodType.label : 'N/A'}</td>
                                        <td>{bloodComponentName ? bloodComponentName.name : 'N/A'}</td>
                                        <td>{item.quantity !== null ? `${item.quantity} ml` : 'N/A'}</td>
                                        <td>
                                            {CROSSMATCH_OPTIONS.find(opt => opt.value === item.crossmatchResult)?.label || item.crossmatchResult || 'N/A'}
                                        </td>
                                        <td>{item.needComponent || 'N/A'}</td>
                                        <td>{item.reasonForTransfusion || 'N/A'}</td>
                                        <td>
                                            {RESULT_OPTIONS.find(opt => opt.value === item.result)?.label || item.result || 'N/A'}
                                        </td>
                                        <td>{item.notes || 'N/A'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal hiển thị ảnh - giống hệt với EmergencyTransfusionRequestList */}
            {showImageModal && (
                <div className={styles.modalOverlay} onClick={handleCloseImageModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeModalButton} onClick={handleCloseImageModal}>
                            &times;
                        </button>
                        {currentHistoryDetails && (
                            <div className={styles.modalHeader}>
                                <h3>File sức khỏe của: {currentHistoryDetails.fullNameSnapshot}</h3>
                                {/* Giả sử có một trường text khác trong History DTO để hiển thị lý do nếu có */}
                                {/* {currentHistoryDetails.healthFileText && <p>Chi tiết: {currentHistoryDetails.healthFileText}</p>} */}
                            </div>
                        )}
                        {currentImageBase64 ? (
                            <img src={`data:image/jpeg;base64,${currentImageBase64}`} alt="File sức khỏe" className={styles.modalImage} />
                        ) : (
                            <p>Không tìm thấy ảnh.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Không có modal duyệt/từ chối ở đây vì đây là lịch sử */}
        </div>
    );
};

export default EmergencyTransfusionHistory;