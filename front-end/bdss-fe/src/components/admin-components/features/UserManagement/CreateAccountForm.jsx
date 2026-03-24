import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import styles from './CreateAccountForm.module.css';
import { useSelector } from 'react-redux';

function CreateAccountForm() {
    const user = useSelector((state) => state.user);
    const loggedInAdminEmail = user?.email || '';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        gender: '',
        dateOfBirth: '',
        phone: '',
        address: '',
        role: '',
        bloodTypeId: '',
        cccd: '',
        emailOwner: loggedInAdminEmail,
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const staticBloodTypes = [
        { id: 2, type: 'A', rhFactor: '+', displayName: 'A+' },
        { id: 3, type: 'A', rhFactor: '-', displayName: 'A-' },
        { id: 4, type: 'B', rhFactor: '+', displayName: 'B+' },
        { id: 5, type: 'B', rhFactor: '-', displayName: 'B-' },
        { id: 6, type: 'AB', rhFactor: '+', displayName: 'AB+' },
        { id: 7, type: 'AB', rhFactor: '-', displayName: 'AB-' },
        { id: 8, type: 'O', rhFactor: '+', displayName: 'O+' },
        { id: 9, type: 'O', rhFactor: '-', displayName: 'O-' },
    ];

    const navigate = useNavigate();

    const genders = ['MALE', 'FEMALE', 'OTHER'];
    const formatGender = (gender) => {
        switch (gender) {
            case 'MALE':
                return 'Nam';
            case 'FEMALE':
                return 'Nữ';
            case 'OTHER':
                return 'Khác';
            default:
                return '';
        }
    };

    const roles = ['STAFF', 'ADMIN'];
    const formatRole = (role) => {
        switch (role) {
            case 'ADMIN':
                return 'Quản trị viên';
            case 'STAFF':
                return 'Nhân viên';
            default:
                return '';
        }
    };

    useEffect(() => {
        if (loggedInAdminEmail && formData.emailOwner !== loggedInAdminEmail) {
            setFormData((prevData) => ({
                ...prevData,
                emailOwner: loggedInAdminEmail,
            }));
        }
    }, [loggedInAdminEmail, formData.emailOwner]);

    const validateEmail = (email) => {
        if (!email?.trim()) return 'Email là bắt buộc.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không đúng định dạng.';
        return '';
    };

    const validatePassword = (password) => {
        if (!password?.trim()) return 'Mật khẩu là bắt buộc.';
        if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(password)) {
            return 'Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&).';
        }
        return '';
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword?.trim()) return 'Xác nhận mật khẩu là bắt buộc.';
        if (confirmPassword !== password) return 'Mật khẩu và xác nhận mật khẩu không khớp.';
        return '';
    };

    const validateFullName = (fullName) => {
        if (!fullName?.trim()) return 'Họ và tên là bắt buộc.';
        if (fullName.trim().length < 3) return 'Họ và tên phải có ít nhất 3 ký tự.';
        return '';
    };

    const validateGender = (gender) => {
        if (!gender) return 'Giới tính là bắt buộc.';
        return '';
    };

    const validateDateOfBirth = (dateOfBirth) => {
        if (!dateOfBirth) return 'Ngày sinh là bắt buộc.';
        const today = dayjs();
        const birthDate = dayjs(dateOfBirth);
        if (!birthDate.isValid() || birthDate.isAfter(today, 'day')) return 'Ngày sinh không hợp lệ.';
        if (today.diff(birthDate, 'year') < 18) return 'Người dùng phải đủ 18 tuổi.';
        return '';
    };

    const validatePhone = (phone) => {
        if (!phone?.trim()) return 'Số điện thoại là bắt buộc.';
        if (!/^(0[0-9]{9})$/.test(phone)) return 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.';
        return '';
    };

    const validateAddress = (address) => {
        if (!address?.trim()) return 'Địa chỉ là bắt buộc.';
        const lowerCaseAddress = address.toLowerCase();
        if (!lowerCaseAddress.includes('hồ chí minh') && !lowerCaseAddress.includes('hcm')) {
            return 'Địa chỉ phải thuộc Thành phố Hồ Chí Minh.';
        }
        return '';
    };

    const validateRole = (role) => {
        if (!role) return 'Vai trò là bắt buộc.';
        return '';
    };

    const validateBloodTypeId = (bloodTypeId) => {
        if (!bloodTypeId) return 'Nhóm máu là bắt buộc.';
        return '';
    };

    const validateCccd = (cccd) => {
        if (!cccd?.trim()) return 'CCCD là bắt buộc.';
        if (!/^\d{12}$/.test(cccd)) return 'CCCD phải có đúng 12 chữ số.';
        return '';
    };

    const validateEmailOwner = (emailOwner) => {
        if (!emailOwner?.trim()) return 'Email người tạo là bắt buộc.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOwner)) return 'Email người tạo không đúng định dạng.';
        return '';
    };

    const validateField = (fieldId, value, currentData) => {
        switch (fieldId) {
            case 'email':
                return validateEmail(value);
            case 'password':
                return validatePassword(value);
            case 'confirmPassword':
                return validateConfirmPassword(value, currentData.password);
            case 'fullName':
                return validateFullName(value);
            case 'gender':
                return validateGender(value);
            case 'dateOfBirth':
                return validateDateOfBirth(value);
            case 'phone':
                return validatePhone(value);
            case 'address':
                return validateAddress(value);
            case 'role':
                return validateRole(value);
            case 'bloodTypeId':
                return validateBloodTypeId(value);
            case 'cccd':
                return validateCccd(value);
            case 'emailOwner':
                return validateEmailOwner(value);
            default:
                return '';
        }
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        const nextData = { ...formData, [id]: value };
        setFormData(nextData);
        setErrors((prev) => {
            const nextErrors = {
                ...prev,
                [id]: validateField(id, value, nextData),
            };
            if (id === 'password' || id === 'confirmPassword') {
                nextErrors.confirmPassword = validateConfirmPassword(nextData.confirmPassword, nextData.password);
            }
            return nextErrors;
        });
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const mapBackendFieldKey = (key) => {
        const normalized = String(key || '').trim();
        if (!normalized) return '';
        if (normalized.toLowerCase() === 'cccd' || normalized === 'CCCD') return 'cccd';
        return normalized;
    };

    const parseBackendErrors = (errorData) => {
        const parsedErrors = {};

        if (!errorData) return parsedErrors;

        if (errorData.errors && typeof errorData.errors === 'object') {
            Object.entries(errorData.errors).forEach(([key, value]) => {
                const mappedKey = mapBackendFieldKey(key);
                if (mappedKey && value) parsedErrors[mappedKey] = String(value);
            });
            return parsedErrors;
        }

        if (typeof errorData.message === 'string') {
            const lines = errorData.message.split('\n').map((line) => line.trim()).filter(Boolean);
            lines.forEach((line) => {
                const separator = line.includes(':') ? ':' : line.includes('|') ? '|' : null;
                if (!separator) return;
                const [field, ...rest] = line.split(separator);
                const mappedKey = mapBackendFieldKey(field);
                const message = rest.join(separator).trim();
                if (mappedKey && message) {
                    parsedErrors[mappedKey] = message;
                }
            });
        }

        return parsedErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const newErrors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
            fullName: validateFullName(formData.fullName),
            gender: validateGender(formData.gender),
            dateOfBirth: validateDateOfBirth(formData.dateOfBirth),
            phone: validatePhone(formData.phone),
            address: validateAddress(formData.address),
            role: validateRole(formData.role),
            bloodTypeId: validateBloodTypeId(formData.bloodTypeId),
            cccd: validateCccd(formData.cccd),
            emailOwner: validateEmailOwner(formData.emailOwner),
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some((error) => error !== '');
        if (hasErrors) {
            toast.error('Vui lòng kiểm tra lại thông tin đã nhập.');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                email: formData.email.trim(),
                password: formData.password,
                fullName: formData.fullName.trim(),
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth,
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                role: formData.role,
                bloodTypeId: parseInt(formData.bloodTypeId, 10),
                cccd: formData.cccd.trim(),
                emailOwner: formData.emailOwner.trim(),
            };

            const response = await axiosInstance.post('/account/admin/create', payload);

            if (response.status === 200 || response.status === 201) {
                toast.success(`Tạo tài khoản ${formatRole(formData.role)} thành công!`);
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    fullName: '',
                    gender: '',
                    dateOfBirth: '',
                    phone: '',
                    address: '',
                    role: '',
                    bloodTypeId: '',
                    cccd: '',
                    emailOwner: loggedInAdminEmail,
                });
                setErrors({});
                navigate('/admin-dashboard/user-management/staff-list');
            } else {
                toast.error('Tạo tài khoản thất bại. Vui lòng kiểm tra lại.');
            }
        } catch (error) {
            console.error('Lỗi khi tạo tài khoản:', error);
            const backendData = error.response?.data;
            const backendErrors = parseBackendErrors(backendData);
            if (Object.keys(backendErrors).length > 0) {
                setErrors((prev) => ({ ...prev, ...backendErrors }));
                toast.error('Vui lòng kiểm tra các trường đang báo lỗi.');
            } else if (typeof backendData === 'string' && backendData.trim()) {
                toast.error(backendData);
            } else if (backendData?.message) {
                toast.error(backendData.message);
            } else {
                toast.error('Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.createAccountContainer}>
            <form onSubmit={handleSubmit} className={styles.createAccountForm} noValidate>
                <h2>Tạo Tài Khoản Mới</h2>
                <p className={styles.requiredFieldsMessage}>Vui lòng điền vào tất cả các trường bắt buộc.</p>

                <div className={styles.inputGroup}>
                    <label htmlFor="emailOwner">Email người tạo:</label>
                    <input
                        type="email"
                        id="emailOwner"
                        className={`${styles.inputField} ${errors.emailOwner ? styles.inputError : ''}`}
                        value={formData.emailOwner}
                        readOnly
                        disabled={loading}
                    />
                    {errors.emailOwner && <p className={styles.errorMessage}>{errors.emailOwner}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="role">Vai trò:</label>
                    <select
                        id="role"
                        className={`${styles.inputField} ${errors.role ? styles.inputError : ''}`}
                        value={formData.role}
                        onChange={handleInputChange}
                        disabled={loading}
                    >
                        <option value="">Chọn vai trò</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>
                                {formatRole(role)}
                            </option>
                        ))}
                    </select>
                    {errors.role && <p className={styles.errorMessage}>{errors.role}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                        placeholder="Địa chỉ email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
                        placeholder="Nhập mật khẩu"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className={styles.togglePasswordButton}
                        onClick={handleTogglePasswordVisibility}
                        disabled={loading}
                    >
                        {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                    </button>
                    {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        className={`${styles.inputField} ${errors.confirmPassword ? styles.inputError : ''}`}
                        placeholder="Xác nhận mật khẩu"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className={styles.togglePasswordButton}
                        onClick={handleToggleConfirmPasswordVisibility}
                        disabled={loading}
                    >
                        {showConfirmPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                    </button>
                    {errors.confirmPassword && <p className={styles.errorMessage}>{errors.confirmPassword}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="fullName">Họ và tên:</label>
                    <input
                        type="text"
                        id="fullName"
                        className={`${styles.inputField} ${errors.fullName ? styles.inputError : ''}`}
                        placeholder="Họ và tên"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    {errors.fullName && <p className={styles.errorMessage}>{errors.fullName}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="gender">Giới tính:</label>
                    <select
                        id="gender"
                        className={`${styles.inputField} ${errors.gender ? styles.inputError : ''}`}
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={loading}
                    >
                        <option value="">Chọn giới tính</option>
                        {genders.map((gender) => (
                            <option key={gender} value={gender}>
                                {formatGender(gender)}
                            </option>
                        ))}
                    </select>
                    {errors.gender && <p className={styles.errorMessage}>{errors.gender}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="dateOfBirth">Ngày sinh:</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        className={`${styles.inputField} ${errors.dateOfBirth ? styles.inputError : ''}`}
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    {errors.dateOfBirth && <p className={styles.errorMessage}>{errors.dateOfBirth}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="phone">Số điện thoại:</label>
                    <input
                        type="tel"
                        id="phone"
                        className={`${styles.inputField} ${errors.phone ? styles.inputError : ''}`}
                        placeholder="Số điện thoại (ví dụ: 0912345678)"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="address">Địa chỉ:</label>
                    <input
                        type="text"
                        id="address"
                        className={`${styles.inputField} ${errors.address ? styles.inputError : ''}`}
                        placeholder="Địa chỉ (phải thuộc TP.HCM)"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    {errors.address && <p className={styles.errorMessage}>{errors.address}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="bloodTypeId">Nhóm máu:</label>
                    <select
                        id="bloodTypeId"
                        className={`${styles.inputField} ${errors.bloodTypeId ? styles.inputError : ''}`}
                        value={formData.bloodTypeId}
                        onChange={handleInputChange}
                        disabled={loading}
                    >
                        <option value="">Chọn nhóm máu</option>
                        {staticBloodTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.displayName}
                            </option>
                        ))}
                    </select>
                    {errors.bloodTypeId && <p className={styles.errorMessage}>{errors.bloodTypeId}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="cccd">CCCD:</label>
                    <input
                        type="text"
                        id="cccd"
                        className={`${styles.inputField} ${errors.cccd ? styles.inputError : ''}`}
                        placeholder="Số CCCD (12 chữ số)"
                        value={formData.cccd}
                        onChange={handleInputChange}
                        disabled={loading}
                        maxLength="12"
                    />
                    {errors.cccd && <p className={styles.errorMessage}>{errors.cccd}</p>}
                </div>

                <button type="submit" className={styles.createButton} disabled={loading}>
                    {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
                </button>
                <button type="button" className={styles.backButton} onClick={() => navigate(-1)} disabled={loading}>
                    Quay lại
                </button>
            </form>
        </div>
    );
}

export default CreateAccountForm;
