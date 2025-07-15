import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../../configs/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import styles from './TransfusionProcess.module.css'; // Đảm bảo tạo file CSS này

const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    try {
        const date = new Date(isoString);
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        };
        return date.toLocaleString("vi-VN", options);
    } catch (e) {
        console.error("Chuỗi ngày không hợp lệ:", isoString, e);
        return "Ngày không hợp lệ";
    }
};

const TransfusionProcessList = () => {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransfusionProcesses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Cập nhật API endpoint theo controller mới: /api/transfusion-process/processes
            const response = await axiosInstance.get('/transfusion-process/processes');
            setProcesses(response.data);
            console.log("Đã lấy danh sách quá trình truyền máu:", response.data);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách quá trình truyền máu:', err);
            setError('Không thể tải danh sách quá trình truyền máu. Vui lòng thử lại sau.');
            toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransfusionProcesses();
    }, [fetchTransfusionProcesses]);

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải danh sách quá trình truyền máu...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (processes.length === 0) {
        return <div className={styles.noDataMessage}>Chưa có quá trình truyền máu nào được ghi nhận.</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
                Danh Sách Quá Trình Truyền Máu
            </h2>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID Yêu Cầu</th>
                            <th>Bắt đầu</th>
                            <th>Kết thúc</th>
                            <th>Trạng thái</th>
                            <th>Kiểm tra sức khỏe đạt</th>
                            <th>Huyết áp</th>
                            <th>Nhịp tim</th>
                            <th>Nhiệt độ</th>
                            <th>Ghi chú nhân viên</th>
                            <th>Ghi chú dị ứng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processes.map((process) => (
                            <tr key={process.requestId}> {/* Sử dụng requestId làm key */}
                                <td data-label="ID Yêu Cầu">{process.requestId}</td>
                                <td data-label="Bắt đầu">{formatDateTime(process.transfusionStartedAt)}</td>
                                <td data-label="Kết thúc">{formatDateTime(process.transfusionCompletedAt)}</td>
                                <td data-label="Trạng thái">
                                    <span
                                        className={`${styles.statusBadge} ${
                                            styles[process.status?.toLowerCase()?.replace(/_/g, '-')]
                                        }`}
                                    >
                                        {process.status === "IN_PROGRESS" ? "Đang tiến hành"
                                        : process.status === "COMPLETED" ? "Hoàn thành"
                                        : process.status === "INTERRUPTED" ? "Gián đoạn"
                                        : process.status || "N/A"}
                                    </span>
                                </td>
                                <td data-label="Kiểm tra SK đạt">{process.healthCheckPassed ? "Có" : "Không"}</td>
                                <td data-label="Huyết áp">{process.bloodPressure || "N/A"}</td>
                                <td data-label="Nhịp tim">{process.heartRate || "N/A"}</td>
                                <td data-label="Nhiệt độ">{process.temperature ? `${process.temperature}°C` : "N/A"}</td>
                                <td data-label="Ghi chú NV">{process.staffNotes || "N/A"}</td>
                                <td data-label="Ghi chú dị ứng">{process.allergyNotes || "N/A"}</td>
                                <td data-label="Hành động">
                                    {/* Link đến trang chi tiết yêu cầu truyền máu, nơi có thể chỉnh sửa quá trình này */}
                                    <Link to={`/staff-dashboard/transfusion-requests-management/${process.requestId}`} className={styles.viewButton}>
                                        Xem Yêu Cầu
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
};

export default TransfusionProcessList;