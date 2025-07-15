import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../../configs/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './index.module.css'; // Đảm bảo tạo file CSS này

// Giả định trạng thái của hotline (dù STAFF chỉ xem, vẫn giữ để hiển thị đúng)
const HotlineStatus = {
    ACTIVE: "ACTIVE",
    DELETED: "DELETED",
};

const EmergencyHotlineListForStaff = () => {
    const [hotlines, setHotlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Hàm fetch cho STAFF: ưu tiên getForStaff, nếu có searchTerm thì dùng getByAddress
    const fetchHotlines = useCallback(async (address = '') => {
        setLoading(true);
        setError(null);
        try {
            let url;
            if (address) {
                // API getByAddress có quyền STAFF và ADMIN
                url = `/hotlines/address?address=${encodeURIComponent(address)}`; // Đảm bảo đúng base URL của API
            } else {
                // API getForStaff chỉ có quyền STAFF
                url = '/hotlines/staff'; // Đảm bảo đúng base URL của API
            }
            const response = await axiosInstance.get(url);
            setHotlines(response.data);
            console.log("Đã lấy danh sách đường dây nóng cho STAFF:", response.data);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách đường dây nóng cho STAFF:', err);
            setError('Không thể tải danh sách đường dây nóng. Vui lòng thử lại sau.');
            toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHotlines();
    }, [fetchHotlines]);

    const handleSearch = () => {
        fetchHotlines(searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        fetchHotlines(); // Tải lại tất cả cho STAFF
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải danh sách đường dây nóng...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
                Thông Tin Đường Dây Nóng Khẩn Cấp
            </h2>

            {/* Search Bar - Không có nút thêm mới */}
            <div className={styles.topActions}>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo địa chỉ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
                    />
                    <button className={styles.searchButton} onClick={handleSearch}>Tìm kiếm</button>
                    {searchTerm && (
                        <button className={styles.clearSearchButton} onClick={handleClearSearch}>Xóa tìm kiếm</button>
                    )}
                </div>
                {/* Không có nút "Thêm mới" cho STAFF */}
            </div>

            {hotlines.length === 0 ? (
                <div className={styles.noHotlinesMessage}>Không tìm thấy đường dây nóng nào.</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên Đơn vị</th>
                                <th>Địa chỉ</th>
                                <th>Số điện thoại</th>
                                {/* Không có cột "Hành động" cho STAFF */}
                            </tr>
                        </thead>
                        <tbody>
                            {hotlines.map((hotline) => (
                                <tr key={hotline.id}>
                                    <td data-label="ID">{hotline.id}</td>
                                    <td data-label="Tên Đơn vị">{hotline.name}</td>
                                    <td data-label="Địa chỉ">{hotline.address}</td>
                                    <td data-label="Số điện thoại">{hotline.number}</td> 
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default EmergencyHotlineListForStaff;