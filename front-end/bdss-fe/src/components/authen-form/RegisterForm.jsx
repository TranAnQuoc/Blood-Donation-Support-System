import React, { useState } from 'react';
import styles from './register.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function RegisterForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        gender: '',
        bloodTypeId: '',
        dateOfBirth: '',
        phone: '',
        address: ''
    });

    // State for validation errors
    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    // --- Validation Functions ---
    const validateEmail = (email) => {
        if (!email) return 'Email là bắt buộc.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không đúng định dạng.';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Mật khẩu là bắt buộc.';
        if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
        // Có thể thêm regex để yêu cầu chữ hoa, chữ thường, số, ký tự đặc biệt
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(password)) {
          return 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.';
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

    // eslint-disable-next-line no-unused-vars
    const validateBloodType = (bloodTypeId) => {
        // bloodTypeId có thể là rỗng hoặc "null" từ select, không cần validate nếu bạn cho phép "Unknow"
        // if (!bloodTypeId || bloodTypeId === 'null') return 'Nhóm máu là bắt buộc.';
        return '';
    };

    const validateDateOfBirth = (dateOfBirth) => {
        if (!dateOfBirth) return 'Ngày sinh là bắt buộc.';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        if (birthDate >= today) return 'Ngày sinh không hợp lệ.';
        return '';
    };

    const validatePhone = (phone) => {
        if (!phone) return 'Số điện thoại là bắt buộc.';
        // Regex cho số điện thoại Việt Nam (10 chữ số, bắt đầu bằng 0)
        if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phone)) return 'Số điện thoại không đúng định dạng.';
        return '';
    };

    const validateAddress = (address) => {
        if (!address) return 'Địa chỉ là bắt buộc.';
        return '';
    };

    // --- Event Handlers ---
    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));

        // Validate on change
        let errorMessage = '';
        switch (id) {
            case 'email':
                errorMessage = validateEmail(value);
                break;
            case 'password':
                errorMessage = validatePassword(value);
                // Re-validate confirm password if password changes
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
            case 'bloodTypeId':
                errorMessage = validateBloodType(value);
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

        // Validate all fields on submit
        const newErrors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
            fullName: validateFullName(formData.fullName),
            gender: validateGender(formData.gender),
            bloodTypeId: validateBloodType(formData.bloodTypeId), // Nếu bạn muốn bắt buộc chọn
            dateOfBirth: validateDateOfBirth(formData.dateOfBirth),
            phone: validatePhone(formData.phone),
            address: validateAddress(formData.address)
        };

        setErrors(newErrors);

        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some(error => error !== '');
        if (hasErrors) {
            toast.error('Vui lòng điền đầy đủ và đúng thông tin.');
            return;
        }

        try {
            const payload = {
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                gender: formData.gender,
                bloodTypeId: formData.bloodTypeId === '' || formData.bloodTypeId === 'null'
                    ? null
                    : Number(formData.bloodTypeId),
                dateOfBirth: formData.dateOfBirth,
                phone: formData.phone,
                address: formData.address
            };

            const response = await axios.post('http://localhost:8080/api/register', payload);

            if (response.status === 200 || response.status === 201) {
                toast.success('Đăng ký thành công! Vui lòng đăng nhập để truy cập tài khoản của bạn.');
                navigate('/login');
            } else {
                toast.error('Đăng ký thất bại! Vui lòng kiểm tra lại.');
            }
        } catch (error) {
            console.error('Đăng ký lỗi:', error);
            if (error.response?.data?.message) {
                toast.error(`Lỗi: ${error.response.data.message}`);
            } else {
                toast.error('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
            }
        }
    };

    const bloodTypes = [
        { label: 'A+', id: '1' },
        { label: 'A-', id: '2' },
        { label: 'B+', id: '3' },
        { label: 'B-', id: '4' },
        { label: 'AB+', id: '5' },
        { label: 'AB-', id: '6' },
        { label: 'O+', id: '7' },
        { label: 'O-', id: '8' }
    ];

    const genders = ['MALE', 'FEMALE', 'OTHER'];

    return (
        <div className={styles.registerContainer}>
            <form onSubmit={handleSubmit} className={styles.registerForm}>
                <h2>Register</h2>

                <div className={styles.inputGroup}>
                    <input
                        type="email"
                        id="email"
                        className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    <button
                        type="button"
                        className={styles.togglePasswordButton}
                        onClick={handleTogglePasswordVisibility}
                    >
                        {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                    </button>
                    {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        className={`${styles.inputField} ${errors.confirmPassword ? styles.inputError : ''}`}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                    <button
                        type="button"
                        className={styles.togglePasswordButton}
                        onClick={handleToggleConfirmPasswordVisibility}
                    >
                        {showConfirmPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                    </button>
                    {errors.confirmPassword && <p className={styles.errorMessage}>{errors.confirmPassword}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        id="fullName"
                        className={`${styles.inputField} ${errors.fullName ? styles.inputError : ''}`}
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.fullName && <p className={styles.errorMessage}>{errors.fullName}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <select
                        id="gender"
                        className={`${styles.inputField} ${errors.gender ? styles.inputError : ''}`}
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        {genders.map(gender => (
                            <option key={gender} value={gender}>{gender}</option>
                        ))}
                    </select>
                    {errors.gender && <p className={styles.errorMessage}>{errors.gender}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <select
                        id="bloodTypeId"
                        className={`${styles.inputField} ${errors.bloodTypeId ? styles.inputError : ''}`}
                        value={formData.bloodTypeId}
                        onChange={handleInputChange}
                        required // Bạn có thể bỏ required nếu muốn cho phép "Unknow" mà không cần chọn
                    >
                        <option value="">Select Blood Type</option>
                        <option value="null">Unknow</option>
                        {bloodTypes.map(bt => (
                            <option key={bt.id} value={bt.id}>{bt.label}</option>
                        ))}
                    </select>
                    {errors.bloodTypeId && <p className={styles.errorMessage}>{errors.bloodTypeId}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="date"
                        id="dateOfBirth"
                        className={`${styles.inputField} ${errors.dateOfBirth ? styles.inputError : ''}`}
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.dateOfBirth && <p className={styles.errorMessage}>{errors.dateOfBirth}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="tel"
                        id="phone"
                        className={`${styles.inputField} ${errors.phone ? styles.inputError : ''}`}
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        id="address"
                        className={`${styles.inputField} ${errors.address ? styles.inputError : ''}`}
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.address && <p className={styles.errorMessage}>{errors.address}</p>}
                </div>

                <button type="submit" className={styles.registerButton}>
                    Register
                </button>
                <div className={styles.loginPrompt}>
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;