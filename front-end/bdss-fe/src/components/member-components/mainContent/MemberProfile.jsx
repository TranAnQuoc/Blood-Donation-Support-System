import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../configs/axios';
import styles from './MemberProfile.module.css';

const MemberProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    const genderMap = {
        'MALE' : 'Nam',
        'FEMALE' : 'Nữ',
        'OTHER' : 'Khác'
    };

    const statusDonationMap = {
        'AVAILABLE' : 'Sẵn sàng hiến',
        'INACTIVE' : 'Không sẵn sàng'
    };

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/account/view-profile');
            setProfile(response.data);
            let formattedDateOfBirth = '';
            if (response.data.dateOfBirth) {
                const dateObj = new Date(response.data.dateOfBirth);
                if (!isNaN(dateObj.getTime())) {
                    formattedDateOfBirth = dateObj.toISOString().split('T')[0];
                } else {
                    console.warn("Ngày sinh từ API không hợp lệ:", response.data.dateOfBirth);
                }
            }
                
            setEditData({
                fullName: response.data.fullName || '',
                gender: response.data.gender || '',
                dateOfBirth: formattedDateOfBirth || '',
                phone: response.data.phone || '',
                address: response.data.address || '',
                bloodTypeId: response.data.bloodTypeId || null,
                statusDonation: response.data.statusDonation || '',
            })
            console.log("Profile của người dùng:", response.data);
        } catch (err) {
            console.error("Lỗi khi tải profile:", err);
            const errorMessage = err.response?.data?.message || 'Không thể tải thông tin profile. Vui lòng thử lại.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            const dataToSend = {
                fullName: editData.fullName,
                gender: editData.gender,
                dateOfBirth: editData.dateOfBirth,
                phone: editData.phone,
                address: editData.address,
                bloodTypeId: editData.bloodTypeId ? parseInt(editData.bloodTypeId, 10) : null,
                statusDonation: editData.statusDonation,
            }
            await axiosInstance.put('/account/member/profile', dataToSend);

            alert('Cập nhật thông tin thành công!');
            setIsEditing(false);
            await fetchProfile();
        } catch (err) {
            console.error("Lỗi khi cập nhật profile:", err);
            const errorMessage = err.response?.data?.message || 'Không thể cập nhật thông tin profile. Vui lòng thử lại.';
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        const formattedDateOfBirth = profile.dateOfBirth
        ? new Date(profile.dateOfBirth).toISOString().split('T')[0] 
            : '';
        setEditData({
            fullName: profile.fullName || '',
            gender: profile.gender || '',
            dateOfBirth: formattedDateOfBirth,
            phone: profile.phone || '',
            address: profile.address || '',
            bloodTypeId: profile.bloodTypeId || null,
            statusDonation: profile.statusDonation || ''
        });
    };

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
            {!isEditing ? (
                <div className={styles.profileDetails}>
                    <p><strong>Email:</strong> {profile.email || 'Chưa cập nhật'}</p>
                    <p><strong>Họ và tên:</strong> {profile.fullName || 'Chưa cập nhật'}</p>
                    {/* <p><strong>Vai trò:</strong> {profile.role || 'Chưa cập nhật'}</p> */}
                    <p><strong>Giới tính:</strong> {genderMap[profile.gender] || 'Chưa cập nhật'}</p>
                    <p><strong>Nhóm máu:</strong> {profile.bloodType ? `${profile.bloodType.type}${profile.bloodType.rhFactor}` : 'Chưa cập nhật'}</p>
                    <p><strong>Ngày sinh:</strong> {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                    <p><strong>Số điện thoại:</strong> {profile.phone || 'Chưa cập nhật'}</p>
                    <p><strong>Địa chỉ:</strong> {profile.address || 'Chưa cập nhật'}</p>
                    <p><strong>CCCD:</strong> {profile.cccd || 'Chưa cập nhật'}</p>
                    <p><strong>Trạng thái tài khoản:</strong> {profile.status ? (profile.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động') : 'Chưa cập nhật'}</p>
                    <p><strong>Trạng thái hiến máu:</strong> {statusDonationMap[profile.statusDonation] || 'Chưa cập nhật'}</p>
                    <p><strong>Ngày tạo tài khoản:</strong> {profile.createAt ? new Date(profile.createAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    
                    <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                        Chỉnh sửa Profile
                    </button>
                </div>
            ) : (
                <div className={styles.editForm}>
                    <div className={styles.formGroup}>
                        <label>Họ và tên:</label>
                        <input
                            type="text"
                            name="fullName"
                            value={editData.fullName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Giới tính:</label>
                        <select name="gender" value={editData.gender} onChange={handleInputChange}>
                            <option value="">Chọn giới tính</option>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Ngày sinh:</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={editData.dateOfBirth}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Số điện thoại:</label>
                        <input
                            type="text"
                            name="phone"
                            value={editData.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Địa chỉ:</label>
                        <input
                            type="text"
                            name="address"
                            value={editData.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>ID Nhóm máu:</label> {/* Tạm thời dùng ID, lý tưởng là dropdown */}
                        <input
                            type="number"
                            name="bloodTypeId"
                            value={editData.bloodTypeId || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Trạng thái hiến máu:</label>
                        <select name="statusDonation" value={editData.statusDonation} onChange={handleInputChange}>
                            <option value="">Chọn trạng thái</option>
                            <option value="AVAILABLE">Sẵn sàng hiến</option>
                            <option value="INACTIVE">Không sẵn sàng</option>
                        </select>
                    </div>

                    <div className={styles.formActions}>
                        <button className={styles.saveButton} onClick={handleSave}>Lưu thay đổi</button>
                        <button className={styles.cancelButton} onClick={handleCancel}>Hủy</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberProfile;