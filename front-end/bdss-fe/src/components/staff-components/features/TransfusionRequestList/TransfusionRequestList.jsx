// TransfusionRequestListForStaff.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios'; // Adjust path if necessary
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './TransfusionRequestList.module.css'; // New CSS module

const TransfusionRequestListForStaff = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAuthData = () => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        let userRole = null;

        if (userString) {
            try {
                const userObj = JSON.parse(userString);
                if (userObj && userObj.role) {
                    userRole = userObj.role;
                    if (Array.isArray(userRole)) {
                        userRole = userRole[0];
                    }
                }
            } catch (e) {
                console.error("Lỗi khi giải mã đối tượng 'user' từ localStorage:", e);
                userRole = null;
            }
        }
        return { token, userRole };
    };

    const fetchAllRequests = async () => {
        setLoading(true);
        setError(null);
        const { token, userRole } = getAuthData();

        if (!token || (!userRole || (userRole.toUpperCase() !== 'STAFF' && userRole.toUpperCase() !== 'ADMIN'))) {
            toast.error("Bạn không có quyền truy cập chức năng này. Vui lòng đăng nhập với vai trò STAFF hoặc ADMIN.");
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get('/transfusion-requests/all-list');
            console.log("Dữ liệu yêu cầu nhận được:", response.data); // Log the received data
            setRequests(response.data);
            if (response.data.length === 0) {
                toast.info("Hiện không có yêu cầu truyền máu nào trong hệ thống.");
            }
        } catch (err) {
            console.error("Lỗi khi tải danh sách yêu cầu truyền máu:", err);
            setError("Không thể tải danh sách yêu cầu truyền máu. Vui lòng thử lại.");
            toast.error(err.response?.data?.message || "Lỗi khi tải danh sách yêu cầu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllRequests();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa yêu cầu này không? Hành động này không thể hoàn tác.')) {
            return;
        }

        setLoading(true);
        setError(null);
        const { token, userRole } = getAuthData();

        if (!token || (!userRole || (userRole.toUpperCase() !== 'STAFF' && userRole.toUpperCase() !== 'MEMBER'))) {
            toast.error("Bạn không có quyền xóa yêu cầu này. Vui lòng đăng nhập với vai trò hợp lệ.");
            setLoading(false);
            return;
        }

        try {
            await axiosInstance.delete(`/transfusion-requests/${id}`);
            toast.success('Yêu cầu đã được xóa thành công!');
            fetchAllRequests(); // Re-fetch the list to update the UI
        } catch (err) {
            console.error("Lỗi khi xóa yêu cầu truyền máu:", err);
            setError("Không thể xóa yêu cầu. Vui lòng thử lại.");
            toast.error(err.response?.data?.message || "Lỗi khi xóa yêu cầu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <h2 className={styles.title}>Danh Sách Tất Cả Yêu Cầu Truyền Máu</h2>

            <div className={styles.section}>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {loading && <p>Đang tải danh sách yêu cầu...</p>}
                {!loading && requests.length === 0 && !error && (
                    <p>Hiện không có yêu cầu truyền máu nào trong hệ thống.</p>
                )}
                <div className={styles.requestList}>
                    {requests.map((request) => {
                        // Log each request object to inspect its structure, especially 'id'
                        console.log("Đang render yêu cầu:", request);
                        return (
                            // Sử dụng id làm key là tốt nhất. Nếu id không có, fallback về requestedAt (ít lý tưởng hơn)
                            <div key={request.id || request.requestedAt} className={styles.requestCard}>
                                <h4>{request.recipientName}</h4>
                                <p><strong>Người tạo:</strong> {request.createrName || 'N/A'}</p>
                                <p><strong>Số điện thoại:</strong> {request.recipientPhone}</p>
                                <p><strong>Mô tả:</strong> {request.description}</p>
                                <p><strong>Địa chỉ:</strong> {request.address || 'Chưa cập nhật'}</p>
                                <p>
                                    <strong>Ngày yêu cầu:</strong>
                                    {request.requestedAt ? (
                                        new Date(request.requestedAt).toLocaleDateString('vi-VN')
                                    ) : (
                                        <span style={{ color: 'orange' }}>Không có ngày yêu cầu</span>
                                    )}
                                </p>
                                <p>
                                    <strong>Trạng thái:</strong>
                                    {request.status === 'ACTIVE' ? (
                                        <span style={{ color: 'green', fontWeight: 'bold' }}> Hoạt động</span>
                                    ) : request.status === 'INACTIVE' ? (
                                        <span style={{ color: 'red', fontWeight: 'bold' }}> Đã vô hiệu hóa</span>
                                    ) : (
                                        request.status || 'Không xác định'
                                    )}
                                </p>
                                <div className={styles.cardActions}>
                                    {/* Hiển thị nút xóa chỉ khi request.id tồn tại và có giá trị */}
                                    {request.id && (
                                        <button
                                            className={styles.buttonDelete}
                                            onClick={() => handleDelete(request.id)}
                                            disabled={loading}
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TransfusionRequestListForStaff;