import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './TransfusionRequest.module.css';

const TransfusionRequestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newRequest, setNewRequest] = useState({
        recipientName: '',
        recipientPhone: '',
        description: '',
        address: ''
    });
    const [editingRequestId, setEditingRequestId] = useState(null);
    const [editData, setEditData] = useState({}); // <--- CORRECTED LINE HERE!

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

    const fetchMyRequests = async () => {
        setLoading(true);
        setError(null);
        const { token, userRole } = getAuthData();

        if (!token || userRole?.toUpperCase() !== 'MEMBER') {
            toast.error("Bạn không có quyền truy cập chức năng này. Vui lòng đăng nhập với vai trò thành viên.");
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get('/transfusion-requests/my');
            setRequests(response.data);
            if (response.data.length === 0) {
                toast.info("Bạn chưa có yêu cầu truyền máu nào.");
            }
        } catch (err) {
            console.error("Lỗi khi tải yêu cầu truyền máu:", err);
            setError("Không thể tải yêu cầu truyền máu. Vui lòng thử lại.");
            toast.error(err.response?.data?.message || "Lỗi khi tải yêu cầu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const handleNewRequestChange = (e) => {
        const { name, value } = e.target;
        setNewRequest(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { token, userRole } = getAuthData();

        if (!token || userRole?.toUpperCase() !== 'MEMBER') {
            toast.error("Bạn không có quyền tạo yêu cầu. Vui lòng đăng nhập.");
            setLoading(false);
            return;
        }

        try {
            await axiosInstance.post('/transfusion-requests', newRequest);
            toast.success('Yêu cầu truyền máu đã được tạo thành công!');
            setNewRequest({ recipientName: '', recipientPhone: '', description: '', address: '' });
            fetchMyRequests();
        } catch (err) {
            console.error("Lỗi khi tạo yêu cầu truyền máu:", err);
            setError("Không thể tạo yêu cầu. Vui lòng kiểm tra lại thông tin.");
            toast.error(err.response?.data?.message || "Lỗi khi tạo yêu cầu.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (request) => {
        console.log("Editing request:", request);
        setEditingRequestId(request.id); // Assuming 'id' from backend
        setEditData({ ...request });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (id) => {
        setLoading(true);
        setError(null);
        const { token, userRole } = getAuthData();

        if (!token || userRole?.toUpperCase() !== 'MEMBER') {
            toast.error("Bạn không có quyền cập nhật yêu cầu. Vui lòng đăng nhập.");
            setLoading(false);
            return;
        }

        try {
            const updateDto = {
                recipientName: editData.recipientName,
                recipientPhone: editData.recipientPhone,
                description: editData.description,
                address: editData.address
            };
            await axiosInstance.put(`/transfusion-requests/${id}`, updateDto);
            toast.success('Yêu cầu đã được cập nhật thành công!');
            setEditingRequestId(null);
            fetchMyRequests();
        } catch (err) {
            console.error("Lỗi khi cập nhật yêu cầu truyền máu:", err);
            setError("Không thể cập nhật yêu cầu. Vui lòng thử lại.");
            toast.error(err.response?.data?.message || "Lỗi khi cập nhật yêu cầu.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingRequestId(null);
        setEditData({});
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn vô hiệu hóa yêu cầu này không?')) {
            return;
        }
        setLoading(true);
        setError(null);
        const { token, userRole } = getAuthData();

        if (!token || userRole?.toUpperCase() !== 'MEMBER') {
            toast.error("Bạn không có quyền vô hiệu hóa yêu cầu. Vui lòng đăng nhập.");
            setLoading(false);
            return;
        }

        try {
            await axiosInstance.put(`/transfusion-requests/${id}/delete`);
            toast.success('Yêu cầu đã được vô hiệu hóa thành công!');
            fetchMyRequests();
        } catch (err) {
            console.error("Lỗi khi vô hiệu hóa yêu cầu truyền máu:", err);
            setError("Không thể vô hiệu hóa yêu cầu. Vui lòng thử lại.");
            toast.error(err.response?.data?.message || "Lỗi khi vô hiệu hóa yêu cầu.");
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn khôi phục yêu cầu này không?')) {
            return;
        }
        setLoading(true);
        setError(null);
        const { token, userRole } = getAuthData();

        if (!token || userRole?.toUpperCase() !== 'MEMBER') {
            toast.error("Bạn không có quyền khôi phục yêu cầu. Vui lòng đăng nhập.");
            setLoading(false);
            return;
        }

        try {
            await axiosInstance.put(`/transfusion-requests/${id}/restore`);
            toast.success('Yêu cầu đã được khôi phục thành công!');
            fetchMyRequests();
        } catch (err) {
            console.error("Lỗi khi khôi phục yêu cầu truyền máu:", err);
            setError("Không thể khôi phục yêu cầu. Vui lòng thử lại.");
            toast.error(err.response?.data?.message || "Lỗi khi khôi phục yêu cầu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <h2 className={styles.title}>Quản Lý Yêu Cầu Truyền Máu Của Bạn</h2>

            {/* Form to create a new request */}
            <div className={styles.section}>
                <h3>Tạo Yêu Cầu Mới</h3>
                <form onSubmit={handleCreateRequest} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="newRecipientName">Tên người nhận:</label>
                        <input
                            type="text"
                            id="newRecipientName"
                            name="recipientName"
                            value={newRequest.recipientName}
                            onChange={handleNewRequestChange}
                            placeholder="Tên người nhận"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="newRecipientPhone">Số điện thoại:</label>
                        <input
                            type="text"
                            id="newRecipientPhone"
                            name="recipientPhone"
                            value={newRequest.recipientPhone}
                            onChange={handleNewRequestChange}
                            placeholder="Số điện thoại (0xxxxxxxxx hoặc +84xxxxxxxxx)"
                            pattern="^(0|\+84)[0-9]{9}$"
                            title="Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 10 chữ số."
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="newDescription">Mô tả:</label>
                        <textarea
                            id="newDescription"
                            name="description"
                            value={newRequest.description}
                            onChange={handleNewRequestChange}
                            placeholder="Mô tả chi tiết yêu cầu (ví dụ: nhóm máu, tình trạng khẩn cấp...)"
                            rows="3"
                            maxLength="500"
                            required
                        ></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="newAddress">Địa chỉ:</label>
                        <input
                            type="text"
                            id="newAddress"
                            name="address"
                            value={newRequest.address}
                            onChange={handleNewRequestChange}
                            placeholder="Địa chỉ cụ thể"
                            maxLength="255"
                        />
                    </div>
                    <button type="submit" className={styles.buttonPrimary} disabled={loading}>
                        {loading ? 'Đang tạo...' : 'Tạo Yêu Cầu'}
                    </button>
                </form>
            </div>

            {/* Display existing requests */}
            <div className={styles.section}>
                <h3>Yêu Cầu Hiện Có</h3>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {loading && <p>Đang tải yêu cầu...</p>}
                {!loading && requests.length === 0 && !error && (
                    <p>Bạn chưa có yêu cầu truyền máu nào. Hãy tạo một yêu cầu mới!</p>
                )}
                <div className={styles.requestList}>
                    {requests.map(request => (
                        <div key={request.id || request.requestedAt} className={styles.requestCard}>
                            {editingRequestId === request.id ? (
                                // Edit mode
                                <div className={styles.editMode}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor={`editRecipientName-${request.id}`}>Tên người nhận:</label>
                                        <input
                                            type="text"
                                            id={`editRecipientName-${request.id}`}
                                            name="recipientName"
                                            value={editData.recipientName || ''}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor={`editRecipientPhone-${request.id}`}>Số điện thoại:</label>
                                        <input
                                            type="text"
                                            id={`editRecipientPhone-${request.id}`}
                                            name="recipientPhone"
                                            value={editData.recipientPhone || ''}
                                            onChange={handleEditChange}
                                            pattern="^(0|\+84)[0-9]{9}$"
                                            title="Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 10 chữ số."
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor={`editDescription-${request.id}`}>Mô tả:</label>
                                        <textarea
                                            id={`editDescription-${request.id}`}
                                            name="description"
                                            value={editData.description || ''}
                                            onChange={handleEditChange}
                                            rows="3"
                                            maxLength="500"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor={`editAddress-${request.id}`}>Địa chỉ:</label>
                                        <input
                                            type="text"
                                            id={`editAddress-${request.id}`}
                                            name="address"
                                            value={editData.address || ''}
                                            onChange={handleEditChange}
                                            maxLength="255"
                                        />
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button className={styles.buttonPrimary} onClick={() => handleUpdate(request.id)} disabled={loading}>
                                            Lưu
                                        </button>
                                        <button className={styles.buttonSecondary} onClick={handleCancelEdit} disabled={loading}>
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View mode
                                <div className={styles.viewMode}>
                                    <h4>{request.recipientName}</h4>
                                    <p><strong>Người tạo:</strong> {request.createrName || 'N/A'}</p>
                                    <p><strong>Số điện thoại:</strong> {request.recipientPhone}</p>
                                    <p><strong>Mô tả:</strong> {request.description}</p>
                                    <p><strong>Địa chỉ:</strong> {request.address || 'Chưa cập nhật'}</p>
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
                                    <p>
                                        <strong>Ngày yêu cầu:</strong>
                                        {request.requestedAt ? (
                                            new Date(request.requestedAt).toLocaleDateString('vi-VN')
                                        ) : (
                                            <span style={{ color: 'orange' }}>Không có ngày yêu cầu</span>
                                        )}
                                    </p>
                                    <div className={styles.cardActions}>
                                        {request.status === 'ACTIVE' && (
                                            <>
                                                <button className={styles.buttonPrimary} onClick={() => handleEditClick(request)}>
                                                    Sửa
                                                </button>
                                                <button className={styles.buttonDanger} onClick={() => handleDelete(request.id)}>
                                                    Vô hiệu hóa
                                                </button>
                                            </>
                                        )}
                                        {request.status === 'INACTIVE' && (
                                            <button className={styles.buttonSuccess} onClick={() => handleRestore(request.id)}>
                                                Khôi phục
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TransfusionRequestManagement;