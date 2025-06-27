import React, { useState } from 'react';
import styles from './login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../configs/axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/features/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // faEye for "show", faEyeSlash for "hide"

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
      return 'Email is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format.';
    }
    return ''; // No error
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required.';
    }
    return ''; // No error
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
      toast.error('Please correct the errors in the form.');
      return;
    }

    try {
      const response = await api.post('login', {
        email: email,
        password: password,
      });

      const userData = response.data;
      if (!userData?.token) {
        toast.error('Invalid login response from server');
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
      toast.error(error.response?.data?.message || 'Login failed! Please check your credentials.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Login</h2>

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
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className={`${styles.inputField} ${passwordError ? styles.inputError : ''}`}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button
            type="button"
            className={styles.togglePasswordButton}
            onClick={handleTogglePasswordVisibility}
          >
            {showPassword ? (
              <FontAwesomeIcon icon={faEyeSlash} />
            ) : (
              <FontAwesomeIcon icon={faEye} />
            )}
          </button>
          {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
        </div>
        <div className={styles.forgotPassword}>
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit" className={styles.loginButton}>
          Log In
        </button>
        <div className={styles.signupPrompt}>
          Don't have an account? <Link to="/register">Signup</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;