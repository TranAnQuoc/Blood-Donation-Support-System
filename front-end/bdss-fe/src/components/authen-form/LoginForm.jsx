import React, { useState } from 'react';
import styles from './login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../configs/axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/features/userSlice';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('login', {
        email: email,
        password: password,
      });

      const userData = response.data.data;
      localStorage.setItem('token', userData.token);
      dispatch(login(userData));

      if (userData.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || 'Login failed!');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            id="email"
            className={styles.inputField}
            placeholder="Email address"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className={styles.inputField}
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
            {showPassword ? 'Hide' : 'Show'}
          </button>
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
