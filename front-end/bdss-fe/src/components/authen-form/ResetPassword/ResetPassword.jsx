import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../configs/axios';
import { toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
        } else {
            setError('Không tìm thấy mã token đặt lại mật khẩu. Vui lòng kiểm tra lại liên kết.');
            toast.error('Mã token không hợp lệ hoặc đã hết hạn.');
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        const passwordRequirementsMessage = 'Mật khẩu phải có ít nhất 6 ký tự, chứa 1 chữ hoa, 1 chữ thường, 1 số và 1 trong các ký tự đặc biệt sau: @$!%*?&';

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }
        if (!token) {
            setError('Không có mã token để đặt lại mật khẩu.');
            toast.error('Không có mã token để đặt lại mật khẩu.');
            return;
        }
        if (!passwordRegex.test(newPassword)) {
            setError(passwordRequirementsMessage);
            toast.error(passwordRequirementsMessage);
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post('/reset-password-request', {
                token: token,
                newPassword: newPassword,
            });
            setSuccessMessage('Mật khẩu của bạn đã được đặt lại thành công! Vui lòng đăng nhập.');
            toast.success('Mật khẩu của bạn đã được đặt lại thành công! Vui lòng đăng nhập.');
            console.log('Đặt lại mật khẩu thành công:', response.data);

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Lỗi khi đặt lại mật khẩu:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
            toast.error(`Lỗi: ${err.response?.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <h2 className={styles.formTitle}>Đặt Lại Mật Khẩu</h2>
                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                {error && <div className={styles.errorMessage}>{error}</div>}
                <div className={styles.formGroup}>
                    <label htmlFor="newPassword">Mật khẩu mới:</label>
                    <div className={styles.passwordInputWrapper}>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            id="newPassword"
                            className={`${styles.inputField} ${error && newPassword && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(newPassword) ? styles.inputError : ''}`}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className={styles.togglePasswordButton}
                            onClick={handleToggleNewPasswordVisibility}
                        >
                            <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu mới:</label>
                    <div className={styles.passwordInputWrapper}>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            className={`${styles.inputField} ${error && newPassword !== confirmPassword ? styles.inputError : ''}`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className={styles.togglePasswordButton}
                            onClick={handleToggleConfirmPasswordVisibility}
                        >
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                </div>
                <button type="submit" className={styles.formButton} disabled={loading}>
                    {loading ? 'Đang đặt lại...' : 'Đặt Lại Mật Khẩu'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
