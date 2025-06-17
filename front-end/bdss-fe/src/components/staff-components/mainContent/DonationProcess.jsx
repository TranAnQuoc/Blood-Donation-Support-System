// src/components/staff-components/mainContent/DonationProcess.jsx
import React, { useState, useEffect } from 'react';
import styles from './DonationProcess.module.css';

// Giả định các trạng thái quy trình
const PROCESS_STEPS = [
    { id: 'REGISTRATION_CHECK', name: 'Đăng ký & Kiểm tra sức khỏe' },
    { id: 'BLOOD_COLLECTION', name: 'Lấy máu' },
    { id: 'POST_DONATION_CARE', name: 'Chăm sóc sau hiến máu' },
    { id: 'COMPLETED', name: 'Hoàn thành' }
];

const DonationProcess = ({ donationRequestId }) => { // Nhận ID yêu cầu hiến máu từ props hoặc URL
    const [currentProcess, setCurrentProcess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentStepId, setCurrentStepId] = useState(''); // Trạng thái hiện tại của quá trình
    const [notes, setNotes] = useState(''); // Ghi chú cho từng bước

    // Tải thông tin quá trình khi component mount hoặc donationRequestId thay đổi
    useEffect(() => {
        if (donationRequestId) {
            fetchProcessDetails(donationRequestId);
        } else {
            // Có thể hiển thị form để nhập ID hoặc tạo mới
            console.warn("donationRequestId không được cung cấp. Cần ID để tải quá trình.");
            setIsLoading(false);
        }
    }, [donationRequestId]);

    const fetchProcessDetails = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            // API để lấy thông tin quá trình hiến máu đang diễn ra hoặc đã có
            // Dựa trên backend của bạn, có thể là GET /api/donation-process/{id}
            const response = await fetch(`http://localhost:8080/api/donation/process/${id}`, {
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể tải chi tiết quá trình hiến máu.');
            }

            const data = await response.json();
            setCurrentProcess(data);
            setCurrentStepId(data.currentStatus || PROCESS_STEPS[0].id); // Lấy trạng thái hiện tại từ API
            setNotes(data.notes || '');
        } catch (err) {
            console.error("Lỗi khi tải quá trình hiến máu:", err);
            setError(err.message);
            setCurrentProcess(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProcess = async (newStatusId) => {
        setIsLoading(true);
        setError(null);
        try {
            // API để cập nhật trạng thái/bước của quá trình hiến máu
            // Dựa trên backend của bạn, có thể là PUT /api/donation-process/{id}
            const response = await fetch(`http://localhost:8080/api/donation/process/${currentProcess.id}`, {
                method: 'PUT',
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...currentProcess, // Giữ lại các thông tin khác
                    currentStatus: newStatusId,
                    notes: notes,
                    // Có thể thêm userId, donorId nếu cần thiết cho API của bạn
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Cập nhật quá trình hiến máu thất bại.');
            }

            const data = await response.json();
            setCurrentProcess(data);
            setCurrentStepId(data.currentStatus);
            alert(`Cập nhật trạng thái thành công: ${PROCESS_STEPS.find(s => s.id === data.currentStatus)?.name}`);
        } catch (err) {
            console.error("Lỗi khi cập nhật quá trình hiến máu:", err);
            setError(err.message);
            alert(`Lỗi: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm để chuyển sang bước tiếp theo
    const handleNextStep = () => {
        const currentIndex = PROCESS_STEPS.findIndex(step => step.id === currentStepId);
        if (currentIndex < PROCESS_STEPS.length - 1) {
            const nextStep = PROCESS_STEPS[currentIndex + 1];
            handleUpdateProcess(nextStep.id);
        } else {
            alert('Quy trình đã hoàn tất!');
        }
    };

    const handlePrevStep = () => {
        const currentIndex = PROCESS_STEPS.findIndex(step => step.id === currentStepId);
        if (currentIndex > 0) {
            const prevStep = PROCESS_STEPS[currentIndex - 1];
            handleUpdateProcess(prevStep.id);
        }
    };

    const renderStepContent = (stepId) => {
        switch (stepId) {
            case 'REGISTRATION_CHECK':
                return (
                    <ul>
                        <li>Kiểm tra thông tin đăng ký và lịch sử y tế.</li>
                        <li>Đo huyết áp, nhịp tim, nhiệt độ, xét nghiệm nhanh Hemoglobin.</li>
                        <li>Khám tổng quát và tư vấn với bác sĩ.</li>
                    </ul>
                );
            case 'BLOOD_COLLECTION':
                return (
                    <ul>
                        <li>Sát trùng vị trí lấy máu, đặt kim vô trùng.</li>
                        <li>Thu thập máu vào túi chuyên dụng (10-15 phút).</li>
                        <li>Rút kim và băng ép.</li>
                    </ul>
                );
            case 'POST_DONATION_CARE':
                return (
                    <ul>
                        <li>Nghỉ ngơi tại chỗ 10-15 phút.</li>
                        <li>Uống nước và ăn nhẹ để phục hồi.</li>
                        <li>Theo dõi các dấu hiệu bất thường, tư vấn chăm sóc tại nhà.</li>
                    </ul>
                );
            case 'COMPLETED':
                return <p>Quy trình hiến máu đã hoàn tất. Cảm ơn sự đóng góp của bạn!</p>;
            default:
                return <p>Đang chờ bắt đầu quy trình.</p>;
        }
    };

    if (isLoading && !currentProcess) {
        return <div className={styles.loadingMessage}>Đang tải chi tiết quá trình...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>Lỗi: {error}</div>;
    }

    if (!currentProcess && !donationRequestId) {
        // Có thể hiển thị form để nhập ID yêu cầu hoặc ID người hiến để bắt đầu/tìm kiếm quá trình
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Quản Lý Quy Trình Hiến Máu</h2>
                <p className={styles.introText}>Vui lòng cung cấp ID yêu cầu hiến máu để quản lý quá trình.</p>
                {/* Đây là nơi bạn có thể thêm input để nhập ID và nút submit */}
                <p>Ví dụ: `<DonationProcess donationRequestId="123" />`</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quản Lý Quy Trình Hiến Máu</h2>
            {currentProcess && (
                <p className={styles.processInfo}>
                    **Mã Yêu Cầu Hiến Máu:** {currentProcess.donationRequestId || donationRequestId} |
                    **Người Hiến:** {currentProcess.donorName || 'Chưa có thông tin'} |
                    **Nhóm Máu:** {currentProcess.bloodType || 'N/A'}
                </p>
            )}

            <div className={styles.processTracker}>
                {PROCESS_STEPS.map((step, index) => (
                    <div
                        key={step.id}
                        className={`${styles.stepIndicator} ${currentStepId === step.id ? styles.activeStep : ''} ${
                            PROCESS_STEPS.findIndex(s => s.id === currentStepId) > index ? styles.completedStep : ''
                        }`}
                    >
                        <span className={styles.stepNumber}>{index + 1}</span>
                        <span className={styles.stepName}>{step.name}</span>
                    </div>
                ))}
            </div>

            <div className={styles.currentStepContent}>
                <h3 className={styles.currentStepTitle}>
                    Bước Hiện Tại: {PROCESS_STEPS.find(step => step.id === currentStepId)?.name || 'Chưa bắt đầu'}
                </h3>
                {renderStepContent(currentStepId)}

                <div className={styles.formGroup}>
                    <label htmlFor="notes">Ghi chú quá trình:</label>
                    <textarea
                        id="notes"
                        className={styles.notesTextarea}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Thêm ghi chú về quá trình hiến máu..."
                    />
                </div>

                <div className={styles.actionButtons}>
                    <button
                        className={styles.prevButton}
                        onClick={handlePrevStep}
                        disabled={isLoading || PROCESS_STEPS.findIndex(step => step.id === currentStepId) === 0}
                    >
                        &lt; Bước trước
                    </button>
                    <button
                        className={styles.nextButton}
                        onClick={handleNextStep}
                        disabled={isLoading || currentStepId === 'COMPLETED'}
                    >
                        {currentStepId === 'COMPLETED' ? 'Hoàn thành' : 'Bước tiếp theo >'}
                    </button>
                </div>
            </div>

            <p className={styles.footerText}>
                Theo dõi và quản lý quá trình hiến máu để đảm bảo an toàn và hiệu quả.
            </p>
        </div>
    );
};

export default DonationProcess;