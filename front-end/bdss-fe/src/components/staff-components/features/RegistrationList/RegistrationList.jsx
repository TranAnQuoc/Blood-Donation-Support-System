// src/components/staff-components/mainContent/RegistrationList.jsx
import React, { useState, useEffect } from 'react';
import styles from './RegistrationList.module.css';

const RegistrationList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRegistration, setSelectedRegistration] = useState(null); // Để lưu đơn đăng ký đang xem/chỉnh sửa
    const [isModalOpen, setIsModalOpen] = useState(false); // Điều khiển modal

    useEffect(() => {
        const fetchRegistrations = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Thay thế bằng URL API thực tế của bạn cho đơn đăng ký hiến máu
                // Ví dụ: GET /api/registrations/donations (danh sách các đơn đăng ký chờ xử lý)
                const response = await fetch('http://localhost:8080/api/registrations/donations', {
                    headers: {
                        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Không thể tải danh sách đơn đăng ký.');
                }

                const data = await response.json();
                setRegistrations(data);
            } catch (err) {
                console.error("Lỗi khi fetch đơn đăng ký:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRegistrations();
    }, []);

    const handleViewDetails = (registration) => {
        setSelectedRegistration(registration);
        setIsModalOpen(true);
    };

    const handleUpdateRegistration = async (updatedData) => {
        // Gửi dữ liệu cập nhật lên API backend
        try {
            const response = await fetch(`http://localhost:8080/api/registrations/donations/${updatedData.id}`, {
                method: 'PUT',
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Cập nhật đơn đăng ký thất bại.');
            }

            // Cập nhật lại danh sách registrations trong state
            setRegistrations(registrations.map(reg => (reg.id === updatedData.id ? updatedData : reg)));
            setIsModalOpen(false);
            setSelectedRegistration(null);
            alert('Cập nhật đơn đăng ký thành công!');
        } catch (err) {
            console.error("Lỗi khi cập nhật đơn đăng ký:", err);
            setError(err.message);
            alert(`Lỗi: ${err.message}`);
        }
    };

    const handleDeleteRegistration = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đơn đăng ký này?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/registrations/donations/${id}`, {
                method: 'DELETE',
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Xóa đơn đăng ký thất bại.');
            }

            // Xóa đơn đăng ký khỏi danh sách trong state
            setRegistrations(registrations.filter(reg => reg.id !== id));
            setIsModalOpen(false);
            setSelectedRegistration(null);
            alert('Xóa đơn đăng ký thành công!');
        } catch (err) {
            console.error("Lỗi khi xóa đơn đăng ký:", err);
            setError(err.message);
            alert(`Lỗi: ${err.message}`);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRegistration(null);
    };

    if (isLoading) {
        return <div className={styles.loadingMessage}>Đang tải danh sách đơn đăng ký...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>Lỗi: {error}</div>;
    }

    if (registrations.length === 0) {
        return <div className={styles.noDataMessage}>Không có đơn đăng ký hiến máu nào.</div>;
    }

    return (
        <div className={styles.tableContainer}>
            <h2 className={styles.title}>Danh Sách Đơn Đăng Ký Hiến Máu</h2>
            <p className={styles.description}>Quản lý các đơn đăng ký hiến máu từ người dùng.</p>

            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th className={styles.tableCell}>ID Đăng Ký</th>
                        <th className={styles.tableCell}>Tên Người Đăng Ký</th>
                        <th className={styles.tableCell}>Nhóm Máu Đăng Ký</th>
                        <th className={styles.tableCell}>Ngày Đăng Ký</th>
                        <th className={styles.tableCell}>Trạng Thái</th>
                        <th className={styles.tableCell}>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {registrations.map(reg => (
                        <tr key={reg.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>{reg.id}</td>
                            <td className={styles.tableCell}>{reg.fullName || 'N/A'}</td>
                            <td className={styles.tableCell}>{reg.bloodType || 'N/A'}</td>
                            <td className={styles.tableCell}>{new Date(reg.registrationDate).toLocaleDateString()}</td>
                            <td className={styles.tableCell}>{reg.status}</td>
                            <td className={styles.tableCell}>
                                <button className={styles.actionButtonView} onClick={() => handleViewDetails(reg)}>Xem</button>
                                <button className={styles.actionButtonDelete} onClick={() => handleDeleteRegistration(reg.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && selectedRegistration && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.modalTitle}>Chi Tiết Đơn Đăng Ký</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            // Lấy dữ liệu từ form và gọi handleUpdateRegistration
                            const formData = new FormData(e.target);
                            const updatedData = {
                                id: selectedRegistration.id,
                                fullName: formData.get('fullName'),
                                email: formData.get('email'),
                                phone: formData.get('phone'),
                                bloodType: formData.get('bloodType'),
                                registrationDate: selectedRegistration.registrationDate, // Giữ nguyên ngày đăng ký
                                status: formData.get('status'),
                                // Thêm các trường khác nếu có
                            };
                            handleUpdateRegistration(updatedData);
                        }}>
                            <div className={styles.formGroup}>
                                <label>ID:</label>
                                <input type="text" value={selectedRegistration.id} disabled />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="fullName">Tên đầy đủ:</label>
                                <input type="text" id="fullName" name="fullName" defaultValue={selectedRegistration.fullName} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email:</label>
                                <input type="email" id="email" name="email" defaultValue={selectedRegistration.email} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="phone">Số điện thoại:</label>
                                <input type="tel" id="phone" name="phone" defaultValue={selectedRegistration.phone} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="bloodType">Nhóm máu:</label>
                                <input type="text" id="bloodType" name="bloodType" defaultValue={selectedRegistration.bloodType} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="status">Trạng thái:</label>
                                <select id="status" name="status" defaultValue={selectedRegistration.status} required>
                                    <option value="Pending">Chờ duyệt</option>
                                    <option value="Approved">Đã duyệt</option>
                                    <option value="Rejected">Từ chối</option>
                                    <option value="Completed">Hoàn thành</option>
                                </select>
                            </div>
                            {/* Thêm các trường khác cần xem/cập nhật tại đây */}
                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.saveButton}>Lưu Thay Đổi</button>
                                <button type="button" className={styles.cancelButton} onClick={closeModal}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrationList;