import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EmergencyTransfusionProcess.module.css';

// Cập nhật EMERGENCY_STATUS_OPTIONS với label hiển thị
const EMERGENCY_STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Đang chờ xử lý' },
    { value: 'IN_PROCESS', label: 'Đang xử lý' },
    { value: 'COMPLETED', label: 'Đã hoàn thành' },
    { value: 'CANCELED', label: 'Đã hủy bỏ' }
];

// Định nghĩa các tùy chọn cho kết quả Crossmatch
const CROSSMATCH_OPTIONS = [
    { value: 'PENDING', label: 'Đang chờ kết quả' },
    { value: 'COMPATIBLE', label: 'Tương thích' },
    { value: 'INCOMPATIBLE', label: 'Không tương thích' }
];

const EmergencyProcessList = () => {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    // State cho modal chỉnh sửa
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentProcess, setCurrentProcess] = useState(null); // Đối tượng process đang chỉnh sửa
    const [editFormData, setEditFormData] = useState({ // Dữ liệu form chỉnh sửa (các trường text/number/boolean)
        status: 'PENDING', // Giá trị mặc định
        symptoms: '',
        hemoglobinLevel: 0.0,
        bloodGroupConfirmed: false,
        quantity: 0,
        crossmatchResult: 'PENDING',
        needComponent: '',
        reasonForTransfusion: '',
        healthCheckSummary: '', // Dành cho tóm tắt TEXT
        bloodPressure: '',
        pulse: 0,
        respiratoryRate: 0,
        temperature: 0.0,
    });
    const [healthFile, setHealthFile] = useState(null);
    const [currentHealthCheckFileUrl, setCurrentHealthCheckFileUrl] = useState('');

    const [editError, setEditError] = useState(null);

    const fetchEmergencyProcesses = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/emergency-process", {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            setProcesses(response.data);
        } catch (err) {
            console.error("Error fetching emergency processes:", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError("Phiên đăng nhập hết hạn hoặc không có quyền. Vui lòng đăng nhập lại.");
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

    const handleEditClick = (process) => {
        setCurrentProcess(process);
        // Tìm label tương ứng để hiển thị trong select
        // Giá trị process.status từ API sẽ là 'PENDING', 'IN_PROCESS', v.v.
        // Chúng ta cần đảm bảo rằng nó được gán đúng cách cho select.
        setEditFormData({
            status: process.status || 'PENDING', // Giá trị từ backend (enum string)
            symptoms: process.symptoms || '',
            hemoglobinLevel: process.hemoglobinLevel || 0.0,
            bloodGroupConfirmed: process.bloodGroupConfirmed || false,
            quantity: process.quantity || 0,
            crossmatchResult: process.crossmatchResult || 'PENDING',
            needComponent: process.needComponent || '',
            reasonForTransfusion: process.reasonForTransfusion || '',
            healthCheckSummary: process.healthCheckSummary || '',
            bloodPressure: process.bloodPressure || '',
            pulse: process.pulse || 0,
            respiratoryRate: process.respiratoryRate || 0,
            temperature: process.temperature || 0.0,
        });
        setCurrentHealthCheckFileUrl(process.healthFileUrl || '');
        setHealthFile(null);
        setEditError(null);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentProcess(null);
        setEditError(null);
        setHealthFile(null);
        setCurrentHealthCheckFileUrl('');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? (name === 'hemoglobinLevel' || name === 'temperature' ? parseFloat(value) : parseInt(value, 10)) : value)
        }));
    };

    const handleFileChange = (e) => {
        setHealthFile(e.target.files[0]);
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setEditError(null);

        if (!currentProcess || !currentProcess.id) {
            setEditError("Không tìm thấy ID quy trình để cập nhật.");
            return;
        }

        const formData = new FormData();

        for (const key in editFormData) {
            formData.append(key, editFormData[key]);
        }

        if (healthFile) {
            formData.append('healthFile', healthFile);
        }

        try {
            await axios.put(
                `http://localhost:8080/api/emergency-process/${currentProcess.id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            alert("Cập nhật quy trình thành công!");
            handleCloseEditModal();
            fetchEmergencyProcesses();
        } catch (err) {
            console.error("Lỗi khi cập nhật quy trình:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setEditError(err.response.data.message);
            } else if (err.response && err.response.data && Array.isArray(err.response.data.errors)) {
                const errorMessages = err.response.data.errors.map(error => error.defaultMessage || error.message).join("; ");
                setEditError(`Lỗi validate: ${errorMessages}`);
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
                                <th>ID Process</th>
                                <th>Mã YC</th>
                                <th>Tóm tắt SK</th>
                                <th>URL File SK</th>
                                <th>Trạng thái</th>
                                <th>Triệu chứng</th>
                                <th>Huyết áp</th>
                                <th>Mạch</th>
                                <th>Nhịp thở</th>
                                <th>Nhiệt độ</th>
                                <th>Mức Hemoglobin</th>
                                <th>Xác nhận nhóm máu</th>
                                <th>SL máu</th>
                                <th>Kết quả Crossmatch</th>
                                <th>Thành phần cần</th>
                                <th>Lý do truyền máu</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processes.map((process) => (
                                <tr key={process.id}>
                                    <td>{process.id || 'N/A'}</td>
                                    <td>{process.idRequest || 'N/A'}</td>
                                    <td>{process.healthCheckSummary || 'N/A'}</td>
                                    <td>
                                        {process.healthFileUrl ? (
                                            <a href={`http://localhost:8080${process.healthFileUrl}`} target="_blank" rel="noopener noreferrer">Xem File</a>
                                        ) : 'N/A'}
                                    </td>
                                    {/* Hiển thị label thay vì value enum */}
                                    <td>
                                        {EMERGENCY_STATUS_OPTIONS.find(opt => opt.value === process.status)?.label || process.status || 'N/A'}
                                    </td>
                                    <td>{process.symptoms}</td>
                                    <td>{process.bloodPressure || 'N/A'}</td>
                                    <td>{process.pulse !== null ? process.pulse : 'N/A'}</td>
                                    <td>{process.respiratoryRate !== null ? process.respiratoryRate : 'N/A'}</td>
                                    <td>{process.temperature !== null ? `${process.temperature}°C` : 'N/A'}</td>
                                    <td>{process.hemoglobinLevel !== null ? `${process.hemoglobinLevel} g/dL` : 'N/A'}</td>
                                    <td>{process.bloodGroupConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</td>
                                    <td>{process.quantity !== null ? `${process.quantity} ml` : 'N/A'}</td>
                                    {/* Hiển thị label cho Crossmatch Result */}
                                    <td>
                                        {CROSSMATCH_OPTIONS.find(opt => opt.value === process.crossmatchResult)?.label || process.crossmatchResult || 'N/A'}
                                    </td>
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

                            {/* 1. Triệu chứng - Required, full width */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label htmlFor="symptoms">Triệu chứng:<span className={styles.required}>*</span></label>
                                <textarea
                                    id="symptoms"
                                    name="symptoms"
                                    value={editFormData.symptoms}
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                ></textarea>
                            </div>

                            {/* Dấu hiệu sinh tồn (Nhóm các trường mới) */}
                            <div className={`${styles.formGroup} ${styles.fullWidth} ${styles.vitalSignsGroup}`}>
                                <label className={styles.groupLabel}>Dấu hiệu sinh tồn:</label>
                                <div className={styles.vitalSignsGrid}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="bloodPressure">Huyết áp:</label>
                                        <input
                                            type="text"
                                            id="bloodPressure"
                                            name="bloodPressure"
                                            value={editFormData.bloodPressure}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="pulse">Mạch:</label>
                                        <input
                                            type="number"
                                            id="pulse"
                                            name="pulse"
                                            value={editFormData.pulse}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="respiratoryRate">Nhịp thở:</label>
                                        <input
                                            type="number"
                                            id="respiratoryRate"
                                            name="respiratoryRate"
                                            value={editFormData.respiratoryRate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="temperature">Nhiệt độ (°C):</label>
                                        <input
                                            type="number"
                                            id="temperature"
                                            name="temperature"
                                            value={editFormData.temperature}
                                            onChange={handleChange}
                                            step="0.1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Mức Hemoglobin (g/dL) - Required, single column */}
                            <div className={styles.formGroup}>
                                <label htmlFor="hemoglobinLevel">Mức Hemoglobin (g/dL):<span className={styles.required}>*</span></label>
                                <input
                                    type="number"
                                    id="hemoglobinLevel"
                                    name="hemoglobinLevel"
                                    value={editFormData.hemoglobinLevel}
                                    onChange={handleChange}
                                    step="0.01"
                                    required
                                />
                            </div>

                            {/* 4. Tóm tắt Hồ sơ sức khỏe (Text) - Required by DTO, full width */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label htmlFor="healthCheckSummary">Tóm tắt hồ sơ sức khỏe:<span className={styles.required}>*</span></label>
                                <textarea
                                    id="healthCheckSummary"
                                    name="healthCheckSummary"
                                    value={editFormData.healthCheckSummary}
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                ></textarea>
                            </div>

                            {/* 5. Hồ sơ sức khỏe (File) - Không bắt buộc, full width */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label htmlFor="healthFile">Hồ sơ sức khỏe (File):</label>
                                <input
                                    type="file"
                                    id="healthFile"
                                    name="healthFile"
                                    onChange={handleFileChange}
                                />
                                {currentHealthCheckFileUrl && !healthFile && (
                                    <p className={styles.currentFile}>
                                        File hiện tại:
                                        <a href={`http://localhost:8080${currentHealthCheckFileUrl}`} target="_blank" rel="noopener noreferrer" className={styles.viewFileLink}> (Xem file)</a>
                                    </p>
                                )}
                                {healthFile && (
                                    <p className={styles.newFile}>File mới chọn: {healthFile.name}</p>
                                )}
                            </div>

                            {/* 6. Xác nhận nhóm máu - Không bắt buộc, single column */}
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

                            {/* 7. Kết quả Crossmatch - DROPDOWN - Không bắt buộc, single column */}
                            <div className={styles.formGroup}>
                                <label htmlFor="crossmatchResult">Kết quả Crossmatch:</label>
                                <select
                                    id="crossmatchResult"
                                    name="crossmatchResult"
                                    value={editFormData.crossmatchResult}
                                    onChange={handleChange}
                                >
                                    {CROSSMATCH_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 8. Thành phần cần truyền - Không bắt buộc, single column */}
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

                            {/* 9. Số lượng máu (ml) - Required, single column */}
                            <div className={styles.formGroup}>
                                <label htmlFor="quantity">Số lượng máu (ml):<span className={styles.required}>*</span></label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={editFormData.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* 10. Lý do truyền máu - Không bắt buộc, full width */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label htmlFor="reasonForTransfusion">Lý do truyền máu:</label>
                                <textarea
                                    id="reasonForTransfusion"
                                    name="reasonForTransfusion"
                                    value={editFormData.reasonForTransfusion}
                                    onChange={handleChange}
                                    rows="3"
                                ></textarea>
                            </div>

                            {/* 11. Trạng thái xử lý - Required, single column */}
                            <div className={styles.formGroup}>
                                <label htmlFor="status">Trạng thái:<span className={styles.required}>*</span></label>
                                <select
                                    id="status"
                                    name="status"
                                    value={editFormData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    {/* Sử dụng option.value và option.label từ mảng đối tượng mới */}
                                    {EMERGENCY_STATUS_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
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