import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './CommonCommunity.module.css';

// ==========================================================
// HÀM HỖ TRỢ ĐỂ LẤY TOKEN VÀ GIẢI MÃ ROLE TỪ LOCALSTORAGE
// ==========================================================
const getAuthData = () => {
    const token = localStorage.getItem('token'); // Lấy token từ key 'token'
    const userString = localStorage.getItem('user'); // Lấy chuỗi JSON từ key 'user'

    let userRole = null;
    let isLoggedIn = false;

    // Kiểm tra xem có token hay không để xác định trạng thái đăng nhập
    if (token) {
        isLoggedIn = true;
    }

    // Ưu tiên lấy role từ đối tượng user trong localStorage
    if (userString) {
        try {
            const userObj = JSON.parse(userString);
            if (userObj && userObj.role) {
                userRole = userObj.role;
                // Nếu role là một mảng (ví dụ: ["MEMBER"]), hãy lấy phần tử đầu tiên
                if (Array.isArray(userRole)) {
                    userRole = userRole[0];
                }
            }
        } catch (e) {
            console.error("Lỗi khi giải mã đối tượng 'user' từ localStorage:", e);
            // Nếu có lỗi, coi như không có vai trò hợp lệ
            userRole = null;
        }
    }
    // console.log("AuthData returned:", { token, userRole, isLoggedIn }); // Để debug
    return { token, userRole, isLoggedIn };
};
// ==========================================================


const CommonCommunity = () => {
    const [bloodType, setBloodType] = useState('');
    const [location, setLocation] = useState('');
    const [donors, setDonors] = useState([]); // Khởi tạo ban đầu là mảng rỗng
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Lấy trạng thái xác thực ban đầu từ localStorage
    const [authData, setAuthData] = useState(getAuthData());

    // Cập nhật trạng thái xác thực khi component mount hoặc khi localStorage thay đổi
    useEffect(() => {
        const handleStorageChange = () => {
            setAuthData(getAuthData());
            // console.log("AuthData updated via storage event:", getAuthData()); // Để debug
        };
        // Lắng nghe sự kiện 'storage' để cập nhật AuthData khi localStorage thay đổi
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []); // Chỉ chạy một lần khi component mount để thiết lập listener


    const fetchDonors = async (searchBloodType, searchLocation) => {
        // Kiểm tra nếu cả bloodType và location đều trống
        if (!searchBloodType && !searchLocation) {
            toast.warn('Vui lòng nhập ít nhất nhóm máu hoặc địa điểm để tìm kiếm.');
            setDonors([]); // Đảm bảo donors là mảng rỗng
            return; // Dừng hàm nếu không có input
        }

        setLoading(true);
        setError(null); // Xóa lỗi trước đó

        let apiUrl = 'http://localhost:8080/api/search-donor'; // Mặc định cho phép mọi người xem, sử dụng URL tuyệt đối
        const headers = {};

        // console.log("Current authData in fetchDonors:", authData); // Để debug
        // Kiểm tra vai trò của người dùng để chọn API endpoint và thêm token
        // Đảm bảo userRole là 'MEMBER' và không phân biệt chữ hoa chữ thường
        if (authData.isLoggedIn && authData.userRole && authData.userRole.toUpperCase() === 'MEMBER') {
            apiUrl = 'http://localhost:8080/api/search-donor/member';
            if (authData.token) {
                headers['Authorization'] = `Bearer ${authData.token}`;
            } else {
                // Trường hợp isLoggedIn là true nhưng không có token (có thể do lỗi giải mã trước đó)
                toast.error("Bạn phải đăng nhập để xem thông tin chi tiết. Vui lòng đăng nhập lại.");
                setLoading(false);
                setDonors([]);
                return;
            }
        }

        try {
            const response = await axios.get(apiUrl, {
                params: {
                    bloodType: searchBloodType,
                    location: searchLocation,
                },
                headers: headers, // Thêm headers vào request
            });

            // Đảm bảo response.data là một mảng. Nếu không, gán một mảng rỗng.
            // Điều này giải quyết lỗi "donors.map is not a function"
            const fetchedDonors = Array.isArray(response.data) ? response.data : [];
            setDonors(fetchedDonors);

            if (fetchedDonors.length === 0) {
                toast.info('Không tìm thấy người hiến máu nào phù hợp với tiêu chí của bạn.');
            } else {
                toast.success(`Tìm thấy ${fetchedDonors.length} người hiến máu phù hợp!`);
            }

        } catch (err) {
            console.error("Lỗi khi tìm kiếm người hiến máu:", err);
            setError("Không thể tìm thấy thông tin người hiến máu. Vui lòng thử lại.");
            setDonors([]); // Đảm bảo donors là mảng rỗng khi có lỗi

            if (err.response) {
                if (err.response.status === 403) {
                    toast.error("Bạn không có quyền xem thông tin này. Vui lòng đăng nhập với vai trò thành viên để xem số điện thoại.");
                    setError("Bạn không có quyền truy cập.");
                } else if (err.response.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
                    setError("Chưa xác thực.");
                    // Bạn có thể redirect người dùng đến trang đăng nhập ở đây
                    // Ví dụ: navigate('/login'); // Nếu dùng react-router-dom
                } else if (err.response.status === 400) {
                    toast.error("Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin tìm kiếm.");
                    setError("Yêu cầu không hợp lệ.");
                } else {
                    toast.error("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.");
                }
            } else if (err.request) {
                toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.");
                setError("Lỗi kết nối máy chủ.");
            } else {
                toast.error("Đã xảy ra lỗi không xác định.");
                setError("Lỗi không xác định.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault(); // Ngăn chặn form submit mặc định
        fetchDonors(bloodType, location);
    };

    return (
        <div className={styles.dashboardContainer}>
            <h2 className={styles.pageTitle}>Cộng Đồng Hiến Máu</h2>
            <p className={styles.introText}>
                Tìm kiếm thông tin người hiến máu theo nhóm máu và địa điểm.
            </p>

            <form onSubmit={handleSearch} className={styles.searchForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="bloodType">Nhóm máu:</label>
                    <input
                        type="text"
                        id="bloodType"
                        className={styles.inputField}
                        value={bloodType}
                        onChange={(e) => setBloodType(e.target.value)}
                        placeholder="Ví dụ: A, B, AB, O"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="location">Địa điểm:</label>
                    <input
                        type="text"
                        id="location"
                        className={styles.inputField}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ví dụ: TP.HCM, Hà Nội"
                    />
                </div>
                <button type="submit" className={styles.searchButton} disabled={loading}>
                    {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                </button>
            </form>

            {error && <p className={styles.errorMessage}>{error}</p>}

            {loading && <p>Đang tải dữ liệu...</p>}

            {/* RẤT QUAN TRỌNG: Thêm điều kiện `donors &&` để tránh lỗi `donors.map is not a function` */}
            {!loading && donors && donors.length > 0 && (
                <div className={styles.donorList}>
                    <h3>Kết quả tìm kiếm:</h3>
                    {donors.map((donor, index) => (
                        <div key={index} className={styles.donorCard}>
                            <h4>{donor.fullName}</h4>
                            <p><strong>Nhóm máu:</strong> {donor.bloodType}{donor.rhFactor}</p>
                            <p><strong>Địa điểm:</strong> {donor.location}</p>
                            {/* Hiển thị điện thoại và ghi chú dựa trên logic backend */}
                            {donor.phone && <p><strong>Điện thoại:</strong> {donor.phone}</p>}
                            {donor.note && <p className={styles.noteText}><em>{donor.note}</em></p>}
                        </div>
                    ))}
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default CommonCommunity;