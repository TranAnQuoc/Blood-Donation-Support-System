import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EmergencyTransfusionProcess.module.css';

const EMERGENCY_STATUS_OPTIONS = [
    'PENDING',
    'IN_PROCESS',
    'COMPLETED',
    'CANCELED'
];

const EmergencyProcessList = () => {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    // State cho modal chỉnh sửa
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentProcess, setCurrentProcess] = useState(null); // Đối tượng process đang chỉnh sửa
    const [editFormData, setEditFormData] = useState({ // Dữ liệu form chỉnh sửa
        healthCheckSummary: '',
        confirmed: false,
        status: 'PENDING', // Mặc định là PENDING
        symptoms: '',
        vitalSigns: '',
        hemoglobinLevel: 0.0,
        bloodGroupConfirmed: false,
        quantity: 0,
        crossmatchResult: '',
        needComponent: '',
        reasonForTransfusion: ''
    });
    const [editError, setEditError] = useState(null); // Lỗi khi submit form chỉnh sửa

    const fetchEmergencyProcesses = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/emergency-process", { // Đổi '/api/emergency-process' thành '/api/emergency-processes' cho đúng với @GetMapping
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            setProcesses(response.data);
        } catch (err) {
            console.error("Error fetching emergency processes:", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError("Phiên đăng nhập hết hạn hoặc không có quyền. Vui lòng đăng nhập lại.");
                // window.location.href = '/login';
            } else {
                setError("Không thể tải danh sách quy trình khẩn cấp. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmergencyProcesses();
    }, [token]);

    // Mở modal chỉnh sửa và điền dữ liệu
    const handleEditClick = (process) => {
        setCurrentProcess(process); // Lưu đối tượng process gốc
        setEditFormData({
            healthCheckSummary: process.healthCheckSummary || '',
            confirmed: process.confirmed || false,
            status: process.status || 'PENDING',
            symptoms: process.symptoms || '',
            vitalSigns: process.vitalSigns || '',
            hemoglobinLevel: process.hemoglobinLevel || 0.0,
            bloodGroupConfirmed: process.bloodGroupConfirmed || false,
            quantity: process.quantity || 0,
            crossmatchResult: process.crossmatchResult || '',
            needComponent: process.needComponent || '',
            reasonForTransfusion: process.reasonForTransfusion || ''
        });
        setEditError(null); // Reset lỗi khi mở modal
        setShowEditModal(true);
    };

    // Đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentProcess(null);
        setEditError(null);
    };

    // Xử lý thay đổi input trong form
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? (name === 'hemoglobinLevel' ? parseFloat(value) : parseInt(value, 10)) : value)
        }));
    };

    // Xử lý submit form
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setEditError(null); // Reset lỗi

        if (!currentProcess || !currentProcess.id) {
            setEditError("Không tìm thấy ID quy trình để cập nhật.");
            return;
        }

        try {
            // Backend API của bạn cần ID của Process trên PathVariable
            // và body là EmergencyProcessDTO
            await axios.put(
                `http://localhost:8080/api/emergency-process/${currentProcess.id}`, // Đảm bảo URL đúng
                editFormData, // Gửi DTO đã chỉnh sửa
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
            alert("Cập nhật quy trình thành công!");
            handleCloseEditModal();
            fetchEmergencyProcesses(); // Tải lại danh sách sau khi cập nhật
        } catch (err) {
            console.error("Lỗi khi cập nhật quy trình:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setEditError(err.response.data.message); // Hiển thị lỗi từ backend
            } else {
                setEditError("Có lỗi xảy ra khi cập nhật quy trình. Vui lòng thử lại.");
            }
        }
    };

    if (loading) {
        return <div className={styles.loading}>Đang tải danh sách quy trình khẩn cấp...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.listContainer}>
            <h2 className={styles.listTitle}>Danh Sách Quy Trình Khẩn Cấp</h2>
            {processes.length === 0 ? (
                <p className={styles.noProcesses}>Không có quy trình khẩn cấp nào.</p>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.processTable}>
                        <thead>
                            <tr>
                                <th>ID Process</th> {/* Thêm cột ID của Process */}
                                <th>Mã YC</th>
                                <th>Hồ sơ SK</th>
                                <th>Xác nhận</th>
                                <th>Trạng thái</th>
                                <th>Triệu chứng</th>
                                <th>Dấu hiệu SD</th>
                                <th>Mức Hemoglobin</th>
                                <th>Xác nhận nhóm máu</th>
                                <th>SL máu</th>
                                <th>Kết quả Crossmatch</th>
                                <th>Thành phần cần</th>
                                <th>Lý do truyền máu</th>
                                <th>Hành Động</th> {/* Thêm cột Hành Động */}
                            </tr>
                        </thead>
                        <tbody>
                            {processes.map((process) => (
                                <tr key={process.id}> {/* Đảm bảo dùng process.id làm key */}
                                    <td>{process.id || 'N/A'}</td> {/* Hiển thị ID của process */}
                                    <td>{process.idRequest || 'N/A'}</td>
                                    <td>{process.healthCheckSummary || 'N/A'}</td>
                                    <td>{process.confirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</td>
                                    <td>{process.status || 'N/A'}</td>
                                    <td>{process.symptoms}</td>
                                    <td>{process.vitalSigns}</td>
                                    <td>{process.hemoglobinLevel !== null ? `${process.hemoglobinLevel} g/dL` : 'N/A'}</td>
                                    <td>{process.bloodGroupConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</td>
                                    <td>{process.quantity !== null ? `${process.quantity} ml` : 'N/A'}</td>
                                    <td>{process.crossmatchResult}</td>
                                    <td>{process.needComponent}</td>
                                    <td>{process.reasonForTransfusion}</td>
                                    <td>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => handleEditClick(process)}
                                        >
                                            Chỉnh sửa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal chỉnh sửa */}
            {showEditModal && currentProcess && (
                <div className={styles.modalOverlay} onClick={handleCloseEditModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeModalButton} onClick={handleCloseEditModal}>
                            &times;
                        </button>
                        <h3>Chỉnh sửa Quy trình Khẩn cấp (ID: {currentProcess.id})</h3>
                        <form onSubmit={handleSubmitEdit} className={styles.editForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="healthCheckSummary">Hồ sơ sức khỏe:</label>
                                <textarea
                                    id="healthCheckSummary"
                                    name="healthCheckSummary"
                                    value={editFormData.healthCheckSummary}
                                    onChange={handleChange}
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmed">Xác nhận:</label>
                                <input
                                    type="checkbox"
                                    id="confirmed"
                                    name="confirmed"
                                    checked={editFormData.confirmed}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="status">Trạng thái:</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={editFormData.status}
                                    onChange={handleChange}
                                >
                                    {EMERGENCY_STATUS_OPTIONS.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="symptoms">Triệu chứng:</label>
                                <textarea
                                    id="symptoms"
                                    name="symptoms"
                                    value={editFormData.symptoms}
                                    onChange={handleChange}
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="vitalSigns">Dấu hiệu sinh tồn:</label>
                                <textarea
                                    id="vitalSigns"
                                    name="vitalSigns"
                                    value={editFormData.vitalSigns}
                                    onChange={handleChange}
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="hemoglobinLevel">Mức Hemoglobin (g/dL):</label>
                                <input
                                    type="number"
                                    id="hemoglobinLevel"
                                    name="hemoglobinLevel"
                                    value={editFormData.hemoglobinLevel}
                                    onChange={handleChange}
                                    step="0.01" // Cho phép số thập phân
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="bloodGroupConfirmed">Xác nhận nhóm máu:</label>
                                <input
                                    type="checkbox"
                                    id="bloodGroupConfirmed"
                                    name="bloodGroupConfirmed"
                                    checked={editFormData.bloodGroupConfirmed}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="quantity">Số lượng máu (ml):</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={editFormData.quantity}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="crossmatchResult">Kết quả Crossmatch:</label>
                                <input
                                    type="text"
                                    id="crossmatchResult"
                                    name="crossmatchResult"
                                    value={editFormData.crossmatchResult}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="needComponent">Thành phần cần:</label>
                                <input
                                    type="text"
                                    id="needComponent"
                                    name="needComponent"
                                    value={editFormData.needComponent}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="reasonForTransfusion">Lý do truyền máu:</label>
                                <textarea
                                    id="reasonForTransfusion"
                                    name="reasonForTransfusion"
                                    value={editFormData.reasonForTransfusion}
                                    onChange={handleChange}
                                    rows="3"
                                ></textarea>
                            </div>

                            {editError && <p className={styles.errorText}>{editError}</p>}

                            <div className={styles.modalActions}>
                                <button type="submit" className={`${styles.actionButton} ${styles.confirmButton}`}>Cập nhật</button>
                                <button type="button" className={`${styles.actionButton} ${styles.cancelButton}`} onClick={handleCloseEditModal}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmergencyProcessList;