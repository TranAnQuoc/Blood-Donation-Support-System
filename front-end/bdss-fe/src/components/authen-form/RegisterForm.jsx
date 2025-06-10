import React, { useState } from 'react';
import styles from './register.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu và xác nhận mật khẩu không khớp!');
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
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                navigate('/login');
            } else {
                alert('Đăng ký thất bại! Vui lòng kiểm tra lại.');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                alert(`Lỗi: ${error.response.data.message}`);
            } else {
                alert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
            }
            console.error('Đăng ký lỗi:', error);
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

    const genders = ['Male', 'Female', 'Other'];

    return (
        <div className={styles.registerContainer}>
            <form onSubmit={handleSubmit} className={styles.registerForm}>
                <h2>Register</h2>

                <div className={styles.inputGroup}>
                    <input
                        type="email"
                        id="email"
                        className={styles.inputField}
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className={styles.inputField}
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    <button
                        type="button"
                        className={styles.togglePasswordButton}
                        onClick={handleTogglePasswordVisibility}
                    ></button>
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        className={styles.inputField}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                    <button
                        type="button"
                        className={styles.togglePasswordButton}
                        onClick={handleToggleConfirmPasswordVisibility}
                    ></button>
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        id="fullName"
                        className={styles.inputField}
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <select
                        id="gender"
                        className={styles.inputField}
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        {genders.map(gender => (
                            <option key={gender} value={gender}>{gender}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <select
                        id="bloodTypeId"
                        className={styles.inputField}
                        value={formData.bloodTypeId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Blood Type</option> {/* Dòng hiển thị mặc định */}
                        <option value="null">Unknow</option>        {/* Dòng cho phép giá trị null */}
                        {bloodTypes.map(bt => (
                            <option key={bt.id} value={bt.id}>{bt.label}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="date"
                        id="dateOfBirth"
                        className={styles.inputField}
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="tel"
                        id="phone"
                        className={styles.inputField}
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        id="address"
                        className={styles.inputField}
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
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
