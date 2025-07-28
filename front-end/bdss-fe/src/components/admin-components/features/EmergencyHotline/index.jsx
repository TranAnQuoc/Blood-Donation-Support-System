import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../../configs/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './index.module.css';

const HotlineStatus = {
    ACTIVE: "ACTIVE",
    DELETED: "DELETED",
};

const EmergencyHotlineManagement = () => {
    const [hotlines, setHotlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentHotline, setCurrentHotline] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        address: '',
        status: HotlineStatus.ACTIVE,
    });

    const fetchHotlines = useCallback(async (address = '') => {
        setLoading(true);
        setError(null);
        try {
            let url = '/hotlines';
            if (address) {
                url = `/hotlines/address?address=${encodeURIComponent(address)}`;
            }
            const response = await axiosInstance.get(url);
            setHotlines(response.data);
            console.log("Đã lấy danh sách đường dây nóng:", response.data);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách đường dây nóng:', err);
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
        fetchHotlines();
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateHotline = async () => {
        if (!formData.name || !formData.number || !formData.address) {
            toast.error("Vui lòng điền đầy đủ các trường: Tên, Số điện thoại, Địa chỉ.");
            return;
        }
        setLoading(true);
        try {
            await axiosInstance.post('/hotlines', formData);
            toast.success('Tạo đường dây nóng thành công!');
            setShowCreateModal(false);
            setFormData({ name: '', number: '', address: '', status: HotlineStatus.ACTIVE });
            fetchHotlines();
        } catch (err) {
            console.error('Lỗi khi tạo đường dây nóng:', err);
            toast.error(`Lỗi khi tạo: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (hotline) => {
        setCurrentHotline(hotline);
        setFormData({
            name: hotline.name || '',
            number: hotline.number || '',
            address: hotline.address || '',
            status: hotline.status || HotlineStatus.ACTIVE,
        });
        setShowEditModal(true);
    };

    const handleUpdateHotline = async () => {
        if (!currentHotline || !formData.name || !formData.number || !formData.address) {
            toast.error("Vui lòng điền đầy đủ các trường: Tên, Số điện thoại, Địa chỉ.");
            return;
        }
        setLoading(true);
        try {
            await axiosInstance.put(`/hotlines/${currentHotline.id}`, formData);
            toast.success('Cập nhật đường dây nóng thành công!');
            setShowEditModal(false);
            setCurrentHotline(null);
            setFormData({ name: '', number: '', address: '', status: HotlineStatus.ACTIVE });
            fetchHotlines();
        } catch (err) {
            console.error('Lỗi khi cập nhật đường dây nóng:', err);
            toast.error(`Lỗi khi cập nhật: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteHotline = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn XÓA đường dây nóng này không? (Thao tác xóa mềm)")) {
            return;
        }
        setLoading(true);
        try {
            await axiosInstance.delete(`/hotlines/${id}`);
            toast.success('Đường dây nóng đã được xóa thành công!');
            fetchHotlines();
        } catch (err) {
            console.error('Lỗi khi xóa đường dây nóng:', err);
            toast.error(`Lỗi khi xóa: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreHotline = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn KHÔI PHỤC đường dây nóng này không?")) {
            return;
        }
        setLoading(true);
        try {
            await axiosInstance.put(`/hotlines/restore/${id}`);
            toast.success('Đường dây nóng đã được khôi phục thành công!');
            fetchHotlines();
        } catch (err) {
            console.error('Lỗi khi khôi phục đường dây nóng:', err);
            toast.error(`Lỗi khi khôi phục: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải danh sách đường dây nóng...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className="text-3xl font-bold mb-8 text-center text-red-700">
                Quản Lý Đường Dây Nóng Khẩn Cấp
            </h2>

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
                <button className={styles.addButton} onClick={() => setShowCreateModal(true)}>Thêm mới</button>
            </div>

            {hotlines.length === 0 ? (
                <div className={styles.noHotlinesMessage}>Chưa có đường dây nóng nào.</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên Đơn vị</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotlines.map((hotline) => (
                                <tr key={hotline.id}>
                                    <td data-label="ID">{hotline.id}</td>
                                    <td data-label="Tên Đơn vị">{hotline.name}</td>
                                    <td data-label="Số điện thoại">{hotline.number}</td>
                                    <td data-label="Địa chỉ">{hotline.address}</td>
                                    <td data-label="Trạng thái">
                                        <span className={`${styles.statusBadge} ${styles[hotline.status?.toLowerCase()]}`}>
                                            {hotline.status === HotlineStatus.ACTIVE ? "Hoạt động" : "Đã xóa"}
                                        </span>
                                    </td>
                                    <td data-label="Hành động" className={styles.actionButtons}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => handleEditClick(hotline)}
                                            disabled={loading}
                                        >
                                            Sửa
                                        </button>
                                        {hotline.status === HotlineStatus.ACTIVE ? (
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDeleteHotline(hotline.id)}
                                                disabled={loading}
                                            >
                                                Xóa
                                            </button>
                                        ) : (
                                            <button
                                                className={styles.restoreButton}
                                                onClick={() => handleRestoreHotline(hotline.id)}
                                                disabled={loading}
                                            >
                                                Khôi phục
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showCreateModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Thêm Đường Dây Nóng Mới</h3>
                        <div className={styles.formGroup}>
                            <label>Tên Đơn vị:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                className={styles.modalInput}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Số điện thoại:</label>
                            <input
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleFormChange}
                                className={styles.modalInput}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Địa chỉ:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleFormChange}
                                className={styles.modalInput}
                                required
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.saveButton} onClick={handleCreateHotline} disabled={loading}>Lưu</button>
                            <button className={styles.cancelButton} onClick={() => {
                                setShowCreateModal(false);
                                setFormData({ name: '', number: '', address: '', status: HotlineStatus.ACTIVE });
                            }}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Chỉnh Sửa Đường Dây Nóng</h3>
                        {currentHotline && (
                            <>
                                <div className={styles.formGroup}>
                                    <label>ID:</label>
                                    <input type="text" value={currentHotline.id} className={styles.modalInput} disabled />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Tên Đơn vị:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        className={styles.modalInput}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Số điện thoại:</label>
                                    <input
                                        type="text"
                                        name="number"
                                        value={formData.number}
                                        onChange={handleFormChange}
                                        className={styles.modalInput}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Địa chỉ:</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleFormChange}
                                        className={styles.modalInput}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Trạng thái:</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleFormChange}
                                        className={styles.modalInput}
                                    >
                                        <option value={HotlineStatus.ACTIVE}>Hoạt động</option>
                                        <option value={HotlineStatus.DELETED}>Đã xóa</option>
                                    </select>
                                </div>
                                <div className={styles.modalActions}>
                                    <button className={styles.saveButton} onClick={handleUpdateHotline} disabled={loading}>Cập nhật</button>
                                    <button className={styles.cancelButton} onClick={() => {
                                        setShowEditModal(false);
                                        setCurrentHotline(null);
                                        setFormData({ name: '', number: '', address: '', status: HotlineStatus.ACTIVE });
                                    }}>Hủy</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default EmergencyHotlineManagement;