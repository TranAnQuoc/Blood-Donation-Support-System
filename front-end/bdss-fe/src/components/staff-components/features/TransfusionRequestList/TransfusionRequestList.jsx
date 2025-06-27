import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
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
            const response = await axiosInstance.get('/transfusions/requests');
            setRequests(response.data);
            console.log("Đã lấy yêu cầu truyền máu:", response.data);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách yêu cầu truyền máu:', err);
            setError('Không thể tải danh sách yêu cầu truyền máu. Vui lòng thử lại sau.');
            toast.error('Lỗi: Không thể tải danh sách yêu cầu truyền máu.');
        } finally {
            setLoading(false);
        }
    };

    // Bạn có thể thêm các hàm handleApprove/handleReject tương tự như DonationRequestList nếu API cho phép
    // và hiển thị các nút Duyệt/Từ chối cho yêu cầu truyền máu ở trạng thái PENDING.
    // Hiện tại API bạn cung cấp cho TransfusionRequest là PUT/DELETE theo ID, chưa có API duyệt/từ chối cụ thể.
    // Nếu có, logic sẽ tương tự DonationRequestList.

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
                            <th>Trạng thái</th>
                            <th>Yêu cầu lúc</th>
                            <th>Người duyệt</th>
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
                                <td data-label="Chẩn đoán">{request.doctorDiagnosis}</td>
                                <td data-label="Ghi chú tiền kiểm tra">{request.preCheckNotes}</td>
                                <td data-label="Trạng thái">
                                    <span
                                        className={`${styles.statusBadge} ${
                                            styles[request.status.toLowerCase()] // Chú ý: 'status' thay vì 'statusRequest'
                                        }`}
                                    >
                                        {request.status === "PENDING" ? "Đang chờ"
                                        : request.status === "APPROVED" ? "Đã duyệt"
                                        : request.status === "REJECTED" ? "Đã từ chối"
                                        : request.status === "CANCELLED" ? "Đã hủy"
                                        : request.status}
                                    </span>
                                </td>
                                <td data-label="Yêu cầu lúc">{formatDateTime(request.requestedAt)}</td>
                                <td data-label="Người duyệt">{request.approvedById || "Chưa duyệt"}</td>
                                <td data-label="Thời gian duyệt">{formatDateTime(request.approvedAt)}</td>
                                <td data-label="Cơ sở">{request.facilityId || "Chưa gán"}</td>
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
        </div>
    );
};

export default TransfusionRequestList;