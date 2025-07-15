import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
import styles from './MemberList.module.css';
import { useWebSocket } from '../../../../hooks/useWebSocket';

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

const getDonationStatusName = (statusDonation) => {
    switch (statusDonation) {
        case 'AVAILABLE': return 'Sẵn sàng hiến';
        case 'INACTIVE': return 'Không sẵn sàng';
        default: return 'Không xác định';
    }
};

const MemberList = () => {
    const { notifications } = useWebSocket();

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/account/list-account/member');
            setMembers(response.data);
            console.log("Đã tải danh sách thành viên:", response.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách thành viên:", err);
            setError('Không thể tải danh sách thành viên. Vui lòng thử lại.');
            toast.error('Lỗi: Không thể tải danh sách thành viên.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    useEffect(() => {
        if (notifications.length === 0) return;

        const latest = notifications[notifications.length - 1];
        console.log("Notification mới:", latest);

        // Nếu thông báo có chứa từ "khẩn cấp" thì gọi lại danh sách thành viên
        if (latest.message && latest.message.toLowerCase().includes("khẩn cấp")) {
            fetchMembers();
        }
    }, [notifications, fetchMembers]);


    const handleToggleStatus = async (memberId, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        const actionText = newStatus === 'ACTIVE' ? 'kích hoạt' : 'vô hiệu hóa';
        
        if (window.confirm(`Bạn có chắc chắn muốn ${actionText} thành viên này không?`)) {
            try {
                await axiosInstance.put(`/account/staff/delete/${memberId}/${newStatus}`);
                toast.success(`Thành viên đã được ${actionText} thành công!`);
                fetchMembers();
            } catch (err) {
                console.error(`Lỗi khi ${actionText} thành viên:`, err);
                const errorMessage = err.response?.data?.message || `Không thể ${actionText} thành viên. Vui lòng thử lại.`;
                setError(errorMessage);
                toast.error(`Lỗi: ${errorMessage}`);
            }
        }
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải danh sách thành viên...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.memberListContainer}>
            <h2 className={styles.pageTitle}>Quản Lý Thành Viên</h2>
            <div className={styles.tableWrapper}>
                {members.length === 0 ? (
                    <p className={styles.noMembersMessage}>Không có thành viên nào trong hệ thống.</p>
                ) : (
                    <table className={styles.memberTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ và Tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Vai trò</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>Nhóm máu</th>
                                <th>Địa chỉ</th>
                                {/* <th>Ngày đăng ký</th> */}
                                <th>Trạng thái TK</th>
                                <th>Trạng thái HM</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id}>
                                    <td>{member.id}</td>
                                    <td>{member.fullName || 'N/A'}</td>
                                    <td>{member.email || 'N/A'}</td>
                                    <td>{member.phone || 'N/A'}</td>
                                    <td>{member.role || 'N/A'}</td>
                                    <td>{member.gender === 'MALE' ? 'Nam' : (member.gender === 'FEMALE' ? 'Nữ' : 'Khác')}</td>
                                    <td>{formatDateTime(member.dateOfBirth) || 'N/A'}</td>
                                    <td>
                                        {member.bloodType
                                            ? `${member.bloodType.type}${member.bloodType.rhFactor}`
                                            : 'N/A'}
                                    </td>
                                    <td>{member.address || 'N/A'}</td>
                                    {/* <td>{formatDateTime(member.createAt) || 'N/A'}</td> */}
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[member.status ? member.status.toLowerCase() : '']}`}>
                                            {member.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[member.statusDonation ? member.statusDonation.toLowerCase() : '']}`}>
                                            {getDonationStatusName(member.statusDonation)}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        {member.status === 'ACTIVE' ? (
                                            <button
                                                className={`${styles.button} ${styles.deactivateButton}`}
                                                onClick={() => handleToggleStatus(member.id, 'ACTIVE')}
                                            >
                                                Vô hiệu hóa
                                            </button>
                                        ) : (
                                            <button
                                                className={`${styles.button} ${styles.activateButton}`}
                                                onClick={() => handleToggleStatus(member.id, 'INACTIVE')}
                                            >
                                                Kích hoạt
                                            </button>
                                        )}
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

export default MemberList;
