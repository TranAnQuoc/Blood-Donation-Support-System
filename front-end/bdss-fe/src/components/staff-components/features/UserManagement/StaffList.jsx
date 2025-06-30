import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
import styles from './StaffList.module.css';

// Hàm trợ giúp để định dạng ngày/giờ
const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        if (isoString.includes('T')) {
            const date = new Date(isoString);
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            return date.toLocaleString('vi-VN', options);
        } else {
            const [year, month, day] = isoString.split('-');
            return `${day}/${month}/${year}`;
        }
    } catch (e) {
        console.error("Chuỗi ngày/giờ không hợp lệ:", isoString, e);
        return 'Ngày/giờ không hợp lệ';
    }
};

const StaffList = () => {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Hàm để lấy danh sách nhân viên
    const fetchStaffs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Sử dụng API list-account với role là 'STAFF'
            const response = await axiosInstance.get('/account/list-account/STAFF');
            setStaffs(response.data);
            console.log("Đã tải danh sách nhân viên:", response.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách nhân viên:", err);
            setError('Không thể tải danh sách nhân viên. Vui lòng thử lại.');
            toast.error('Lỗi: Không thể tải danh sách nhân viên.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStaffs();
    }, [fetchStaffs]);

    // Xử lý khi bấm nút "Xem chi tiết"
    const handleViewDetails = (staffId) => {
        // Điều hướng đến trang chi tiết nhân viên
        // Bạn cần tạo component StaffDetail.jsx và định nghĩa route tương ứng
        navigate(`/staff-dashboard/staff-details/${staffId}`);
    };

    // Xử lý khi bấm nút "Xóa" (soft delete)
    const handleDelete = async (staffId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa (vô hiệu hóa) nhân viên này không?')) {
            try {
                // Sử dụng API PUT /api/account/staff/delete/{id}/{status}
                // Giả định 'INACTIVE' là trạng thái để soft delete
                const statusToDelete = 'INACTIVE'; 
                await axiosInstance.put(`/account/staff/delete/${staffId}/${statusToDelete}`);
                toast.success('Nhân viên đã được xóa (vô hiệu hóa) thành công!');
                fetchStaffs(); // Tải lại danh sách sau khi xóa mềm
            } catch (err) {
                console.error("Lỗi khi xóa nhân viên:", err);
                const errorMessage = err.response?.data?.message || 'Không thể xóa nhân viên. Vui lòng thử lại.';
                setError(errorMessage);
                toast.error(`Lỗi: ${errorMessage}`);
            }
        }
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải danh sách nhân viên...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.staffListContainer}>
            <h2 className={styles.pageTitle}>Quản Lý Nhân Viên</h2>
            <div className={styles.tableWrapper}>
                {staffs.length === 0 ? (
                    <p className={styles.noStaffsMessage}>Không có nhân viên nào trong hệ thống.</p>
                ) : (
                    <table className={styles.staffTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ và Tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>Vai trò</th>
                                <th>Địa chỉ</th>
                                <th>Ngày tạo</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffs.map((staff) => (
                                <tr key={staff.id}>
                                    <td>{staff.id}</td>
                                    <td>{staff.fullName || 'N/A'}</td>
                                    <td>{staff.email || 'N/A'}</td>
                                    <td>{staff.phone || 'N/A'}</td>
                                    <td>{staff.gender === 'MALE' ? 'Nam' : (staff.gender === 'FEMALE' ? 'Nữ' : 'Khác')}</td>
                                    <td>{formatDateTime(staff.dateOfBirth) || 'N/A'}</td>
                                    <td>{staff.role || 'N/A'}</td>
                                    <td>{staff.address || 'N/A'}</td>
                                    <td>{formatDateTime(staff.createAt) || 'N/A'}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[staff.status ? staff.status.toLowerCase() : '']}`}>
                                            {staff.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        <button
                                            className={`${styles.button} ${styles.viewButton}`}
                                            onClick={() => handleViewDetails(staff.id)}
                                        >
                                            Xem chi tiết
                                        </button>
                                        <button
                                            className={`${styles.button} ${styles.deleteButton}`}
                                            onClick={() => handleDelete(staff.id)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StaffList;
