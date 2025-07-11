import React, { useState } from 'react';
import styles from './login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../configs/axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/features/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email) {
      return 'Bạn cần phải nhập email.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Định dạng email không hợp lệ.';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Bạn cần phải nhập mật khẩu.';
    }
    return '';
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail));
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailValidationMessage = validateEmail(email);
    const passwordValidationMessage = validatePassword(password);

    setEmailError(emailValidationMessage);
    setPasswordError(passwordValidationMessage);

    if (emailValidationMessage || passwordValidationMessage) {
      toast.error('Vui lòng sửa lỗi trong biểu mẫu.');
      return;
    }

    try {
      const response = await api.post('login', {
        email: email,
        password: password,
      });

      const userData = response.data;
      if (!userData?.token) {
        toast.error('Phản hồi đăng nhập không hợp lệ từ máy chủ.');
        return;
      }
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch(login(userData));
      toast.success('Login successful!');

      if (userData.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (userData.role === 'STAFF') {
        navigate('/staff-dashboard');
      } else if (userData.role === 'MEMBER') {
        navigate('/member');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Đăng nhập không thành công! Vui lòng kiểm tra thông tin đăng nhập của bạn.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Đăng Nhập</h2>

        <div className={styles.inputGroup}>
          <input
            type="text"
            id="email"
            className={`${styles.inputField} ${emailError ? styles.inputError : ''}`}
            placeholder="Email address"
            value={email}
            onChange={handleEmailChange}
            required
          />
          {emailError && <p className={styles.errorMessage}>{emailError}</p>}
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className={`${styles.inputField} ${passwordError ? styles.inputError : ''}`}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <span className={styles.eyeIcon} onClick={handleTogglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
            </div>
            {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
        </div>

        <div className={styles.forgotPassword}>
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>

        <button type="submit" className={styles.loginButton}>
          Đăng Nhập
        </button>

        <div className={styles.signupPrompt}>
          Bạn không có tài khoản? <Link to="/register">Đăng ký</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;