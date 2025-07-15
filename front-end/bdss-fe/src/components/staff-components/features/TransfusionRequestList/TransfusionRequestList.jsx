import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import styles from './TransfusionRequestList.module.css';

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

const TransfusionRequestList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransfusionRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/transfusion-requests');
            // Lọc các yêu cầu có status là DELETED nếu bạn không muốn hiển thị chúng
            // const activeRequests = response.data.filter(req => req.status !== 'DELETED');
            // setRequests(activeRequests);
            setRequests(response.data); // Hiển thị tất cả, bao gồm cả DELETED nếu cần
            console.log("Đã lấy yêu cầu truyền máu:", response.data);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách yêu cầu truyền máu:', err);
            setError('Không thể tải danh sách yêu cầu truyền máu. Vui lòng thử lại sau.');
            toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransfusionRequests();
    }, []);

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải danh sách yêu cầu...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (requests.length === 0) {
        return <div className={styles.noRequestsMessage}>Chưa có yêu cầu truyền máu nào.</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className="text-3xl font-bold mb-8 text-center text-red-700">
                Danh Sách Yêu Cầu Truyền Máu
            </h2>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID Người Nhận</th>
                            <th>Thành phần máu</th>
                            <th>Lượng cần (ml)</th>
                            <th>Chẩn đoán</th>
                            <th>Ghi chú tiền kiểm tra</th>
                            <th>Địa chỉ</th> {/* Thêm cột Địa chỉ */}
                            <th>Trạng thái Y/C</th> {/* Đổi tên thành "Trạng thái Y/C" */}
                            <th>Trạng thái H/T</th> {/* Thêm cột "Trạng thái H/T" (hệ thống) */}
                            <th>Yêu cầu lúc</th>
                            <th>Thời gian duyệt</th>
                            <th>Cơ sở</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id}>
                                <td data-label="ID">{request.id}</td>
                                <td data-label="ID Người Nhận">{request.recipientId}</td>
                                <td data-label="Thành phần máu">{request.bloodComponentNeeded}</td>
                                <td data-label="Lượng cần (ml)">{request.quantityNeeded}</td>
                                <td data-label="Chẩn đoán">{request.doctorDiagnosis || "N/A"}</td>
                                <td data-label="Ghi chú tiền kiểm tra">{request.preCheckNotes || "N/A"}</td>
                                <td data-label="Địa chỉ">{request.address || "N/A"}</td> {/* Hiển thị Địa chỉ */}
                                <td data-label="Trạng thái Y/C">
                                    <span
                                        className={`${styles.statusBadge} ${
                                            styles[request.statusRequest?.toLowerCase()]
                                        }`}
                                    >
                                        {request.statusRequest === "PENDING" ? "Đang chờ"
                                        : request.statusRequest === "APPROVED" ? "Đã duyệt"
                                        : request.statusRequest === "REJECTED" ? "Đã từ chối"
                                        : request.statusRequest === "CANCELLED" ? "Đã hủy"
                                        : request.statusRequest || "N/A"}
                                    </span>
                                </td>
                                <td data-label="Trạng thái H/T">
                                    <span
                                        className={`${styles.statusBadge} ${
                                            styles[request.status?.toLowerCase()]
                                        }`}
                                    >
                                        {request.status === "ACTIVE" ? "Hoạt động"
                                        : request.status === "DELETED" ? "Đã xóa"
                                        : request.status || "N/A"}
                                    </span>
                                </td>
                                <td data-label="Yêu cầu lúc">{formatDateTime(request.requestedAt)}</td>
                                <td data-label="Thời gian duyệt">{formatDateTime(request.approvedAt)}</td>
                                {/* Lưu ý: DTO của bạn không có facilityId, nếu backend vẫn trả về thì giữ, nếu không thì bỏ */}
                                <td data-label="Cơ sở">{request.address || "Chưa gán"}</td>
                                <td data-label="Hành động">
                                    <Link to={`${request.id}`} className={styles.viewButton}>
                                        Xem chi tiết
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

export default TransfusionRequestList;