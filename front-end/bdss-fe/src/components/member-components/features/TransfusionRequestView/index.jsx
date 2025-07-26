import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios'; // Adjust path if necessary
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './index.module.css'; // New CSS module

const ViewTransfusionRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper to get auth data (assuming 'MEMBER' role is still checked on frontend)
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

        // Although the backend has @PreAuthorize, it's good to have a client-side check for UX
        // However, given it's a "view" for members, we might want to allow it for all authenticated users
        // or specifically enforce 'MEMBER' if only members should see ALL requests, not just their own.
        // Based on @PreAuthorize("hasRole('MEMBER')"), we'll keep this check.
        if (!token || userRole?.toUpperCase() !== 'MEMBER') {
            toast.error("Bạn không có quyền truy cập chức năng này. Vui lòng đăng nhập với vai trò thành viên.");
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get('/transfusion-requests/view');
            setRequests(response.data);
            if (response.data.length === 0) {
                toast.info("Chưa có yêu cầu truyền máu nào được tạo.");
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

    return (
        <div className={styles.container}>
            <ToastContainer />
            <h2 className={styles.title}>Danh Sách Yêu Cầu Truyền Máu</h2>

            <div className={styles.section}>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {loading && <p>Đang tải danh sách yêu cầu...</p>}
                {!loading && requests.length === 0 && !error && (
                    <p>Hiện không có yêu cầu truyền máu nào.</p>
                )}
                <div className={styles.requestList}>
                    {requests.map((request, index) => (
                        // Using index as key is acceptable for a read-only list where items don't change order or get deleted frequently.
                        // Ideally, if your TransfusionRequestDTO had an 'id', use request.id as the key.
                        <div key={index} className={styles.requestCard}>
                            <h4>{request.recipientName}</h4>
                            <p><strong>Số điện thoại:</strong> {request.recipientPhone}</p>
                            <p><strong>Mô tả:</strong> {request.description}</p>
                            <p><strong>Địa chỉ:</strong> {request.address || 'Chưa cập nhật'}</p>
                            {/* Assuming your backend might add more fields later (like status, requestTime, createrName)
                                you would add them here if the actual API response includes them.
                                Based on the provided DTO, these are the only fields available. */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewTransfusionRequests;