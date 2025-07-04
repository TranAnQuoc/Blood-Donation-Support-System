import React, { useState } from "react";
import axiosInstance from "../../../configs/axios";
import { toast } from "react-toastify";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    if (!email) {
      return "Email là bắt buộc.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Định dạng email không hợp lệ.";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationMessage = validateEmail(email);
    setEmailError(validationMessage);

    if (validationMessage) {
      toast.error("Vui lòng nhập đúng định dạng email.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/forgot-password-request", { email });
      toast.success(
        "Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn!"
      );
      console.log("Yêu cầu đặt lại mật khẩu thành công:", response.data);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu đặt lại mật khẩu:",error.response?.data?.message || error.message);
      toast.error(`Lỗi: ${error.response?.data?.message || "Không thể gửi yêu cầu. Vui lòng thử lại."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2 className={styles.formTitle}>Quên Mật Khẩu</h2>
        <p className={styles.formDescription}>
          Vui lòng nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className={`${styles.inputField} ${ emailError ? styles.inputError : "" }`}
            value={email}
            onChange={handleEmailChange}
            required
            disabled={loading}
          />
          {emailError && <p className={styles.errorMessage}>{emailError}</p>}
        </div>
        <button type="submit" className={styles.formButton} disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi Yêu Cầu"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
