// src/components/staff-components/mainContent/EmergencyTransfusionProcess.jsx
import React, { useState, useEffect } from 'react';
import styles from './EmergencyTransfusionProcess.module.css';

// Giả định các trạng thái quy trình truyền máu khẩn cấp
const PROCESS_STEPS = [
    { id: 'RAPID_ASSESSMENT', name: 'Đánh giá Nhanh & Chỉ định' },
    { id: 'IMMEDIATE_TRANSFUSION_PREP', name: 'Chuẩn bị & Truyền ngay' },
    { id: 'CONTINUOUS_MONITORING', name: 'Theo dõi Liên tục' },
    { id: 'POST_EMERGENCY_CARE', name: 'Chăm sóc Hậu Khẩn cấp' },
    { id: 'COMPLETED', name: 'Hoàn thành' }
];

const EmergencyTransfusionProcess = ({ emergencyTransfusionRequestId }) => { // Nhận ID yêu cầu khẩn cấp
    const [currentProcess, setCurrentProcess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentStepId, setCurrentStepId] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (emergencyTransfusionRequestId) {
            fetchProcessDetails(emergencyTransfusionRequestId);
        } else {
            console.warn("emergencyTransfusionRequestId không được cung cấp. Cần ID để tải quá trình.");
            setIsLoading(false);
        }
    }, [emergencyTransfusionRequestId]);

    const fetchProcessDetails = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            // API để lấy thông tin quá trình truyền máu khẩn cấp
            // Có thể là GET /api/emergency-transfusion-process/{id}
            const response = await fetch(`http://localhost:8080/api/emergency-transfusion/process/${id}`, {
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể tải chi tiết quá trình truyền máu khẩn cấp.');
            }

            const data = await response.json();
            setCurrentProcess(data);
            setCurrentStepId(data.currentStatus || PROCESS_STEPS[0].id);
            setNotes(data.notes || '');
        } catch (err) {
            console.error("Lỗi khi tải quá trình truyền máu khẩn cấp:", err);
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
            // API để cập nhật trạng thái/bước của quá trình truyền máu khẩn cấp
            // Có thể là PUT /api/emergency-transfusion-process/{id}
            const response = await fetch(`http://localhost:8080/api/emergency-transfusion/process/${currentProcess.id}`, {
                method: 'PUT',
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...currentProcess,
                    currentStatus: newStatusId,
                    notes: notes,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Cập nhật quá trình truyền máu khẩn cấp thất bại.');
            }

            const data = await response.json();
            setCurrentProcess(data);
            setCurrentStepId(data.currentStatus);
            alert(`Cập nhật trạng thái thành công: ${PROCESS_STEPS.find(s => s.id === data.currentStatus)?.name}`);
        } catch (err) {
            console.error("Lỗi khi cập nhật quá trình truyền máu khẩn cấp:", err);
            setError(err.message);
            alert(`Lỗi: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

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
            case 'RAPID_ASSESSMENT':
                return (
                    <ul>
                        <li>Xác định nhanh tình trạng khẩn cấp và cần truyền máu ngay.</li>
                        <li>Lấy mẫu máu để xét nghiệm nhóm máu ABO/Rh nhanh chóng.</li>
                    </ul>
                );
            case 'IMMEDIATE_TRANSFUSION_PREP':
                return (
                    <ul>
                        <li>Ưu tiên truyền máu nhóm O Rh âm hoặc nhóm máu phù hợp nhanh nhất có thể.</li>
                        <li>Đặt kim truyền tĩnh mạch đường kính lớn, đo nhanh dấu hiệu sinh tồn.</li>
                    </ul>
                );
            case 'CONTINUOUS_MONITORING':
                return (
                    <ul>
                        <li>Bắt đầu truyền máu ngay lập tức với tốc độ nhanh.</li>
                        <li>Theo dõi liên tục từng phút các dấu hiệu sinh tồn và phản ứng truyền máu.</li>
                        <li>Chuẩn bị sẵn sàng xử lý phản ứng.</li>
                    </ul>
                );
            case 'POST_EMERGENCY_CARE':
                return (
                    <ul>
                        <li>Ổn định tình trạng bệnh nhân sau truyền máu.</li>
                        <li>Tiếp tục theo dõi chặt chẽ và ghi hồ sơ chi tiết.</li>
                    </ul>
                );
            case 'COMPLETED':
                return <p>Quy trình truyền máu khẩn cấp đã hoàn tất.</p>;
            default:
                return <p>Đang chờ bắt đầu quy trình.</p>;
        }
    };

    if (isLoading && !currentProcess) {
        return <div className={styles.loadingMessage}>Đang tải chi tiết quá trình khẩn cấp...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>Lỗi: {error}</div>;
    }

    if (!currentProcess && !emergencyTransfusionRequestId) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Quản Lý Quy Trình Nhận Máu Khẩn Cấp</h2>
                <p className={styles.introText}>Vui lòng cung cấp ID yêu cầu truyền máu khẩn cấp để quản lý quá trình.</p>
                <p>Ví dụ: `<EmergencyTransfusionProcess emergencyTransfusionRequestId="789" />`</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quản Lý Quy Trình Nhận Máu Khẩn Cấp</h2>
            {currentProcess && (
                <p className={styles.processInfo}>
                    **Mã Yêu Cầu Khẩn Cấp:** {currentProcess.emergencyTransfusionRequestId || emergencyTransfusionRequestId} |
                    **Bệnh Nhân:** {currentProcess.patientName || 'Chưa có thông tin'} |
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
                        placeholder="Thêm ghi chú về quá trình truyền máu khẩn cấp..."
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
                Theo dõi sát sao từng bước trong quy trình truyền máu khẩn cấp để cứu sống bệnh nhân.
            </p>
        </div>
    );
};

export default EmergencyTransfusionProcess;