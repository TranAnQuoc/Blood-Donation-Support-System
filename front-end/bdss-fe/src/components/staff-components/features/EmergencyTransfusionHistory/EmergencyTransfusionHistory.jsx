import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './EmergencyTransfusionHistory.module.css'; // Import CSS Modules
// import { useNavigate } from 'react-router-dom'; // Uncomment if you want to redirect on token expiry

const EmergencyTransfusionHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy token từ localStorage VỚI KEY LÀ 'token' (đã khớp với LoginForm)
    const token = localStorage.getItem('token');

    // // Uncomment and use if you want to redirect on token expiry
    // const navigate = useNavigate(); 

    useEffect(() => {
        const fetchEmergencyHistory = async () => {
            try {
                // Sử dụng URL API đầy đủ để gọi trực tiếp backend, loại trừ vấn đề proxy
                const response = await axios.get('http://localhost:8080/api/emergency-histories', { 
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Kiểm tra xem response.data có phải là mảng không trước khi set
                if (Array.isArray(response.data)) {
                    setHistory(response.data);
                } else {
                    // Nếu không phải mảng, báo lỗi và log ra console
                    console.error("Lỗi: Dữ liệu lịch sử nhận được từ API không phải là một mảng:", response.data);
                    setError("Dữ liệu lịch sử nhận được không hợp lệ. Vui lòng liên hệ quản trị viên.");
                }
            } catch (err) {
                console.error('Lỗi khi tải lịch sử khẩn cấp:', err);
                if (err.response) {
                    // Xử lý lỗi 401 (Unauthorized) hoặc 403 (Forbidden)
                    if (err.response.status === 401 || err.response.status === 403) {
                        setError('Phiên làm việc đã hết hạn hoặc không có quyền truy cập. Vui lòng đăng nhập lại.');
                        // Tùy chọn: Xóa token và chuyển hướng người dùng
                        // localStorage.removeItem('token'); 
                        // navigate('/login'); 
                    } else {
                        // Xử lý các lỗi khác từ server
                        setError(`Lỗi từ server: ${err.response.data.message || 'Không thể tải lịch sử khẩn cấp. Vui lòng thử lại sau.'}`);
                    }
                } else if (err.request) {
                    // Lỗi không có phản hồi từ server (ví dụ: mạng bị ngắt)
                    setError('Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo backend đang chạy.');
                } else {
                    // Các lỗi khác
                    setError('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
                }
            } finally {
                setLoading(false);
            }
        };

        // Chỉ fetch dữ liệu nếu có token
        if (token) {
            fetchEmergencyHistory();
        } else {
            // Nếu không có token, hiển thị lỗi ngay lập tức
            setError('Không có token xác thực. Vui lòng đăng nhập.');
            setLoading(false);
        }
    }, [token]); // Dependency array: useEffect chạy lại khi token thay đổi

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải lịch sử...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    // Kiểm tra an toàn cuối cùng: đảm bảo history là một mảng trước khi cố gắng render bảng
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
                <div className={styles.tableWrapper} style={{ overflowX: 'auto' }}> {/* Thêm div để cuộn ngang trên màn hình nhỏ */}
                    <table className={styles.emergencyHistoryTable}>
                        <thead>
                            <tr>
                                <th>ID Yêu Cầu</th>
                                <th>Thời Gian Giải Quyết</th>
                                <th>Họ Tên</th>
                                <th>Nhóm Máu</th>
                                <th>Thành Phần Máu</th>
                                <th>Số Lượng</th>
                                <th>Kết Quả</th>
                                <th>Ghi Chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                // Kiểm tra item.id để đảm bảo key duy nhất và hợp lệ
                                <tr key={item.id || `row-${item.requestId}-${Math.random()}`}> 
                                    <td>{item.requestId}</td>
                                    <td>{item.resolvedAt ? new Date(item.resolvedAt).toLocaleString() : 'N/A'}</td>
                                    <td>{item.fullNameSnapshot}</td>
                                    {/* Cần ánh xạ ID thành tên nếu cần hiển thị tên thật sự */}
                                    <td>{item.bloodTypeId}</td> 
                                    <td>{item.componentId}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.result}</td>
                                    <td>{item.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmergencyTransfusionHistory;