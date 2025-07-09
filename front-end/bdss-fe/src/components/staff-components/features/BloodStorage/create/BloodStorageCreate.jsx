import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './BloodStorageCreate.module.css'; // Đảm bảo file CSS cùng thư mục

// ==========================================================
// HÀM HỖ TRỢ ĐỂ LẤY TOKEN VÀ ROLE TỪ LOCALSTORAGE
// ==========================================================
const getAuthData = () => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    let userRole = null;
    let isLoggedIn = false;

    if (token) {
        isLoggedIn = true;
    }

    if (userString) {
        try {
            const userObj = JSON.parse(userString);
            if (userObj && userObj.role) {
                userRole = userObj.role;
                if (Array.isArray(userRole)) {
                    userRole = userRole[0];
                }
            }
        } catch (e) {
            console.error("Lỗi khi giải mã đối tượng 'user' từ localStorage:", e);
            userRole = null;
        }
    }
    return { token, userRole, isLoggedIn };
};
// ==========================================================

// ==========================================================
// Dữ liệu cứng (hardcoded data) cho Blood Types và Blood Components
// Đảm bảo `id` ở đây khớp với `id` trong database của bạn
// ==========================================================
const staticBloodTypes = [
    { id: 1, groupName: "Uknow", rhFactor: "" }, // ID 1 là "Không xác định"
    { id: 2, groupName: "A", rhFactor: "+" },
    { id: 3, groupName: "A", rhFactor: "-" },
    { id: 4, groupName: "B", rhFactor: "+" },
    { id: 5, groupName: "B", rhFactor: "-" },
    { id: 6, groupName: "AB", rhFactor: "+" },
    { id: 7, groupName: "AB", rhFactor: "-" },
    { id: 8, groupName: "O", rhFactor: "+" },
    { id: 9, groupName: "O", rhFactor: "-" },
];

const staticBloodComponents = [
    { id: 1, name: "Unknow" }, // ID 1 là "Không xác định"
    { id: 2, name: "Toàn phần" },
    { id: 3, name: "Huyết tương" },
    { id: 4, name: "Hồng cầu" },
    { id: 5, name: "Tiểu cầu" },
    { id: 6, name: "Bạch cầu" },
];
// ==========================================================


const BloodStorageCreateForm = ({ onCreateSuccess }) => {
    const [donorId, setDonorId] = useState('');
    const [selectedBloodTypeId, setSelectedBloodTypeId] = useState('');
    const [selectedComponentId, setSelectedComponentId] = useState('');
    const [quantity, setQuantity] = useState('');

    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({}); // Lưu trữ lỗi validation frontend
    const [apiError, setApiError] = useState(null); // Lưu trữ lỗi từ API

    // Hàm tạo chuỗi hiển thị cho BloodType (ví dụ: "A+", "O-")
    const getBloodTypeName = (bloodType) => {
        if (!bloodType) return "";
        if (bloodType.groupName === "Uknow" && bloodType.rhFactor === "") {
            return "Không xác định";
        }
        return `${bloodType.groupName}${bloodType.rhFactor}`;
    };

    // Client-side validation
    const validateForm = () => {
        const errors = {};
        if (!donorId) {
            errors.donorId = "Người hiến máu không được để trống";
        } else if (isNaN(Number(donorId))) {
            errors.donorId = "ID người hiến phải là số";
        }

        if (!selectedBloodTypeId) {
            errors.bloodTypeId = "Nhóm máu không được để trống";
        } else if (Number(selectedBloodTypeId) === 1) { // ID 1 là "Uknow"
            errors.bloodTypeId = "Nhóm máu không được là 'Không xác định'";
        }

        if (!selectedComponentId) {
            errors.componentId = "Thành phần máu không được để trống";
        } else if (Number(selectedComponentId) === 1) { // ID 1 là "Uknow"
            errors.componentId = "Thành phần máu không được là 'Không xác định'";
        }

        if (!quantity) {
            errors.quantity = "Lượng máu không được để trống";
        } else {
            const qty = Number(quantity);
            if (isNaN(qty)) {
                errors.quantity = "Lượng máu phải là số";
            } else if (qty < 200) {
                errors.quantity = "Lượng máu tối thiểu là 200ml";
            } else if (qty > 500) {
                errors.quantity = "Lượng máu tối đa là 500ml";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Trả về true nếu không có lỗi
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null); // Xóa lỗi API cũ
        setFormErrors({}); // Xóa lỗi form cũ

        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin nhập liệu.");
            return;
        }

        setLoading(true);
        const authData = getAuthData();

        if (!authData.isLoggedIn || !authData.token || authData.userRole?.toUpperCase() !== 'STAFF') {
            toast.error("Bạn không có quyền 'STAFF' để tạo kho máu. Vui lòng đăng nhập lại.");
            setLoading(false);
            return;
        }

        try {
            const bloodStorageDTO = {
                donorId: Number(donorId),
                bloodTypeId: Number(selectedBloodTypeId),
                componentId: Number(selectedComponentId),
                quantity: Number(quantity),
            };

            const response = await axios.post(
                'http://localhost:8080/api/blood-storage',
                bloodStorageDTO,
                {
                    headers: {
                        'Authorization': `Bearer ${authData.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) { // API trả về ResponseEntity.ok()
                toast.success('Tạo kho máu thành công!');
                // Reset form
                setDonorId('');
                setSelectedBloodTypeId(staticBloodTypes[0].id.toString());
                setSelectedComponentId(staticBloodComponents[0].id.toString());
                setQuantity('');
                if (onCreateSuccess) {
                    onCreateSuccess(); // Gọi callback để làm mới danh sách (nếu có)
                }
            } else {
                toast.warn('Có lỗi xảy ra khi tạo kho máu.');
                setApiError('Có lỗi xảy ra khi tạo kho máu.');
            }

        } catch (err) {
            console.error("Lỗi khi tạo kho máu:", err);
            if (err.response) {
                // Lỗi từ backend (ví dụ: validation errors, 403 Forbidden)
                if (err.response.status === 400 && err.response.data) {
                    // Xử lý lỗi validation từ backend nếu có
                    const backendErrors = {};
                    if (typeof err.response.data === 'object') {
                        // Spring Boot validation errors often come as a map or list of errors
                        // You might need to adjust this based on your exact error response structure
                        for (const key in err.response.data) {
                            backendErrors[key] = err.response.data[key];
                        }
                    } else if (typeof err.response.data === 'string') {
                        // Nếu backend trả về một chuỗi lỗi chung
                        setApiError(err.response.data);
                        toast.error(err.response.data);
                    }
                    setFormErrors(prev => ({ ...prev, ...backendErrors }));
                    toast.error("Lỗi nhập liệu từ server. Vui lòng kiểm tra lại.");
                } else if (err.response.status === 403) {
                    toast.error("Bạn không có quyền thực hiện hành động này.");
                    setApiError("Không có quyền.");
                } else if (err.response.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    setApiError("Chưa xác thực.");
                } else {
                    toast.error(`Đã xảy ra lỗi server: ${err.response.data?.message || err.message}`);
                    setApiError(`Lỗi server: ${err.response.status}`);
                }
            } else if (err.request) {
                toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.");
                setApiError("Lỗi kết nối.");
            } else {
                toast.error("Đã xảy ra lỗi không xác định.");
                setApiError("Lỗi không xác định.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Tạo Mới Kho Máu</h2>
            <p className={styles.formIntro}>Điền thông tin chi tiết để thêm một mục kho máu mới.</p>

            <form onSubmit={handleSubmit} className={styles.bloodStorageForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="donorId" className={styles.label}>ID Người hiến:</label>
                    <input
                        type="number" // Sử dụng type="number" để giới hạn input là số
                        id="donorId"
                        className={`${styles.inputField} ${formErrors.donorId ? styles.inputError : ''}`}
                        value={donorId}
                        onChange={(e) => setDonorId(e.target.value)}
                        placeholder="Nhập ID người hiến"
                        disabled={loading}
                    />
                    {formErrors.donorId && <p className={styles.errorText}>{formErrors.donorId}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="bloodTypeId" className={styles.label}>Nhóm máu:</label>
                    <select
                        id="bloodTypeId"
                        className={`${styles.selectField} ${formErrors.bloodTypeId ? styles.inputError : ''}`}
                        value={selectedBloodTypeId}
                        onChange={(e) => setSelectedBloodTypeId(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">-- Chọn nhóm máu --</option>
                        {staticBloodTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {getBloodTypeName(type)}
                            </option>
                        ))}
                    </select>
                    {formErrors.bloodTypeId && <p className={styles.errorText}>{formErrors.bloodTypeId}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="componentId" className={styles.label}>Thành phần máu:</label>
                    <select
                        id="componentId"
                        className={`${styles.selectField} ${formErrors.componentId ? styles.inputError : ''}`}
                        value={selectedComponentId}
                        onChange={(e) => setSelectedComponentId(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">-- Chọn thành phần --</option>
                        {staticBloodComponents.map((component) => (
                            <option key={component.id} value={component.id}>
                                {component.name}
                            </option>
                        ))}
                    </select>
                    {formErrors.componentId && <p className={styles.errorText}>{formErrors.componentId}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="quantity" className={styles.label}>Lượng máu (ml):</label>
                    <input
                        type="number"
                        id="quantity"
                        className={`${styles.inputField} ${formErrors.quantity ? styles.inputError : ''}`}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Nhập lượng máu (200-500ml)"
                        min="200"
                        max="500"
                        disabled={loading}
                    />
                    {formErrors.quantity && <p className={styles.errorText}>{formErrors.quantity}</p>}
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Đang tạo...' : 'Tạo Kho Máu'}
                </button>
            </form>

            {apiError && <p className={styles.apiErrorMessage}>{apiError}</p>}

            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default BloodStorageCreateForm;