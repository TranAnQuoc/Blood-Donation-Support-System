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
    const user = useSelector(state => state.user); 
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
        emailOwner: loggedInAdminEmail
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const staticBloodTypes = [
        { id: 1, type: 'UNKNOWN', rhFactor: 'UNKNOWN', displayName: 'Không xác định' },
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
    const roles = ['STAFF', 'ADMIN'];

    useEffect(() => {
        if (loggedInAdminEmail && formData.emailOwner !== loggedInAdminEmail) {
            setFormData(prevData => ({
                ...prevData,
                emailOwner: loggedInAdminEmail
            }));
        }
    }, [loggedInAdminEmail, formData.emailOwner]);


    const validateEmail = (email) => {
        if (!email) return 'Email là bắt buộc.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không đúng định dạng.';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Mật khẩu là bắt buộc.';
        if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(password)) {
            return 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&).';
        }
        return '';
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return 'Xác nhận mật khẩu là bắt buộc.';
        if (confirmPassword !== password) return 'Mật khẩu và xác nhận mật khẩu không khớp.';
        return '';
    };

    const validateFullName = (fullName) => {
        if (!fullName) return 'Họ và tên là bắt buộc.';
        if (fullName.length < 3) return 'Họ và tên phải có ít nhất 3 ký tự.';
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
        if (birthDate.isAfter(today)) return 'Ngày sinh không hợp lệ.';
        if (today.diff(birthDate, 'year') < 18) return 'Người dùng phải đủ 18 tuổi.';
        return '';
    };

    const validatePhone = (phone) => {
        if (!phone) return 'Số điện thoại là bắt buộc.';
        if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phone)) return 'Số điện thoại không đúng định dạng.';
        return '';
    };

    const validateAddress = (address) => {
        if (!address) return 'Địa chỉ là bắt buộc.';
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
        if (!cccd) return 'CCCD là bắt buộc.';
        if (!/^\d{12}$/.test(cccd)) return 'CCCD phải có 12 chữ số.'; 
        return '';
    };

    // MỚI: Validation cho emailOwner
    const validateEmailOwner = (emailOwner) => {
        if (!emailOwner) return 'Email người tạo là bắt buộc.';
        return '';
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));

        let errorMessage = '';
        switch (id) {
            case 'email':
                errorMessage = validateEmail(value);
                break;
            case 'password':
                errorMessage = validatePassword(value);
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: validateConfirmPassword(formData.confirmPassword, value)
                }));
                break;
            case 'confirmPassword':
                errorMessage = validateConfirmPassword(value, formData.password);
                break;
            case 'fullName':
                errorMessage = validateFullName(value);
                break;
            case 'gender':
                errorMessage = validateGender(value);
                break;
            case 'dateOfBirth':
                errorMessage = validateDateOfBirth(value);
                break;
            case 'phone':
                errorMessage = validatePhone(value);
                break;
            case 'address':
                errorMessage = validateAddress(value);
                break;
            case 'role':
                errorMessage = validateRole(value);
                break;
            case 'bloodTypeId': 
                errorMessage = validateBloodTypeId(value);
                break;
            case 'cccd': 
                errorMessage = validateCccd(value);
                break;
            // case 'emailOwner': // emailOwner sẽ được tự động điền, không cần validation trên input
            //     errorMessage = validateEmailOwner(value);
            //     break;
            default:
                break;
        }
        setErrors(prev => ({ ...prev, [id]: errorMessage }));
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrors({}); 

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
            emailOwner: validateEmailOwner(formData.emailOwner)
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== '');
        if (hasErrors) {
            toast.error('Vui lòng điền đầy đủ và đúng thông tin.');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth, 
                phone: formData.phone,
                address: formData.address,
                role: formData.role,
                bloodTypeId: parseInt(formData.bloodTypeId, 10), 
                cccd: formData.cccd,
                emailOwner: formData.emailOwner
            };

            const response = await axiosInstance.post('/account/admin/create', payload);

            if (response.status === 200 || response.status === 201) {
                toast.success(`Tạo tài khoản ${formData.role} thành công!`);
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
                    emailOwner: loggedInAdminEmail
                });
                navigate('/admin-dashboard/user-management/staff-list'); 
            } else {
                toast.error('Tạo tài khoản thất bại! Vui lòng kiểm tra lại.');
            }
        } catch (error) {
            console.error('Lỗi khi tạo tài khoản:', error);
            if (error.response?.data?.message) {
                toast.error(`Lỗi: ${error.response.data.message}`);
            } else {
                toast.error('Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.createAccountContainer}>
            <form onSubmit={handleSubmit} className={styles.createAccountForm}>
                <h2>Tạo Tài Khoản Mới</h2>
                <p className={styles.requiredFieldsMessage}>
                    Vui lòng điền vào tất cả các trường bắt buộc.
                </p>
                
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
                        required
                        disabled={loading}
                    >
                        <option value="">Chọn vai trò</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
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
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
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
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
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
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
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
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
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
                        required
                        disabled={loading}
                    >
                        <option value="">Chọn giới tính</option>
                        {genders.map(gender => (
                            <option key={gender} value={gender}>{gender}</option>
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
                        required
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
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
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
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
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
                        required
                        disabled={loading}
                    >
                        <option value="">Chọn nhóm máu</option>
                        {staticBloodTypes.map(type => (
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
                        required
                        disabled={loading}
                        maxLength="12" 
                    />
                    {errors.cccd && <p className={styles.errorMessage}>{errors.cccd}</p>}
                </div>

                <button type="submit" className={styles.createButton} disabled={loading}>
                    {loading ? 'Đang tạo...' : 'Tạo Tài Khoản'}
                </button>
                <button type="button" className={styles.backButton} onClick={() => navigate(-1)} disabled={loading}>
                    Quay lại
                </button>
            </form>
        </div>
    );
}

export default CreateAccountForm;
