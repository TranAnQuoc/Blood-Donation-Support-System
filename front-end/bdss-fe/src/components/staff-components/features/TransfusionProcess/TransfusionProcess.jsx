// src/components/staff-components/mainContent/TransfusionProcess.jsx
import React, { useState, useEffect } from 'react';
import styles from './TransfusionProcess.module.css';

// Giả định các trạng thái quy trình truyền máu
const PROCESS_STEPS = [
    { id: 'EVALUATION_INDICATION', name: 'Đánh giá & Chỉ định' },
    { id: 'PREP_BEFORE_TRANSFUSION', name: 'Chuẩn bị trước truyền' },
    { id: 'TRANSFUSION_IN_PROGRESS', name: 'Quá trình truyền máu' },
    { id: 'POST_TRANSFUSION_CARE', name: 'Chăm sóc sau truyền' },
    { id: 'COMPLETED', name: 'Hoàn thành' }
];

const TransfusionProcess = ({ transfusionRequestId }) => { // Nhận ID yêu cầu truyền máu từ props
    const [currentProcess, setCurrentProcess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentStepId, setCurrentStepId] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (transfusionRequestId) {
            fetchProcessDetails(transfusionRequestId);
        } else {
            console.warn("transfusionRequestId không được cung cấp. Cần ID để tải quá trình.");
            setIsLoading(false);
        }
    }, [transfusionRequestId]);

    const fetchProcessDetails = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            // API để lấy thông tin quá trình truyền máu
            // Có thể là GET /api/transfusion-process/{id}
            const response = await fetch(`http://localhost:8080/api/transfusion/process/${id}`, {
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể tải chi tiết quá trình nhận máu.');
            }

            const data = await response.json();
            setCurrentProcess(data);
            setCurrentStepId(data.currentStatus || PROCESS_STEPS[0].id);
            setNotes(data.notes || '');
        } catch (err) {
            console.error("Lỗi khi tải quá trình nhận máu:", err);
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
            // API để cập nhật trạng thái/bước của quá trình truyền máu
            // Có thể là PUT /api/transfusion-process/{id}
            const response = await fetch(`http://localhost:8080/api/transfusion/process/${currentProcess.id}`, {
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
                throw new Error(errorData.message || 'Cập nhật quá trình nhận máu thất bại.');
            }

            const data = await response.json();
            setCurrentProcess(data);
            setCurrentStepId(data.currentStatus);
            alert(`Cập nhật trạng thái thành công: ${PROCESS_STEPS.find(s => s.id === data.currentStatus)?.name}`);
        } catch (err) {
            console.error("Lỗi khi cập nhật quá trình nhận máu:", err);
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
            case 'EVALUATION_INDICATION':
                return (
                    <ul>
                        <li>Đánh giá lâm sàng và chỉ định truyền máu.</li>
                        <li>Lấy mẫu máu để xét nghiệm nhóm máu và hòa hợp chéo.</li>
                    </ul>
                );
            case 'PREP_BEFORE_TRANSFUSION':
                return (
                    <ul>
                        <li>Kiểm tra thông tin bệnh nhân và túi máu.</li>
                        <li>Giải thích quy trình cho bệnh nhân/người nhà.</li>
                        <li>Thiết lập đường truyền tĩnh mạch và đo dấu hiệu sinh tồn.</li>
                    </ul>
                );
            case 'TRANSFUSION_IN_PROGRESS':
                return (
                    <ul>
                        <li>Bắt đầu truyền máu với tốc độ được chỉ định.</li>
                        <li>Theo dõi chặt chẽ bệnh nhân trong suốt quá trình truyền để phát hiện phản ứng.</li>
                    </ul>
                );
            case 'POST_TRANSFUSION_CARE':
                return (
                    <ul>
                        <li>Kết thúc truyền, rút kim và băng ép.</li>
                        <li>Đo lại dấu hiệu sinh tồn và tiếp tục theo dõi trong vài giờ.</li>
                        <li>Ghi lại toàn bộ quá trình vào hồ sơ bệnh án.</li>
                    </ul>
                );
            case 'COMPLETED':
                return <p>Quy trình nhận máu đã hoàn tất.</p>;
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

    if (!currentProcess && !transfusionRequestId) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Quản Lý Quy Trình Nhận Máu</h2>
                <p className={styles.introText}>Vui lòng cung cấp ID yêu cầu truyền máu để quản lý quá trình.</p>
                <p>Ví dụ: `<TransfusionProcess transfusionRequestId="456" />`</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quản Lý Quy Trình Nhận Máu</h2>
            {currentProcess && (
                <p className={styles.processInfo}>
                    **Mã Yêu Cầu Truyền Máu:** {currentProcess.transfusionRequestId || transfusionRequestId} |
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
                        placeholder="Thêm ghi chú về quá trình nhận máu..."
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
                Đảm bảo mọi bước trong quy trình nhận máu được thực hiện chính xác và an toàn.
            </p>
        </div>
    );
};

export default TransfusionProcess;