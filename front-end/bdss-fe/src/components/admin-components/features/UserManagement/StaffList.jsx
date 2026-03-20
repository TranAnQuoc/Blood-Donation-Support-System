import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
import styles from './StaffList.module.css'; 

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

    const fetchStaffs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
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

    // const handleViewDetails = (staffId) => {
    //     navigate(`/admin-dashboard/staff-details/${staffId}`);
    // };

    const handleToggleAccountStatus = async (staffId, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        const confirmMessage = newStatus === 'INACTIVE'
            ? `Bạn có chắc chắn muốn vô hiệu hóa tài khoản này (ID: ${staffId}) không?`
            : `Bạn có chắc chắn muốn kích hoạt lại tài khoản này (ID: ${staffId}) không?`;

        if (window.confirm(confirmMessage)) {
            try {
                await axiosInstance.put(`/account/admin/delete/${staffId}/${newStatus}`);
                
                const successMessage = newStatus === 'INACTIVE'
                    ? 'Tài khoản đã được vô hiệu hóa thành công!'
                    : 'Tài khoản đã được kích hoạt lại thành công!';
                toast.success(successMessage);
                fetchStaffs(); 
            } catch (err) {
                console.error('Lỗi khi cập nhật trạng thái tài khoản:', err);
                const errorMessage = err.response?.data?.message || 'Không thể cập nhật trạng thái tài khoản. Vui lòng thử lại.';
                setError(errorMessage);
                toast.error(`Lỗi: ${errorMessage}`);
            }
        }
    };

    const handleCreateAccount = () => {
        navigate('/admin-dashboard/user-management/create-account');
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải danh sách nhân viên...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.staffListContainer}>
            <h2 className={styles.pageTitle}>Quản Lý Tài Khoản Nhân viên</h2>

            <div className={styles.controls}>
                <button 
                    className={`${styles.button} ${styles.createButton}`}
                    onClick={handleCreateAccount}
                >
                    Tạo tài khoản mới
                </button>
            </div>

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
                                <th>Nhóm máu</th>
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
                                    <td>
                                        {staff.bloodType
                                            ? `${staff.bloodType.type}${staff.bloodType.rhFactor}`
                                            : 'N/A'}
                                    </td>
                                    <td>{staff.address || 'N/A'}</td>
                                    <td>{formatDateTime(staff.createAt) || 'N/A'}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[staff.status ? staff.status.toLowerCase() : '']}`}>
                                            {staff.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        {/* <button
                                            className={`${styles.button} ${styles.viewButton}`}
                                            onClick={() => handleViewDetails(staff.id)}
                                        >
                                            Xem chi tiết
                                        </button> */}
                                        <button
                                            className={`${styles.button} ${staff.status === 'ACTIVE' ? styles.deleteButton : styles.activateButton}`}
                                            onClick={() => handleToggleAccountStatus(staff.id, staff.status)}
                                        >
                                            {staff.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
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
