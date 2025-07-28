import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './EmergencyTransfusionProcess.module.css';

// Cập nhật EMERGENCY_STATUS_OPTIONS với label hiển thị
const EMERGENCY_STATUS_OPTIONS = [
    { value: 'IN_PROCESS', label:'Đang xử lý'},
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
];

// Dữ liệu tĩnh cho Blood Components dựa trên initBloodComponents của backend
const BLOOD_COMPONENTS = [
    { id: 2, name: "Toàn phần" },
    { id: 3, name: "Huyết tương" },
    { id: 4, name: "Hồng cầu" },
    { id: 5, name: "Tiểu cầu" },
    { id: 6, name: "Bạch cầu" }
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
        status: 'IN_PROCESS',
        symptoms: '',
        hemoglobinLevel: 0.0,
        bloodGroupConfirmed: false,
        quantity: 0,
        crossmatchResult: 'PENDING',
        needComponent: '',
        reasonForTransfusion: '',
        healthCheckSummary: '',
        bloodPressure: '',
        pulse: 0,
        respiratoryRate: 0,
        temperature: 0.0,
        bloodtypeId: null,
        componentId: null,
    });
    const [currentHealthCheckFileUrl, setCurrentHealthCheckFileUrl] = useState('');

    // State mới để lưu lỗi validation cho từng trường
    const [validationErrors, setValidationErrors] = useState({});
    const [overallError, setOverallError] = useState(null); // Lỗi tổng thể không liên quan đến từng trường

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
                toast.error("Phiên đăng nhập hết hạn hoặc không có quyền. Vui lòng đăng nhập lại.");
            } else {
                setError("Không thể tải danh sách quy trình khẩn cấp. Vui lòng thử lại.");
                toast.error("Không thể tải danh sách quy trình khẩn cấp. Vui lòng thử lại.");
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
            status: process.status || 'IN_PROCESS',
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
            bloodtypeId: process.bloodtypeId ? Number(process.bloodtypeId) : null,
            componentId: process.componentId ? Number(process.componentId) : null,
        });
        setCurrentHealthCheckFileUrl(process.healthFileUrl || '');
        setValidationErrors({}); // Reset errors when opening modal
        setOverallError(null); // Reset overall error
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentProcess(null);
        setValidationErrors({}); // Clear errors on close
        setOverallError(null);
        setCurrentHealthCheckFileUrl('');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : (
                type === 'number' || name === 'bloodtypeId' || name === 'componentId'
                    ? (value === '' ? null : parseFloat(value))
                    : value
            )
        }));
        // Clear specific error when user starts typing/changing
        if (validationErrors[name]) {
            setValidationErrors(prevErrors => ({
                ...prevErrors,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        // healthCheckSummary validation
        if (!editFormData.healthCheckSummary || editFormData.healthCheckSummary.trim() === '') {
            errors.healthCheckSummary = "Tóm tắt hồ sơ sức khỏe không được để trống.";
            isValid = false;
        } else if (editFormData.healthCheckSummary.length > 1000) {
            errors.healthCheckSummary = "Tóm tắt hồ sơ sức khỏe tối đa 1000 ký tự.";
            isValid = false;
        }

        // status validation
        if (!editFormData.status) {
            errors.status = "Trạng thái quy trình là bắt buộc.";
            isValid = false;
        }

        // symptoms validation
        if (editFormData.symptoms && editFormData.symptoms.length > 500) {
            errors.symptoms = "Triệu chứng tối đa 500 ký tự.";
            isValid = false;
        }

        // bloodPressure validation
        if (editFormData.bloodPressure && editFormData.bloodPressure.length > 50) {
            errors.bloodPressure = "Huyết áp tối đa 50 ký tự.";
            isValid = false;
        }

        // pulse validation
        if (editFormData.pulse !== null && editFormData.pulse < 0) {
            errors.pulse = "Mạch phải lớn hơn hoặc bằng 0.";
            isValid = false;
        }

        // respiratoryRate validation
        if (editFormData.respiratoryRate !== null && editFormData.respiratoryRate < 0) {
            errors.respiratoryRate = "Nhịp thở phải lớn hơn hoặc bằng 0.";
            isValid = false;
        }

        // temperature validation
        if (editFormData.temperature !== null) {
            if (editFormData.temperature < 30.0 || editFormData.temperature > 45.0) {
                errors.temperature = "Nhiệt độ không hợp lệ (30.0 - 45.0 °C).";
                isValid = false;
            }
        }

        // hemoglobinLevel validation
        if (editFormData.hemoglobinLevel === null || editFormData.hemoglobinLevel === '') {
             errors.hemoglobinLevel = "Nồng độ Hemoglobin không được để trống.";
             isValid = false;
        } else if (editFormData.hemoglobinLevel < 0.0) {
            errors.hemoglobinLevel = "Nồng độ Hemoglobin không hợp lệ (phải lớn hơn hoặc bằng 0.0).";
            isValid = false;
        }

        // quantity validation
        if (editFormData.quantity === null || editFormData.quantity === '') {
            errors.quantity = "Số lượng máu không được để trống.";
            isValid = false;
        } else if (editFormData.quantity < 1) {
            errors.quantity = "Số lượng máu phải lớn hơn 0.";
            isValid = false;
        }

        // needComponent validation
        if (editFormData.needComponent && editFormData.needComponent.length > 200) {
            errors.needComponent = "Thành phần máu cần thiết tối đa 200 ký tự.";
            isValid = false;
        }

        // reasonForTransfusion validation
        if (editFormData.reasonForTransfusion && editFormData.reasonForTransfusion.length > 500) {
            errors.reasonForTransfusion = "Lý do truyền máu tối đa 500 ký tự.";
            isValid = false;
        }

        // bloodtypeId and componentId are nullable in DTO, so no required validation here
        // However, if you want to validate against your static lists:
        if (editFormData.bloodtypeId !== null && !BLOOD_TYPES.some(bt => bt.id === editFormData.bloodtypeId)) {
            errors.bloodtypeId = "Nhóm máu không hợp lệ.";
            isValid = false;
        }
        if (editFormData.componentId !== null && !BLOOD_COMPONENTS.some(bc => bc.id === editFormData.componentId)) {
            errors.componentId = "Thành phần máu không hợp lệ.";
            isValid = false;
        }


        setValidationErrors(errors);
        return isValid;
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setOverallError(null); // Clear overall error before submission

        if (!currentProcess || !currentProcess.id) {
            setOverallError("Không tìm thấy ID quy trình để cập nhật.");
            toast.error("Không tìm thấy ID quy trình để cập nhật.");
            return;
        }

        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại các thông tin lỗi trong biểu mẫu.");
            return; // Stop submission if validation fails
        }

        const formData = new FormData();

        for (const key in editFormData) {
            if (editFormData[key] === null || editFormData[key] === undefined) {
                // If the DTO field can be null/optional, don't append it if its value is null/undefined
                // However, for fields like 'quantity', 'hemoglobinLevel' where 0 is a valid number,
                // ensure they are appended unless you specifically want to omit them when 0.
                // Based on your DTO annotations, they seem to be required or have min values.
                if (key === 'quantity' || key === 'hemoglobinLevel' || key === 'pulse' || key === 'respiratoryRate' || key === 'temperature') {
                    // For numeric fields with min/not-null requirements, if they are null here
                    // it means they failed validateForm() already.
                    // If they are 0 and valid, they will be appended.
                    formData.append(key, editFormData[key]);
                } else if (key === 'bloodGroupConfirmed') {
                     formData.append(key, editFormData[key].toString());
                }
                else {
                    continue; // Skip appending truly optional null fields
                }
            } else if (typeof editFormData[key] === 'boolean') {
                formData.append(key, editFormData[key].toString());
            } else {
                formData.append(key, editFormData[key]);
            }
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
            toast.success("Cập nhật quy trình thành công!");
            handleCloseEditModal();
            fetchEmergencyProcesses(); // Refresh data
        } catch (err) {
            console.error("Lỗi khi cập nhật quy trình:", err);
            let errorMessage = "Có lỗi xảy ra khi cập nhật quy trình. Vui lòng thử lại.";
            if (err.response && err.response.data) {
                if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (Array.isArray(err.response.data.errors)) {
                    // Try to map backend validation errors to frontend fields
                    const backendErrors = {};
                    err.response.data.errors.forEach(error => {
                        if (error.field) {
                            backendErrors[error.field] = error.defaultMessage || error.message;
                        } else {
                            // If no specific field, add to overall error
                            errorMessage = error.defaultMessage || error.message || errorMessage;
                        }
                    });
                    setValidationErrors(prev => ({...prev, ...backendErrors}));
                    if (Object.keys(backendErrors).length > 0) {
                        errorMessage = "Vui lòng kiểm tra các lỗi trong biểu mẫu.";
                    }
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            setOverallError(errorMessage);
            toast.error(errorMessage);
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
                                <th>Nhóm máu</th>
                                <th>Thành phần máu</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processes.map((process) => {
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

                            {/* 1. Triệu chứng - Size max 500 */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label htmlFor="symptoms">Triệu chứng:</label>
                                <textarea
                                    id="symptoms"
                                    name="symptoms"
                                    value={editFormData.symptoms}
                                    onChange={handleChange}
                                    rows="3"
                                ></textarea>
                                {validationErrors.symptoms && <p className={styles.fieldError}>{validationErrors.symptoms}</p>}
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
                                        {validationErrors.bloodPressure && <p className={styles.fieldError}>{validationErrors.bloodPressure}</p>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="pulse">Mạch:</label>
                                        <input
                                            type="number"
                                            id="pulse"
                                            name="pulse"
                                            value={editFormData.pulse !== null ? editFormData.pulse : ''}
                                            onChange={handleChange}
                                        />
                                        {validationErrors.pulse && <p className={styles.fieldError}>{validationErrors.pulse}</p>}
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
                                        {validationErrors.respiratoryRate && <p className={styles.fieldError}>{validationErrors.respiratoryRate}</p>}
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
                                        {validationErrors.temperature && <p className={styles.fieldError}>{validationErrors.temperature}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* 3. Mức Hemoglobin (g/dL) - Required, Min 0.0 */}
                            <div className={styles.formGroup}>
                                <label htmlFor="hemoglobinLevel">Mức Hemoglobin (g/dL):<span className={styles.required}>*</span></label>
                                <input
                                    type="number"
                                    id="hemoglobinLevel"
                                    name="hemoglobinLevel"
                                    value={editFormData.hemoglobinLevel}
                                    onChange={handleChange}
                                    step="0.01"
                                />
                                {validationErrors.hemoglobinLevel && <p className={styles.fieldError}>{validationErrors.hemoglobinLevel}</p>}
                            </div>

                            {/* 4. Tóm tắt Hồ sơ sức khỏe (Text) - Required, Max 1000 */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label htmlFor="healthCheckSummary">Tóm tắt hồ sơ sức khỏe:<span className={styles.required}>*</span></label>
                                <textarea
                                    id="healthCheckSummary"
                                    name="healthCheckSummary"
                                    value={editFormData.healthCheckSummary}
                                    onChange={handleChange}
                                    rows="3"
                                ></textarea>
                                {validationErrors.healthCheckSummary && <p className={styles.fieldError}>{validationErrors.healthCheckSummary}</p>}
                            </div>

                            {/* 6. Xác nhận nhóm máu - Boolean, no validation from DTO */}
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

                            {/* 7. Kết quả Crossmatch - DROPDOWN - No required validation from DTO, but check if valid option if ID exists*/}
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
                                {validationErrors.crossmatchResult && <p className={styles.fieldError}>{validationErrors.crossmatchResult}</p>}
                            </div>

                            {/* 9. Số lượng máu (ml) - Required, Min 1 */}
                            <div className={styles.formGroup}>
                                <label htmlFor="quantity">Số lượng máu (ml):<span className={styles.required}>*</span></label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={editFormData.quantity}
                                    onChange={handleChange}
                                />
                                {validationErrors.quantity && <p className={styles.fieldError}>{validationErrors.quantity}</p>}
                            </div>

                            {/* bloodtypeId - Long, nullable. Added client-side check if value exists, is valid ID */}
                             <div className={styles.formGroup}>
                                <label htmlFor="bloodtypeId">Nhóm máu:</label>
                                <select
                                    id="bloodtypeId"
                                    name="bloodtypeId"
                                    value={editFormData.bloodtypeId || ''} // Use empty string for null to allow placeholder
                                    onChange={handleChange}
                                >
                                    <option value="">Chọn nhóm máu</option> {/* Placeholder option */}
                                    {BLOOD_TYPES.map(type => (
                                        <option key={type.id} value={type.id}>{type.label}</option>
                                    ))}
                                </select>
                                {validationErrors.bloodtypeId && <p className={styles.fieldError}>{validationErrors.bloodtypeId}</p>}
                            </div>

                            {/* componentId - Long, nullable. Added client-side check if value exists, is valid ID */}
                            <div className={styles.formGroup}>
                                <label htmlFor="componentId">Thành phần máu:</label>
                                <select
                                    id="componentId"
                                    name="componentId"
                                    value={editFormData.componentId || ''}
                                    onChange={handleChange}
                                >
                                    <option value="">Chọn thành phần máu</option>
                                    {BLOOD_COMPONENTS.map(component => (
                                        <option key={component.id} value={component.id}>{component.name}</option>
                                    ))}
                                </select>
                                {validationErrors.componentId && <p className={styles.fieldError}>{validationErrors.componentId}</p>}
                            </div>

                            {/* 11. Trạng thái xử lý - Required */}
                            <div className={styles.formGroup}>
                                <label htmlFor="status">Trạng thái:<span className={styles.required}>*</span></label>
                                <select
                                    id="status"
                                    name="status"
                                    value={editFormData.status}
                                    onChange={handleChange}
                                >
                                    {EMERGENCY_STATUS_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                {validationErrors.status && <p className={styles.fieldError}>{validationErrors.status}</p>}
                            </div>


                            {overallError && <p className={styles.errorText}>{overallError}</p>}

                            <div className={styles.modalActions}>
                                <button type="submit" className={`${styles.actionButton} ${styles.confirmButton}`}>Cập nhật</button>
                                <button type="button" className={`${styles.actionButton} ${styles.cancelButton}`} onClick={handleCloseEditModal}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default EmergencyProcessList;