import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./TransfusionRequest.module.css";

const API_CREATE_REQUEST_URL = "http://localhost:8080/api/transfusion-requests"; // Adjust if your base URL is different

// Utility function to get auth token
const getAuthToken = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            const userObj = JSON.parse(userString);
            return userObj.token || null;
        } catch (e) {
            console.error("Error parsing user from localStorage:", e);
            return null;
        }
    }
    return null;
};

const CreateTransfusionRequest = () => {
    const [formData, setFormData] = useState({
        bloodComponentNeeded: "",
        quantityNeeded: "", // Will be parsed to number
        doctorDiagnosis: "",
        preCheckNotes: "",
        address: "", // Added new field for address
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = getAuthToken();
        if (!token) {
            toast.error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
            setLoading(false);
            return;
        }

        // Basic validation for required fields
        if (
            !formData.bloodComponentNeeded ||
            !formData.quantityNeeded ||
            !formData.doctorDiagnosis ||
            !formData.address // Added address to required fields
        ) {
            toast.error("Vui lòng điền đầy đủ các trường bắt buộc (Thành phần máu, Số lượng, Chẩn đoán của bác sĩ, Địa chỉ).");
            setLoading(false);
            return;
        }

        // Ensure quantityNeeded is a valid number
        const parsedQuantity = parseInt(formData.quantityNeeded, 10);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            toast.error("Số lượng cần thiết phải là một số nguyên dương.");
            setLoading(false);
            return;
        }

        const payload = {
            bloodComponentNeeded: formData.bloodComponentNeeded,
            quantityNeeded: parsedQuantity,
            doctorDiagnosis: formData.doctorDiagnosis,
            preCheckNotes: formData.preCheckNotes,
            address: formData.address, // Include address in the payload
        };

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(API_CREATE_REQUEST_URL, payload, config);

            if (response.status === 200) {
                toast.success("Yêu cầu truyền máu đã được tạo thành công!");
                // Optionally clear the form after successful submission
                setFormData({
                    bloodComponentNeeded: "",
                    quantityNeeded: "",
                    doctorDiagnosis: "",
                    preCheckNotes: "",
                    address: "",
                });
            } else {
                toast.warn("Không thể tạo yêu cầu truyền máu. Vui lòng thử lại.");
            }
        } catch (err) {
            console.error("Lỗi khi tạo yêu cầu truyền máu:", err);
            if (err.response) {
                console.error("Server response:", err.response.data);
                if (err.response.status === 403) {
                    toast.error("Bạn không có quyền tạo yêu cầu truyền máu.");
                } else if (err.response.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                } else {
                    // Check for specific backend validation error message
                    if (err.response.data && err.response.data.message) {
                         toast.error(`Lỗi: ${err.response.data.message}`);
                    } else {
                        toast.error(`Lỗi: ${err.message}`);
                    }
                }
            } else if (err.request) {
                toast.error("Không thể kết nối đến máy chủ.");
            } else {
                toast.error("Đã xảy ra lỗi không xác định.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Tạo Yêu Cầu Truyền Máu</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="bloodComponentNeeded">Thành phần máu cần thiết:</label>
                    <input
                        type="text"
                        id="bloodComponentNeeded"
                        name="bloodComponentNeeded"
                        value={formData.bloodComponentNeeded}
                        onChange={handleChange}
                        className={styles.input}
                        required
                        placeholder="Ví dụ: Hồng cầu, Huyết tương..."
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="quantityNeeded">Số lượng cần thiết (ml):</label>
                    <input
                        type="number"
                        id="quantityNeeded"
                        name="quantityNeeded"
                        value={formData.quantityNeeded}
                        onChange={handleChange}
                        className={styles.input}
                        required
                        min="1" // Ensure quantity is positive
                        placeholder="Ví dụ: 250, 500..."
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="doctorDiagnosis">Chẩn đoán của bác sĩ:</label>
                    <textarea
                        id="doctorDiagnosis"
                        name="doctorDiagnosis"
                        value={formData.doctorDiagnosis}
                        onChange={handleChange}
                        className={styles.textarea}
                        required
                        rows="4"
                        placeholder="Mô tả chẩn đoán của bác sĩ..."
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="preCheckNotes">Ghi chú tiền kiểm tra (Tùy chọn):</label>
                    <textarea
                        id="preCheckNotes"
                        name="preCheckNotes"
                        value={formData.preCheckNotes}
                        onChange={handleChange}
                        className={styles.textarea}
                        rows="3"
                        placeholder="Các ghi chú về tiền kiểm tra (ví dụ: tiền sử dị ứng)..."
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="address">Địa chỉ cần truyền máu:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={styles.input}
                        required // Mark as required
                        placeholder="Nhập địa chỉ đầy đủ (ví dụ: 123 Đường ABC, Quận XYZ, TP.HCM)"
                    />
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? "Đang gửi yêu cầu..." : "Gửi Yêu Cầu Truyền Máu"}
                </button>
            </form>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default CreateTransfusionRequest;