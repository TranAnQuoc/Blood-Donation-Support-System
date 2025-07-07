import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './AdminProfile.module.css';

const AdminProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const navigate = useNavigate();

    const genderMap = {
        'MALE': 'Nam',
        'FEMALE': 'Nữ',
        'OTHER': 'Khác'
    };

    // const statusDonationMap = {
    //     'AVAILABLE': 'Sẵn sàng hiến',
    //     'INACTIVE': 'Không sẵn sàng'
    // };

    const staticBloodTypes = [
        { id: 1, type: 'UNKNOWN', rhFactor: 'UNKNOWN', displayName: 'Không xác định' },
        { id: 2, type: 'A', rhFactor: '+', displayName: 'A+' },
        { id: 3, type: 'A', rhFactor: '-', displayName: 'A-' },
        { id: 4, type: 'B', rhFactor: '+', displayName: 'B+' },
        { id: 5, type: 'B', rhFactor: '-', displayName: 'B-' },
        { id: 6, type: 'AB', rhFactor: '+', displayName: 'AB+' },
        { id: 7, type: 'AB', rhFactor: '-', displayName: 'AB-' },
        { id: 8, type: 'O', rhFactor: '+', displayName: 'O+' },
        { id: 9, type: 'O', rhFactor: '-', displayName: 'O-' },
    ];

    const formatDisplayDate = (isoString) => {
        if (!isoString) return 'Chưa cập nhật';
        try {
            const dateObj = new Date(isoString);
            return dateObj.toLocaleDateString('vi-VN');
        } catch (e) {
            console.error("Lỗi định dạng ngày:", isoString, e);
            return 'Ngày không hợp lệ';
        }
    };

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/account/view-profile');
            const fetchedProfile = response.data;
            setProfile(fetchedProfile);

            let formattedDateOfBirth = '';
            if (fetchedProfile.dateOfBirth) {
                const dateObj = new Date(fetchedProfile.dateOfBirth);
                if (!isNaN(dateObj.getTime())) {
                    formattedDateOfBirth = dateObj.toISOString().split('T')[0];
                } else {
                    console.warn("Ngày sinh từ API không hợp lệ:", fetchedProfile.dateOfBirth);
                }
            }

            setEditData({
                fullName: fetchedProfile.fullName || '',
                gender: fetchedProfile.gender || '',
                dateOfBirth: formattedDateOfBirth,
                phone: fetchedProfile.phone || '',
                address: fetchedProfile.address || '',
                bloodTypeId: fetchedProfile.bloodType ? fetchedProfile.bloodType.id : '',
                statusDonation: fetchedProfile.statusDonation || '',
                cccd: fetchedProfile.cccd || '' 
            });
            console.log("Loaded Admin Profile:", fetchedProfile);
        } catch (err) {
            console.error("Lỗi khi tải profile Admin:", err);
            const errorMessage = err.response?.data?.message || 'Không thể tải thông tin profile. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

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
                statusDonation: editData.statusDonation || null,
                cccd: profile.cccd || null 
            };

            await axiosInstance.put('/account/manager/profile', dataToSend);

            toast.success('Cập nhật thông tin thành công!');
            setIsEditing(false);
            await fetchProfile(); 
        } catch (err) {
            console.error("Lỗi khi cập nhật profile:", err);
            const errorMessage = err.response?.data?.message || 'Không thể cập nhật thông tin profile. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage);
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
            bloodTypeId: profile.bloodType ? profile.bloodType.id : '',
            statusDonation: profile.statusDonation || '',
            cccd: profile.cccd || ''
        });
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải profile Admin...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (!profile) {
        return <div className={styles.noProfileMessage}>Không tìm thấy thông tin profile.</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <h2>Thông tin cá nhân của Admin</h2>
            {!isEditing ? (
                <div className={styles.profileDetails}>
                    <p><strong>Email:</strong> {profile.email || 'Chưa cập nhật'}</p>
                    <p><strong>Họ và tên:</strong> {profile.fullName || 'Chưa cập nhật'}</p>
                    <p><strong>Vai trò:</strong> {profile.role || 'Chưa cập nhật'}</p>
                    <p><strong>Giới tính:</strong> {genderMap[profile.gender] || 'Chưa cập nhật'}</p>
                    <p>
                        <strong>Nhóm máu:</strong>{' '}
                        {profile.bloodType ? `${profile.bloodType.type}${profile.bloodType.rhFactor}` : 'Chưa cập nhật'}
                    </p>
                    <p><strong>Ngày sinh:</strong> {formatDisplayDate(profile.dateOfBirth)}</p>
                    <p><strong>Số điện thoại:</strong> {profile.phone || 'Chưa cập nhật'}</p>
                    <p><strong>Địa chỉ:</strong> {profile.address || 'Chưa cập nhật'}</p>
                    <p><strong>CCCD:</strong> {profile.cccd || 'Chưa cập nhật'}</p>
                    <p><strong>Ngày tạo tài khoản:</strong> {formatDisplayDate(profile.createAt)}</p>
                    <p>
                        <strong>Trạng thái tài khoản:</strong>{' '}
                        {profile.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                    </p>
                    {/* <p>
                        <strong>Trạng thái hiến máu:</strong>{' '}
                        {statusDonationMap[profile.statusDonation] || 'Chưa cập nhật'}
                    </p> */}
                    
                    <div className={styles.actionButtonsViewMode}>
                        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                            Chỉnh sửa Profile
                        </button>
                        <button className={styles.cancelButton} onClick={() => navigate(-1)}>
                            Quay lại
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.editForm}>
                    <div className={styles.formGroup}>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email || ''}
                            disabled
                            className={styles.disabledInput}
                        />
                    </div>
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
                        <label>Nhóm máu:</label>
                        <select
                            name="bloodTypeId"
                            value={editData.bloodTypeId}
                            onChange={handleInputChange}
                        >
                            <option value="">Chọn nhóm máu</option>
                            {staticBloodTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.displayName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>CCCD:</label>
                        <input
                            type="text"
                            name="cccd"
                            value={profile.cccd || 'Chưa cập nhật'}
                            disabled
                            className={styles.disabledInput}
                        />
                    </div>
                    {/* <div className={styles.formGroup}>
                        <label>Trạng thái hiến máu:</label>
                        <select
                            name="statusDonation"
                            value={editData.statusDonation}
                            onChange={handleInputChange}
                        >
                            <option value="">Chọn trạng thái</option>
                            {Object.keys(statusDonationMap).map(key => (
                                <option key={key} value={key}>{statusDonationMap[key]}</option>
                            ))}
                        </select>
                    </div> */}

                    <div className={styles.formActions}>
                        <button className={styles.saveButton} onClick={handleSave}>Lưu thay đổi</button>
                        <button className={styles.cancelButton} onClick={handleCancel}>Hủy</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProfile;
