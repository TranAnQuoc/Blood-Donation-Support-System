import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EmergencyTransfusionProcess.module.css';

// Cập nhật EMERGENCY_STATUS_OPTIONS với label hiển thị
const EMERGENCY_STATUS_OPTIONS = [
    {value: 'IN_PROCESS', lable:'Đang xử lý'},
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELED', label: 'Hủy bỏ' }
];

// Định nghĩa các tùy chọn cho kết quả Crossmatch
const CROSSMATCH_OPTIONS = [
    { value: 'PENDING', label: 'Đang chờ kết quả' },
    { value: 'COMPATIBLE', label: 'Tương thích' },
    { value: 'INCOMPATIBLE', label: 'Không tương thích' }
];

// Dữ liệu tĩnh cho Blood Types dựa trên initBloodTypes của backend
const BLOOD_TYPES = [
    { id: 2, type: "A", rhFactor: "+", label: "A+" },
    { id: 3, type: "A", rhFactor: "-", label: "A-" },
    { id: 4, type: "B", rhFactor: "+", label: "B+" },
    { id: 5, type: "B", rhFactor: "-", label: "B-" },
    { id: 6, type: "AB", rhFactor: "+", label: "AB+" },
    { id: 7, type: "AB", rhFactor: "-", label: "AB-" },
    { id: 8, type: "O", rhFactor: "+", label: "O+" },
    { id: 9, type: "O", rhFactor: "-", label: "O-" }
    // Lưu ý: ID ở đây là giả định. Trong thực tế, bạn cần lấy ID chính xác từ DB
    // hoặc đảm bảo rằng mapping giữa front-end và back-end là nhất quán.
    // Nếu bạn không muốn gọi API, bạn phải biết ID mà backend sẽ tạo ra cho các giá trị này.
    // Ví dụ, nếu UNKNOWN luôn là ID 1, A+ luôn là ID 2, v.v.
];

// Dữ liệu tĩnh cho Blood Components dựa trên initBloodComponents của backend
const BLOOD_COMPONENTS = [
    { id: 2, name: "Toàn phần" },
    { id: 3, name: "Huyết tương" },
    { id: 4, name: "Hồng cầu" },
    { id: 5, name: "Tiểu cầu" },
    { id: 6, name: "Bạch cầu" }
    // Tương tự như Blood Types, ID ở đây là giả định và cần nhất quán với backend.
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
        bloodtypeId: null, // Giá trị mặc định là null hoặc ID của 'UNKNOWN'
        componentId: null, // Giá trị mặc định là null hoặc ID của 'Unknow'
    });
    // Removed healthFile state as we are no longer uploading a new file here
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
        setEditFormData({
            status: process.status || 'PENDING',
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
            // Đảm bảo rằng ID được lấy đúng, chuyển đổi sang number nếu cần
            bloodtypeId: process.bloodtypeId ? Number(process.bloodtypeId) : null,
            componentId: process.componentId ? Number(process.componentId) : null,
        });
        setCurrentHealthCheckFileUrl(process.healthFileUrl || '');
        // setHealthFile(null); // Removed this as we are no longer managing file state for upload
        setEditError(null);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentProcess(null);
        setEditError(null);
        // setHealthFile(null); // Removed this
        setCurrentHealthCheckFileUrl('');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prevState => ({
            ...prevState,
            // Chuyển đổi giá trị sang kiểu số (Integer/Double) hoặc Boolean nếu cần
            [name]: type === 'checkbox' ? checked : (
                type === 'number' || name === 'bloodtypeId' || name === 'componentId'
                    ? (value === '' ? null : parseFloat(value)) // Sử dụng parseFloat để xử lý cả số nguyên và số thập phân, hoặc null nếu rỗng
                    : value
            )
        }));
    };

    // Removed handleFileChange as file upload is no longer part of this form

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setEditError(null);

        if (!currentProcess || !currentProcess.id) {
            setEditError("Không tìm thấy ID quy trình để cập nhật.");
            return;
        }

        const formData = new FormData();

        for (const key in editFormData) {
            // Kiểm tra và bỏ qua các trường có giá trị null hoặc undefined
            // Đặc biệt quan trọng cho các trường số (như ID) nếu chúng có thể là null
            if (editFormData[key] === null || editFormData[key] === undefined) {
                continue; // Không thêm trường này vào formData nếu giá trị là null/undefined
            }
            if (typeof editFormData[key] === 'boolean') {
                formData.append(key, editFormData[key].toString());
            } else {
                formData.append(key, editFormData[key]);
            }
        }

        // Removed logic for appending healthFile to formData

        try {
            await axios.put(
                `http://localhost:8080/api/emergency-process/${currentProcess.id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // Content-Type is automatically set to multipart/form-data when using FormData
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
                                <th>Trạng thái</th>
                                <th>Số lượng</th>
                                <th>Nhóm máu</th> {/* Đổi tên cột để hiển thị tên */}
                                <th>Thành phần máu</th> {/* Đổi tên cột để hiển thị tên */}
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processes.map((process) => {
                                const bloodType = BLOOD_TYPES.find(bt => bt.id === process.bloodtypeId);
                                const bloodComponentName = BLOOD_COMPONENTS.find(bc => bc.id === process.componentId);
                                return (
                                    <tr key={process.id}>
                                        <td>{process.id || 'N/A'}</td>
                                        <td>{process.idRequest || 'N/A'}</td>
                                        <td>
                                            {EMERGENCY_STATUS_OPTIONS.find(opt => opt.value === process.status)?.label || process.status || 'N/A'}
                                        </td>
                                
                                        <td>{process.quantity !== null ? `${process.quantity} ml` : 'N/A'}</td>
                                        <td>{process.bloodType || 'N/A' }</td>
                                        <td>{process.bloodComponent || 'N/A'}</td>
                                        <td>
                                            <button
                                                className={styles.editButton}
                                                onClick={() => handleEditClick(process)}
                                            >
                                                Chỉnh sửa
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
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
                                            value={editFormData.pulse !== null ? editFormData.pulse : ''} // Display empty string if null
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="respiratoryRate">Nhịp thở:</label>
                                        <input
                                            type="number"
                                            id="respiratoryRate"
                                            name="respiratoryRate"
                                            value={editFormData.respiratoryRate !== null ? editFormData.respiratoryRate : ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="temperature">Nhiệt độ (°C):</label>
                                        <input
                                            type="number"
                                            id="temperature"
                                            name="temperature"
                                            value={editFormData.temperature !== null ? editFormData.temperature : ''}
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