import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './EmergencyTransfusionProcess.module.css'; // Import CSS Modules

// Enum options (should ideally come from a shared constants file or API if dynamic)
const CROSSMATCH_OPTIONS = [
    { value: 'PENDING', label: 'Đang chờ kết quả' },
    { value: 'COMPATIBLE', label: 'Tương thích' },
    { value: 'INCOMPATIBLE', label: 'Không tương thích' }
];

const EMERGENCY_STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Đang chờ xử lý' },
    { value: 'APPROVED', label: 'Đã duyệt' },
    { value: 'REJECTED', label: 'Đã từ chối' },
    { value: 'IN_PROGRESS', label: 'Đang tiến hành' },
    { value: 'COMPLETED', label: 'Đã hoàn thành' }
];


const EmergencyProcessDisplayList = () => {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    useEffect(() => {
        const fetchEmergencyProcesses = async () => {
            setLoading(true);
            setError(null); // Reset error state on new fetch
            try {
                // Gọi API backend của bạn
                const response = await axios.get('http://localhost:8080/api/emergency-process', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Thêm token vào header
                    },
                });

                // Kiểm tra xem dữ liệu trả về có phải là mảng không
                if (Array.isArray(response.data)) {
                    setProcesses(response.data);
                } else {
                    console.error("Lỗi: Dữ liệu nhận được từ API không phải là một mảng:", response.data);
                    setError("Dữ liệu quy trình khẩn cấp nhận được không hợp lệ. Vui lòng liên hệ quản trị viên.");
                }
            } catch (err) {
                console.error('Lỗi khi tải quy trình khẩn cấp:', err);
                if (err.response) {
                    // Lỗi từ server (ví dụ: 401 Unauthorized, 403 Forbidden, 404 Not Found)
                    if (err.response.status === 401 || err.response.status === 403) {
                        setError('Phiên làm việc đã hết hạn hoặc không có quyền truy cập. Vui lòng đăng nhập lại.');
                    } else {
                        setError(`Lỗi từ server: ${err.response.data.message || 'Không thể tải danh sách quy trình khẩn cấp. Vui lòng thử lại sau.'}`);
                    }
                } else if (err.request) {
                    // Không có phản hồi từ server (ví dụ: server không chạy, lỗi mạng)
                    setError('Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo backend đang chạy.');
                } else {
                    // Lỗi khác
                    setError('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
                }
            } finally {
                setLoading(false);
            }
        };

        // Chỉ fetch dữ liệu nếu có token
        if (token) {
            fetchEmergencyProcesses();
        } else {
            setError('Không có token xác thực. Vui lòng đăng nhập.');
            setLoading(false);
        }
    }, [token]); // Dependency array: fetch lại khi token thay đổi

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải danh sách quy trình khẩn cấp...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (!Array.isArray(processes)) {
        // Fallback in case processes state somehow gets corrupted
        return <div className={styles.errorMessage}>Đã xảy ra lỗi nội bộ với dữ liệu. Vui lòng thử lại hoặc liên hệ hỗ trợ.</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.listTitle}>Danh Sách Quy Trình Khẩn Cấp</h2>
            {processes.length === 0 ? (
                <p className={styles.noDataMessage}>Không có quy trình khẩn cấp nào trong danh sách.</p>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ID Yêu cầu</th>
                                <th>Trạng thái</th>
                                <th>Triệu chứng</th>
                                <th>Mức Hemoglobin</th>
                                <th>Xác nhận nhóm máu</th>
                                <th>Số lượng (ml)</th>
                                <th>Kết quả Crossmatch</th>
                                <th>Thành phần cần</th>
                                <th>Lý do truyền máu</th>
                                <th>Huyết áp</th>
                                <th>Mạch</th>
                                <th>Nhịp thở</th>
                                <th>Nhiệt độ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processes.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id || 'N/A'}</td>
                                    <td>{item.idRequest || 'N/A'}</td>
                                    <td>{EMERGENCY_STATUS_OPTIONS.find(opt => opt.value === item.status)?.label || item.status || 'N/A'}</td>
                                    <td>{item.symptoms || 'N/A'}</td>
                                    <td>{item.hemoglobinLevel !== null ? `${item.hemoglobinLevel} g/dL` : 'N/A'}</td>
                                    <td>{item.bloodGroupConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</td>
                                    <td>{item.quantity !== null ? `${item.quantity} ml` : 'N/A'}</td>
                                    <td>{CROSSMATCH_OPTIONS.find(opt => opt.value === item.crossmatchResult)?.label || item.crossmatchResult || 'N/A'}</td>
                                    <td>{item.needComponent || 'N/A'}</td>
                                    <td>{item.reasonForTransfusion || 'N/A'}</td>
                                    <td>{item.bloodPressure || 'N/A'}</td>
                                    <td>{item.pulse !== null ? item.pulse : 'N/A'}</td>
                                    <td>{item.respiratoryRate !== null ? item.respiratoryRate : 'N/A'}</td>
                                    <td>{item.temperature !== null ? `${item.temperature}°C` : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmergencyProcessDisplayList;