import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './StatusDonationSetting.module.css';

// ==========================================================
// HÀM HỖ TRỢ ĐỂ LẤY TOKEN TỪ LOCALSTORAGE
// ==========================================================
const getToken = () => {
    // Lấy token từ key 'token' giống như trong CommonCommunity.jsx
    return localStorage.getItem('token');
};

// ==========================================================
// HÀM HỖ TRỢ ĐỂ LẤY ROLE TỪ LOCALSTORAGE (từ đối tượng 'user')
// ==========================================================
const getUserRole = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            const userObj = JSON.parse(userString);
            // Assuming 'role' is directly in the parsed user object
            return userObj.role;
        } catch (e) {
            console.error("Lỗi khi giải mã đối tượng 'user' từ localStorage:", e);
            return null;
        }
    }
    return null;
};
// ==========================================================


const DonationSettings = () => {
    // Khởi tạo state với giá trị mặc định. Trong thực tế, bạn sẽ fetch
    // các giá trị này từ một API GET khi component mount.
    const [statusDonation, setStatusDonation] = useState('AVAILABLE'); // Corresponds to StatusDonation enum
    const [phoneVisibility, setPhoneVisibility] = useState('PUBLIC'); // Corresponds to PhoneVisibility enum
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Kiểm tra trạng thái đăng nhập và vai trò MEMBER
    useEffect(() => {
        const token = getToken();
        const role = getUserRole();
        if (!token || !role || role.toUpperCase() !== 'MEMBER') {
            toast.error("Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với vai trò thành viên.");
            // Có thể chuyển hướng người dùng về trang chủ hoặc trang đăng nhập
            // history.push('/login'); // Nếu dùng react-router-dom
        }
        // TODO: Trong thực tế, bạn sẽ gọi một API GET ở đây
        // để lấy cài đặt hiện tại của người dùng và set state
        // fetchCurrentSettings();
    }, []);

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = getToken();
        const userRole = getUserRole();

        // Kiểm tra lại token và vai trò trước khi gửi request
        if (!token || !userRole || userRole.toUpperCase() !== 'MEMBER') {
            toast.error("Bạn chưa đăng nhập hoặc không có quyền MEMBER. Vui lòng đăng nhập lại.");
            setLoading(false);
            return;
        }

        try {
            const requestBody = {
                statusDonation: statusDonation,
                phoneVisibility: phoneVisibility,
            };

            const response = await axios.put(
                'http://localhost:8080/api/account/update-donation-status', // Đảm bảo URL chính xác
                requestBody,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json', // Quan trọng: Luôn gửi JSON
                    },
                }
            );

            // API trả về String "Cập nhật thành công", nên kiểm tra response.data
            if (response.status === 200) {
                toast.success(response.data || 'Cập nhật cài đặt hiến máu thành công!');
            } else {
                // Xử lý các status code khác 200 (nếu có)
                toast.warn(`Cập nhật thất bại: ${response.status} - ${response.data}`);
                setError(`Cập nhật thất bại: ${response.status}`);
            }

        } catch (err) {
            console.error("Lỗi khi cập nhật cài đặt hiến máu:", err);
            setError("Không thể cập nhật cài đặt. Vui lòng thử lại.");
            if (err.response) {
                if (err.response.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
                    setError("Chưa xác thực.");
                } else if (err.response.status === 403) {
                    toast.error("Bạn không có quyền thực hiện hành động này.");
                    setError("Không có quyền.");
                } else if (err.response.status === 400) {
                    toast.error(`Dữ liệu gửi lên không hợp lệ: ${err.response.data}`);
                    setError(`Lỗi dữ liệu: ${err.response.data}`);
                } else {
                    toast.error(`Đã xảy ra lỗi server: ${err.response.data || err.message}`);
                    setError(`Lỗi server: ${err.response.status}`);
                }
            } else if (err.request) {
                toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.");
                setError("Lỗi kết nối.");
            } else {
                toast.error("Đã xảy ra lỗi không xác định.");
                setError("Lỗi không xác định.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.settingsContainer}>
            <h2 className={styles.pageTitle}>Cài Đặt Hiến Máu</h2>
            <p className={styles.introText}>Quản lý trạng thái hiến máu và quyền riêng tư số điện thoại của bạn.</p>

            <form onSubmit={handleUpdateSettings} className={styles.settingsForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="statusDonation" className={styles.label}>Trạng thái hiến máu:</label>
                    <select
                        id="statusDonation"
                        className={styles.selectField}
                        value={statusDonation}
                        onChange={(e) => setStatusDonation(e.target.value)}
                        disabled={loading}
                    >
                        <option value="AVAILABLE">Có thể hiến (Available)</option>
                        <option value="UNAVAILABLE">Không thể hiến (Unavailable)</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phoneVisibility" className={styles.label}>Hiển thị số điện thoại:</label>
                    <select
                        id="phoneVisibility"
                        className={styles.selectField}
                        value={phoneVisibility}
                        onChange={(e) => setPhoneVisibility(e.target.value)}
                        disabled={loading}
                    >
                        <option value="PUBLIC">Công khai (Public)</option>
                        <option value="PRIVATE">Riêng tư (Private)</option>
                    </select>
                </div>

                <button type="submit" className={styles.saveButton} disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
                </button>
            </form>

            {error && <p className={styles.errorMessage}>{error}</p>}

            <ToastContainer />
        </div>
    );
};

export default DonationSettings;