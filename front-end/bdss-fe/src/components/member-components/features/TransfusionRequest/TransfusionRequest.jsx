import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../../configs/axios';
import styles from './TransfusionRequest.module.css';
import { toast } from 'react-toastify';

const TransfusionRequest = () => {
    const user = useSelector((state) => state.user);
    const userId = user ? user.id : null;

    const [requestData, setRequestData] = useState({
        bloodComponentNeeded: '',
        quantityNeeded: '',
        doctorDiagnosis: '',
        preCheckNotes: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRequestData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!userId) {
                toast.error('Lỗi: Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.'); // Hiển thị toast lỗi
                setLoading(false);
                return;
            }
            if (!requestData.bloodComponentNeeded || !requestData.quantityNeeded ||
                !requestData.doctorDiagnosis || !requestData.preCheckNotes) {
                toast.error('Vui lòng điền đầy đủ tất cả các trường cần thiết.'); // Hiển thị toast lỗi
                setLoading(false);
                return;
            }

            const payload = {
                recipientId: userId,
                bloodComponentNeeded: requestData.bloodComponentNeeded,
                quantityNeeded: parseInt(requestData.quantityNeeded),
                doctorDiagnosis: requestData.doctorDiagnosis,
                preCheckNotes: requestData.preCheckNotes
            };

            const response = await axiosInstance.post('/transfusions/requests', payload);

            toast.success('Yêu cầu truyền máu đã được gửi thành công!');
            console.log('Phản hồi từ backend:', response.data);

            setRequestData({
                bloodComponentNeeded: '',
                quantityNeeded: '',
                doctorDiagnosis: '',
                preCheckNotes: ''
            });

        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu truyền máu:', error);
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2>Gửi Yêu Cầu Truyền Máu</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="bloodComponentNeeded">Thành phần máu cần:</label>
                    <input
                        type="text"
                        id="bloodComponentNeeded"
                        name="bloodComponentNeeded"
                        value={requestData.bloodComponentNeeded}
                        onChange={handleChange}
                        placeholder="VD: WHOLE_BLOOD, PLATELETS, PLASMA, OTHER"
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="quantityNeeded">Lượng cần (ml):</label>
                    <input
                        type="number"
                        id="quantityNeeded"
                        name="quantityNeeded"
                        value={requestData.quantityNeeded}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="doctorDiagnosis">Chẩn đoán của bác sĩ:</label>
                    <textarea
                        id="doctorDiagnosis"
                        name="doctorDiagnosis"
                        value={requestData.doctorDiagnosis}
                        onChange={handleChange}
                        rows="3"
                        required
                    ></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="preCheckNotes">Ghi chú tiền kiểm tra:</label>
                    <textarea
                        id="preCheckNotes"
                        name="preCheckNotes"
                        value={requestData.preCheckNotes}
                        onChange={handleChange}
                        rows="3"
                        required
                    ></textarea>
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                </button>
            </form>
        </div>
    );
};

export default TransfusionRequest;