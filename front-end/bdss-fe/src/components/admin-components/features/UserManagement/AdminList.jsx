import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
import styles from './AdminList.module.css';

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

const getRoleName = (role) => { //eslint-disable-line no-unused-vars
    switch (role) {
        case 'ADMIN': return 'Quản trị viên';
        case 'STAFF': return 'Nhân viên';
        case 'MEMBER': return 'Thành viên';
        default: return 'Không xác định';
    }
};

const getAccountStatusName = (status) => {
    switch (status) {
        case 'ACTIVE': return 'Hoạt động';
        case 'INACTIVE': return 'Không hoạt động';
        default: return 'Không xác định';
    }
};

const AdminList = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchAdminAccounts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(`/account/list-account/ADMIN`);
            setAccounts(response.data);
            console.log('Đã tải danh sách tài khoản ADMIN:', response.data);
        } catch (err) {
            console.error('Lỗi khi tải danh sách tài khoản ADMIN:', err);
            const errorMessage = err.response?.data?.message || 'Không thể tải danh sách tài khoản Quản trị viên. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(`Lỗi: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdminAccounts();
    }, [fetchAdminAccounts]);

    const handleToggleAccountStatus = async (accountId, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        const confirmMessage = newStatus === 'INACTIVE'
            ? `Bạn có chắc chắn muốn vô hiệu hóa tài khoản này (ID: ${accountId}) không?`
            : `Bạn có chắc chắn muốn kích hoạt lại tài khoản này (ID: ${accountId}) không?`;

        if (window.confirm(confirmMessage)) {
            try {
                await axiosInstance.put(`/account/admin/delete/${accountId}/${newStatus}`);
                
                const successMessage = newStatus === 'INACTIVE'
                    ? 'Tài khoản đã được vô hiệu hóa thành công!'
                    : 'Tài khoản đã được kích hoạt lại thành công!';
                toast.success(successMessage);
                fetchAdminAccounts();
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
        return <div className={styles.loadingMessage}>Đang tải danh sách tài khoản Quản trị viên...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.adminListContainer}>
            <h2 className={styles.pageTitle}>Quản Lý Tài Khoản Quản trị viên</h2>

            <div className={styles.controls}>
                <button 
                    className={`${styles.button} ${styles.createButton}`}
                    onClick={handleCreateAccount}
                >
                    Tạo tài khoản mới
                </button>
            </div>

            <div className={styles.tableWrapper}>
                {accounts.length === 0 ? (
                    <p className={styles.noAccountsMessage}>Không có tài khoản Quản trị viên nào trong hệ thống.</p>
                ) : (
                    <table className={styles.adminTable}>
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
                            {accounts.map((account) => (
                                <tr key={account.id}>
                                    <td>{account.id}</td>
                                    <td>{account.fullName || 'N/A'}</td>
                                    <td>{account.email || 'N/A'}</td>
                                    <td>{account.phone || 'N/A'}</td>
                                    <td>{account.gender === 'MALE' ? 'Nam' : (account.gender === 'FEMALE' ? 'Nữ' : 'Khác')}</td>
                                    <td>{formatDateTime(account.dateOfBirth) || 'N/A'}</td>
                                    <td>
                                        {account.bloodType
                                            ? `${account.bloodType.type}${account.bloodType.rhFactor}`
                                            : 'N/A'}
                                    </td>
                                    <td>{account.address || 'N/A'}</td>
                                    <td>{formatDateTime(account.createAt) || 'N/A'}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[account.status ? account.status.toLowerCase() : '']}`}>
                                            {getAccountStatusName(account.status)}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        <button
                                            className={`${styles.button} ${account.status === 'ACTIVE' ? styles.deleteButton : styles.activateButton}`}
                                            onClick={() => handleToggleAccountStatus(account.id, account.status)}
                                        >
                                            {account.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
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

export default AdminList;
