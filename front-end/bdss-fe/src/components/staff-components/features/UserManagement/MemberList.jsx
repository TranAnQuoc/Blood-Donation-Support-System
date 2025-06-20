// src/components/staff-components/features/MemberList/MemberList.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios'; // CẬP NHẬT ĐƯỜNG DẪN TƯƠNG ĐỐI
import styles from './MemberList.module.css'; // Đổi tên file CSS

const MemberList = () => { // Đổi tên component cho phù hợp
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            setError(null);
            try {
                // Đảm bảo URL này khớp với @RequestMapping trong backend (ví dụ: "/api/account/list-account/member")
                const response = await axiosInstance.get('/account/list-account/member');
                setMembers(response.data);
                console.log("Danh sách thành viên:", response.data);
            } catch (err) {
                console.error("Lỗi khi tải danh sách thành viên:", err);
                const errorMessage = err.response?.data?.message || 'Không thể tải danh sách thành viên. Vui lòng thử lại.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải danh sách thành viên...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (members.length === 0) {
        return <div className={styles.noMembersMessage}>Không có thành viên nào trong hệ thống.</div>;
    }

    return (
        <div className={styles.memberListContainer}>
            <h2>Danh sách Thành viên</h2>
            <table className={styles.memberTable}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Họ và tên</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Trạng thái hiến máu</th>
                        {/* Thêm các cột khác nếu cần */}
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.id}>
                            <td>{member.email}</td>
                            <td>{member.fullName}</td>
                            <td>{member.role}</td>
                            <td>{member.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}</td>
                            <td>{member.statusDonation === 'AVAILABLE' ? 'Sẵn sàng hiến' : 'Không sẵn sàng'}</td>
                            {/* Render các dữ liệu khác */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MemberList;