import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../configs/axios';
import styles from './MemberProfile.module.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get('/account/view-profile');
                setProfile(response.data);
                console.log("Profile của người dùng:", response.data);
            } catch (err) {
                console.error("Lỗi khi tải profile:", err);
                const errorMessage = err.response?.data?.message || 'Không thể tải thông tin profile. Vui lòng thử lại.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải profile...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (!profile) {
        return <div className={styles.noProfileMessage}>Không tìm thấy thông tin profile.</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <h2>Thông tin cá nhân của bạn</h2>
            <div className={styles.profileDetails}>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Họ và tên:</strong> {profile.fullName}</p>
                <p><strong>Vai trò:</strong> {profile.role}</p>
                <p><strong>Giới tính:</strong> {profile.gender === 'MALE' ? 'Nam' : (profile.gender === 'FEMALE' ? 'Nữ' : 'Khác')}</p>
                <p><strong>Nhóm máu:</strong> {profile.bloodType ? `${profile.bloodType.type}${profile.bloodType.rhFactor}` : 'Chưa cập nhật'}</p>
                <p><strong>Ngày sinh:</strong> {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                <p><strong>Số điện thoại:</strong> {profile.phone || 'Chưa cập nhật'}</p>
                <p><strong>Địa chỉ:</strong> {profile.address || 'Chưa cập nhật'}</p>
                <p><strong>CCCD:</strong> {profile.cccd || 'Chưa cập nhật'}</p>
                <p><strong>Trạng thái tài khoản:</strong> {profile.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}</p>
                <p><strong>Trạng thái hiến máu:</strong> {profile.statusDonation === 'AVAILABLE' ? 'Sẵn sàng hiến' : 'Không sẵn sàng'}</p>
                <p><strong>Ngày tạo tài khoản:</strong> {profile.createAt ? new Date(profile.createAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
            </div>
            {/* Bạn có thể thêm nút chỉnh sửa profile ở đây nếu có API PUT /account/member/profile */}
            {/* <button className={styles.editButton}>Chỉnh sửa Profile</button> */}
        </div>
    );
};

export default Profile;