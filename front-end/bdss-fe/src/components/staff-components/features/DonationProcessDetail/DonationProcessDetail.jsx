import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
import styles from './DonationProcessDetail.module.css';

const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        if (isoString.includes('T')) {
            const date = new Date(isoString);
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            return date.toLocaleString('vi-VN', options);
        } else {
            const [year, month, day] = isoString.split('-');
            return `${day}/${month}/${year}`;
        }
    } catch (e) {
        console.error("Invalid date/time string:", isoString, e);
        return 'Invalid Date/Time';
    }
};

const getStatusProcessName = (status) => {
    switch (status) {
        case 'WAITING': return 'Đang chờ';
        case 'IN_PROCESS': return 'Đang tiến hành';
        case 'COMPLETED': return 'Hoàn thành';
        case 'FAILED': return 'Thất bại';
        case 'DONOR_CANCEL': return 'Người hiến hủy bỏ';
        default: return 'Không xác định';
    }
};

const DonationProcessDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const initialStepParam = queryParams.get('step');

    const [processView, setProcessView] = useState(null);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(initialStepParam || 'detail');

    const [validationErrors, setValidationErrors] = useState({});

    const genderMap = {
        'MALE': 'Nam',
        'FEMALE': 'Nữ',
        'OTHER': 'Khác'
    };

    const donationTypeMap = {
        'WHOLE_BLOOD': 'Máu toàn phần',
        'PLATELETS': 'Tiểu cầu',
        'PLASMA': 'Huyết tương',
    };

    const statusHealthCheckMap = {
        'PASS': 'Đạt',
        'FAIL': 'Không đạt',
        'UNKNOWN': 'Chưa xác định'
    };

    const bloodTypesOptions = [
        { id: 1, type: 'Unknow', rhFactor: 'Unknow', displayName: 'Chưa xác định' },
        { id: 2, type: 'A', rhFactor: '+', displayName: 'A+' },
        { id: 3, type: 'A', rhFactor: '-', displayName: 'A-' },
        { id: 4, type: 'B', rhFactor: '+', displayName: 'B+' },
        { id: 5, type: 'B', rhFactor: '-', displayName: 'B-' },
        { id: 6, type: 'AB', rhFactor: '+', displayName: 'AB+' },
        { id: 7, type: 'AB', rhFactor: '-', displayName: 'AB-' },
        { id: 8, type: 'O', rhFactor: '+', displayName: 'O+' },
        { id: 9, type: 'O', rhFactor: '-', displayName: 'O-' },
    ];

    const getBloodTypeDisplayName = (bloodTypeId) => {
        const bloodType = bloodTypesOptions.find(bt => bt.id === bloodTypeId);
        return bloodType ? bloodType.displayName : 'Chưa cập nhật';
    };

    const fetchProcessDetail = useCallback(async () => {
        setLoading(true);
        setError(null);
        if (!id) {
            setError('Process ID is missing.');
            setLoading(false);
            return;
        }
        try {
            const response = await axiosInstance.get(`/donation-processes/search/${id}`);
            const fetchedProcessView = response.data;
            setProcessView(fetchedProcessView);

            setEditData({
                id: fetchedProcessView.id,
                heartRate: fetchedProcessView.heartRate !== null ? fetchedProcessView.heartRate : '',
                temperature: fetchedProcessView.temperature !== null ? fetchedProcessView.temperature : '',
                weight: fetchedProcessView.weight !== null ? fetchedProcessView.weight : '',
                height: fetchedProcessView.height !== null ? fetchedProcessView.height : '',
                hemoglobin: fetchedProcessView.hemoglobin !== null ? fetchedProcessView.hemoglobin : '',
                bloodPressure: fetchedProcessView.bloodPressure || '',
                statusHealthCheck: fetchedProcessView.statusHealthCheck || '',
                failureReason: fetchedProcessView.failureReason || '',
                quantity: fetchedProcessView.quantity !== null ? fetchedProcessView.quantity : '',
                type: fetchedProcessView.typeDonation || '',
                notes: fetchedProcessView.notes || '',
                process: fetchedProcessView.process,
                bloodTypeId: fetchedProcessView.donorBloodType?.id || null,
                date: fetchedProcessView.startTime ? new Date(fetchedProcessView.startTime).toISOString().split('T')[0] : null
            });

            const finalStates = ['COMPLETED', 'FAILED', 'DONOR_CANCEL'];
            if (finalStates.includes(fetchedProcessView.process)) {
                setCurrentStep('detail');
            } else if (initialStepParam) {
                setCurrentStep(initialStepParam);
            } else if (fetchedProcessView.process === 'IN_PROCESS') {
                if (fetchedProcessView.statusHealthCheck === 'PASS') {
                    setCurrentStep('donation');
                } else if (fetchedProcessView.statusHealthCheck === null || fetchedProcessView.statusHealthCheck === 'UNKNOWN') {
                    setCurrentStep('screening');
                } else {
                    setCurrentStep('detail');
                }
            } else {
                setCurrentStep('detail');
            }

        } catch (err) {
            console.error('Error fetching process detail:', err);
            const errorMessage = err.response?.data?.message || 'Could not load process details. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [id, initialStepParam]);

    useEffect(() => {
        fetchProcessDetail();
    }, [fetchProcessDetail]);

    useEffect(() => {
        const newStep = queryParams.get('step');
        if (newStep && newStep !== currentStep) {
            setCurrentStep(newStep);
        }
    }, [currentStep, queryParams]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        let parsedValue = value;
        if (type === 'number') {
            parsedValue = value === '' ? null : parseFloat(value);
        } else if (name === 'statusHealthCheck' && value === '') {
            parsedValue = null;
        } else if (name === 'type' && value === '') {
            parsedValue = null;
        } else if (name === 'bloodTypeId' && value === '') {
            parsedValue = null;
        } else if (name === 'bloodTypeId') {
            parsedValue = parseInt(value, 10);
        }
        setEditData(prevData => ({
            ...prevData,
            [name]: parsedValue
        }));
    };

    const getPerformerId = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userObject = JSON.parse(storedUser);
                return userObject.id;
            } catch (parseError) {
                console.error("Error parsing user from localStorage:", parseError);
                toast.error('Could not identify performer. Please log in again.');
                return null;
            }
        }
        toast.error('User not logged in. Performer ID unavailable.');
        return null;
    };

    const handleSaveScreening = async () => {
        setLoading(true);
        setError(null);
        const performerId = getPerformerId();
        if (!performerId) {
            setLoading(false);
            return;
        }

        try {
            const payload = {
                id: editData.id,
                heartRate: editData.heartRate,
                temperature: editData.temperature,
                weight: editData.weight,
                height: editData.height,
                hemoglobin: editData.hemoglobin,
                bloodPressure: editData.bloodPressure,
                statusHealthCheck: editData.statusHealthCheck,
                failureReason: editData.statusHealthCheck === 'FAIL' ? editData.failureReason : null,
                notes: editData.notes,
                quantity: editData.quantity || 0,
                type: editData.type || null,
                process: editData.process,
                bloodTypeId: editData.bloodTypeId,
                date: editData.date
            };

            if (!payload.statusHealthCheck || payload.statusHealthCheck === '') {
                throw new Error('Vui lòng chọn kết quả sàng lọc (Đạt/Không đạt).');
            }
            if (payload.statusHealthCheck === 'FAIL' && (!payload.failureReason || payload.failureReason.trim() === '')) {
                throw new Error('Vui lòng nhập lý do thất bại khi kết quả khám sức khỏe là FAIL.');
            }
            if (payload.statusHealthCheck === 'PASS') {
                const requiredFields = ['heartRate', 'temperature', 'weight', 'height', 'hemoglobin', 'bloodPressure'];
                const missing = requiredFields.filter(f => payload[f] === null || payload[f] === '');
                if (missing.length > 0) {
                    throw new Error(`Vui lòng điền đầy đủ các trường sàng lọc bắt buộc cho trạng thái "Đạt": ${missing.map(f => {
                        switch(f) {
                            case 'heartRate': return 'Nhịp tim';
                            case 'temperature': return 'Nhiệt độ';
                            case 'weight': return 'Cân nặng';
                            case 'height': return 'Chiều cao';
                            case 'hemoglobin': return 'Hemoglobin';
                            case 'bloodPressure': return 'Huyết áp';
                            default: return f;
                        }
                    }).join(', ')}.`);
                }
            }

            await axiosInstance.put(`/donation-processes/edit/${id}`, payload);
            toast.success('Kết quả sàng lọc sức khỏe đã được cập nhật!');

            await fetchProcessDetail();

        } catch (err) {
            console.error('Error saving screening data:', err);
            const errorMessage = err.message || err.response?.data?.message || 'Không thể cập nhật dữ liệu sàng lọc. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDonation = async () => {
        setLoading(true);
        setError(null);
        const performerId = getPerformerId();
        if (!performerId) {
            setLoading(false);
            return;
        }

        try {
            const payload = {
                id: editData.id,
                quantity: editData.process === 'COMPLETED' ? editData.quantity : 0,
                type: editData.process === 'COMPLETED' ? (editData.type || null) : null,
                notes: editData.notes,
                process: editData.process,
                heartRate: editData.heartRate,
                temperature: editData.temperature,
                weight: editData.weight,
                height: editData.height,
                hemoglobin: editData.hemoglobin,
                bloodPressure: editData.bloodPressure,
                statusHealthCheck: editData.statusHealthCheck,
                failureReason: editData.failureReason,
                bloodTypeId: editData.bloodTypeId,
                date: editData.date
            };

            if (!payload.process) {
                throw new Error('Vui lòng chọn trạng thái cuối cùng của Quy trình (Hoàn thành/Thất bại).');
            }
            if (payload.process === 'COMPLETED') {
                const requiredFields = ['quantity', 'type'];
                const missing = requiredFields.filter(f => payload[f] === null || payload[f] === 0 || (f === 'type' && payload[f] === ''));
                if (missing.length > 0) {
                    throw new Error(`Vui lòng điền đầy đủ các trường hiến máu bắt buộc cho trạng thái "Hoàn thành": ${missing.map(f => {
                        switch(f) {
                            case 'quantity': return 'Thể tích máu';
                            case 'type': return 'Loại hiến';
                            default: return f;
                        }
                    }).join(', ')}.`);
                }
            }
            if (payload.process === 'FAILED' && (!payload.notes || payload.notes.trim() === '')) {
                throw new Error('Vui lòng nhập ghi chú cho lý do thất bại hiến máu.');
            }

            await axiosInstance.put(`/donation-processes/edit/${id}`, payload);
            toast.success(`Quy trình hiến máu đã được ${payload.process === 'COMPLETED' ? 'hoàn thành' : 'cập nhật thất bại'}!`);

            navigate('/staff-dashboard/donation-processes');

        } catch (err) {
            console.error('Error saving donation data:', err);
            const errorMessage = err.message || err.response?.data?.message || 'Không thể cập nhật dữ liệu hiến máu. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleRescreening = async () => {
        setLoading(true);
        setError(null);
        const performerId = getPerformerId();
        if (!performerId) {
            setLoading(false);
            return;
        }

        try {
            const payload = {
                id: editData.id,
                process: 'IN_PROCESS',
                statusHealthCheck: null,
                failureReason: null,
                notes: editData.notes,
                heartRate: null,
                temperature: null,
                weight: null,
                height: null,
                hemoglobin: null,
                bloodPressure: null,
                quantity: 0,
                type: null,
                bloodTypeId: editData.bloodTypeId,
                date: editData.date
            };

            await axiosInstance.put(`/donation-processes/edit/${id}`, payload);
            toast.success('Quá trình đã được đặt lại để tái kiểm tra sức khỏe.');

            navigate(`/staff-dashboard/donation-processes/${id}?step=screening`);
            await fetchProcessDetail();

        } catch (err) {
            console.error('Error initiating re-screening:', err);
            const errorMessage = err.response?.data?.message || 'Không thể đặt lại quá trình để tái kiểm tra. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const isFinalState = ['COMPLETED', 'FAILED', 'DONOR_CANCEL'].includes(processView?.process);
    const isDetailView = currentStep === 'detail' || isFinalState;
    const canEditScreening = currentStep === 'screening' && processView?.process === 'IN_PROCESS' && !isFinalState;
    const canEditDonation = currentStep === 'donation' && processView?.process === 'IN_PROCESS' && processView?.statusHealthCheck === 'PASS' && !isFinalState;

    const canRescreen = processView?.process === 'FAILED' && processView?.statusHealthCheck === 'FAIL';

    const validateField = (name, value) => {
    let error = '';

    switch (name) {
        case 'weight':
            if (value < 45 || value > 150) {
                error = 'CẢNH BÁO: Cân nặng tối thiểu là 42 kg đối với nữ và 45 kg đối với nam';
            }
            break;
        case 'temperature':
            if (value < 35 || value > 42) {
                error = 'CẢNH BÁO: Nhiệt độ cơ thể phải từ 35°C đến 42°C.';
            }
            break;
        case 'heartRate':
            if (value < 60 || value > 90) {
                error = 'CẢNH BÁO: Nhịp tim ổn định phải trong khoảng từ 60 lần đến 90 lần/phút.';
            }
            break;
        case 'hemoglobin':
            if (value < 120 || value > 180) {
                error = 'CẢNH BÁO: Nồng độ hemoglobin phải ≥ 120 g/L; nếu hiến máu với thể tích trên 350 mL, nồng độ hemoglobin cần đạt ≥ 125 g/L.';
            }
            break;
        case 'bloodPressure':
            if (!/^\d{2,3}\/\d{2,3}$/.test(value)) {
                error = 'CẢNH BÁO: Định dạng huyết áp phải là Huyết áp tâm thu/Huyết áp tâm trương (VD: 120/80).';
            } else {
                const [sys, dia] = value.split('/').map(Number); //Systolic/Diastolic
                if (sys < 90 || sys > 129 || dia < 60 || dia > 84) {
                    error = 'CẢNH BÁO: Huyết áp ở mức bình thường có chỉ số tâm thu từ 90-129 mmHg và tâm trương từ 60-84 mmHg.';
                }
            }
            break;
        default:
            break;
    }

    setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
    }));

};


    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải chi tiết quy trình...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (!processView) {
        return <div className={styles.noDataMessage}>Không tìm thấy chi tiết quy trình.</div>;
    }

    return (
        <div className={styles.donationProcessDetailContainer}>
            <h2 className={styles.pageTitle}>Chi Tiết Quá Trình Hiến Máu</h2>

            <div className={styles.formLayout}>
                <div className={styles.readOnlySection}>
                    <h3>Thông tin Yêu cầu Hiến máu</h3>
                    <div className={styles.infoGroup}>
                        <strong>Mã quá trình:</strong>
                        <span>{processView.id || 'N/A'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <strong>Người đăng ký:</strong>
                        <span>{processView.donorFullName || 'N/A'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <strong>Số điện thoại Người hiến:</strong>
                        <span>{processView.donorPhone || 'N/A'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <strong>Ngày sinh Người hiến:</strong>
                        <span>{processView.donorBirthDate ? formatDateTime(processView.donorBirthDate) : 'N/A'}</span>
                    </div>
                    
                    <div className={styles.infoGroup}>
                        <strong>Nhóm máu Đăng Ký:</strong>
                        {canEditScreening || canEditDonation ? (
                            <select
                                id="bloodTypeId"
                                name="bloodTypeId"
                                value={editData.bloodTypeId || ''}
                                onChange={handleInputChange}
                                className={styles.selectInput}
                                disabled={!canEditScreening && !canEditDonation}
                            >
                                <option value="">Chọn nhóm máu</option>
                                {bloodTypesOptions.map(bt => (
                                    <option key={bt.id} value={bt.id}>
                                        {bt.displayName}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span>
                                {getBloodTypeDisplayName(processView.donorBloodType?.id)}
                            </span>
                        )}
                    </div>

                    <div className={styles.infoGroup}>
                        <strong>Giới tính:</strong>
                        <span>{genderMap[processView.donorGender] || 'N/A'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <strong>Tên Sự kiện hiến máu:</strong>
                        <span>{processView.eventName || 'N/A'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <strong>Thời gian đăng ký sự kiện:</strong>
                        <span>{processView.startTime ? formatDateTime(processView.startTime) : 'N/A'} - {processView.endTime ? formatDateTime(processView.endTime) : 'N/A'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <strong>Người thực hiện quá trình:</strong>
                        <span>{processView.performerFullName || 'N/A'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <strong>Trạng thái hiện tại:</strong>
                        <span className={`${styles.statusBadge} ${styles[processView.process?.toLowerCase()]}`}>
                            {getStatusProcessName(processView.process)}
                        </span>
                    </div>
                    {(processView.statusHealthCheck && processView.statusHealthCheck !== 'UNKNOWN') && (
                        <div className={styles.infoGroup}>
                            <strong>Tình trạng sàng lọc:</strong>
                            <span className={`${styles.statusBadge} ${styles[processView.statusHealthCheck?.toLowerCase()]}`}>
                                {statusHealthCheckMap[processView.statusHealthCheck]}
                            </span>
                        </div>
                    )}
                    {processView.failureReason && processView.statusHealthCheck === 'FAIL' && (
                                <div className={styles.infoGroup}>
                                    <strong>Lý do sàng lọc thất bại:</strong>
                                    <span>{processView.failureReason}</span>
                                </div>
                    )}
                </div>

                <div className={styles.editableSection}>
                    {isDetailView && (
                        <>
                            <h3>Thông tin Chi tiết Quá trình</h3>
                            <div className={styles.summaryDetails}>
                                <p><strong>Nhịp tim:</strong> {processView.heartRate || 'N/A'} bpm</p>
                                <p><strong>Nhiệt độ:</strong> {processView.temperature || 'N/A'} °C</p>
                                <p><strong>Cân nặng:</strong> {processView.weight || 'N/A'} kg</p>
                                <p><strong>Chiều cao:</strong> {processView.height || 'N/A'} cm</p>
                                <p><strong>Hemoglobin:</strong> {processView.hemoglobin || 'N/A'} g/L</p>
                                <p><strong>Huyết áp:</strong> {processView.bloodPressure || 'N/A'}</p>
                                <p><strong>Lượng máu hiến:</strong> {processView.quantity || 'N/A'} ml</p>
                                <p><strong>Loại hiến:</strong> {donationTypeMap[processView.typeDonation] || 'N/A'}</p>
                                <p><strong>Ghi chú quá trình:</strong> {processView.notes || 'Không có'}</p>
                            </div>
                            <div className={styles.actionButtons}>
                                <button className={`${styles.button} ${styles.backButton}`} onClick={() => navigate('/staff-dashboard/donation-processes')}>Quay lại danh sách</button>
                                {canRescreen && (
                                    <button
                                        type="button"
                                        className={`${styles.button} ${styles.rescreenButton}`}
                                        onClick={handleRescreening}
                                        disabled={loading}
                                    >
                                        Tái kiểm tra
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {!isDetailView && currentStep === 'screening' && (
                        <>
                            <h3>Khảo sát sức khỏe</h3>
                            <form>
                                <div className={styles.formGroup}>
                                    <label htmlFor="heartRate">Nhịp tim (bpm):</label>
                                    <input
                                        type="number"
                                        id="heartRate"
                                        name="heartRate"
                                        value={editData.heartRate}
                                        onChange={handleInputChange}
                                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                                        placeholder="Ví dụ: 75"
                                        disabled={!canEditScreening}
                                        className={styles.input}
                                    />
                                    {validationErrors.heartRate && (
                                        <div className={styles.validationText}>{validationErrors.heartRate}</div>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="temperature">Nhiệt độ (°C):</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        id="temperature"
                                        name="temperature"
                                        value={editData.temperature}
                                        onChange={handleInputChange}
                                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                                        placeholder="Ví dụ: 37.0"
                                        disabled={!canEditScreening}
                                        className={styles.input}
                                    />
                                    {validationErrors.temperature && (
                                        <div className={styles.validationText}>{validationErrors.temperature}</div>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="weight">Cân nặng (kg):</label>
                                    <input
                                        type="number"
                                        id="weight"
                                        name="weight"
                                        value={editData.weight}
                                        onChange={handleInputChange}
                                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                                        placeholder="Ví dụ: 60.5"
                                        disabled={!canEditScreening}
                                        className={styles.input}
                                    />
                                    {validationErrors.weight && (
                                        <div className={styles.validationText}>{validationErrors.weight}</div>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="height">Chiều cao (cm):</label>
                                    <input type="number" step="0.1" id="height" name="height"
                                        value={editData.height} onChange={handleInputChange}
                                        placeholder="Ví dụ: 170.0" disabled={!canEditScreening} className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="hemoglobin">Hemoglobin (g/L):</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        id="hemoglobin"
                                        name="hemoglobin"
                                        value={editData.hemoglobin}
                                        onChange={handleInputChange}
                                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                                        placeholder="Ví dụ: 130"
                                        disabled={!canEditScreening}
                                        className={styles.input}
                                    />
                                    {validationErrors.hemoglobin && (
                                        <div className={styles.validationText}>{validationErrors.hemoglobin}</div>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="bloodPressure">Huyết áp (VD: 120/80):</label>
                                    <input
                                        type="text"
                                        id="bloodPressure"
                                        name="bloodPressure"
                                        value={editData.bloodPressure}
                                        onChange={handleInputChange}
                                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                                        placeholder="Ví dụ: 120/80"
                                        disabled={!canEditScreening}
                                        className={styles.input}
                                    />
                                    {validationErrors.bloodPressure && (
                                        <div className={styles.validationText}>{validationErrors.bloodPressure}</div>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="statusHealthCheck">Kết quả sàng lọc:</label>
                                    <select id="statusHealthCheck" name="statusHealthCheck"
                                        value={editData.statusHealthCheck} onChange={handleInputChange}
                                        disabled={!canEditScreening} className={styles.selectInput}>
                                        <option value="">Chọn kết quả</option>
                                        <option value="PASS">Đạt</option>
                                        <option value="FAIL">Không đạt</option>
                                    </select>
                                </div>
                                {editData.statusHealthCheck === 'FAIL' && (
                                    <div className={styles.formGroup}>
                                        <label htmlFor="failureReason">Lý do thất bại sàng lọc:</label>
                                        <textarea id="failureReason" name="failureReason"
                                            value={editData.failureReason} onChange={handleInputChange}
                                            rows="3" placeholder="Ghi rõ lý do không đạt"
                                            disabled={!canEditScreening} className={styles.textarea} />
                                    </div>
                                )}
                                <div className={styles.formGroup}>
                                    <label htmlFor="notes">Ghi chú của nhân viên:</label>
                                    <textarea id="notes" name="notes"
                                        value={editData.notes} onChange={handleInputChange}
                                        rows="3" placeholder="Ghi chú thêm về ngày tái khám"
                                        disabled={!canEditScreening} className={styles.textarea} />
                                </div>
                                <div className={styles.actionButtons}>
                                    <button type="button" className={`${styles.button} ${styles.backButton}`} onClick={() => navigate('/staff-dashboard/donation-processes')}>
                                        Quay lại
                                    </button>
                                    {canEditScreening && (
                                        <button type="button" className={`${styles.button} ${styles.saveButton}`} onClick={handleSaveScreening}>
                                            Lưu kết quả sàng lọc
                                        </button>
                                    )}
                                </div>
                            </form>
                        </>
                    )}

                    {!isDetailView && currentStep === 'donation' && (
                        <>
                            <h3>Tiến hành truyền máu</h3>
                            <form>
                                <div className={styles.formGroup}>
                                    <label htmlFor="quantity">Thể tích máu (ml):</label>
                                    <input type="number" id="quantity" name="quantity"
                                        value={editData.quantity} onChange={handleInputChange}
                                        placeholder="Ví dụ: 450" disabled={!canEditDonation} className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="type">Loại hiến:</label>
                                    <select id="type" name="type"
                                        value={editData.type} onChange={handleInputChange}
                                        disabled={!canEditDonation} className={styles.selectInput}>
                                        <option value="">Chọn loại hiến</option>
                                        {Object.keys(donationTypeMap).map(key => (
                                            <option key={key} value={key}>
                                                {donationTypeMap[key]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="process">Trạng thái cuối cùng của Quy trình:</label>
                                    <select id="process" name="process"
                                        value={editData.process} onChange={handleInputChange}
                                        disabled={!canEditDonation} className={styles.selectInput}>
                                        <option value="">Chọn trạng thái</option>
                                        <option value="COMPLETED">Hoàn thành</option>
                                        <option value="FAILED">Thất bại</option>
                                    </select>
                                </div>
                                {editData.process === 'COMPLETED' && (
                                    <div className={styles.formGroup}>
                                        <label htmlFor="notes">Ghi chú:</label>
                                        <textarea id="notes" name="notes"
                                            value={editData.notes} onChange={handleInputChange}
                                            rows="3" placeholder="Ghi chú cho người hiến."
                                            disabled={!canEditDonation} className={styles.textarea} />
                                    </div>
                                )}
                                {editData.process === 'FAILED' && (
                                    <div className={styles.formGroup}>
                                        <label htmlFor="notes">Ghi chú (Lý do thất bại hiến máu):</label>
                                        <textarea id="notes" name="notes"
                                            value={editData.notes} onChange={handleInputChange}
                                            rows="3" placeholder="Ghi chú lý do quy trình thất bại"
                                            disabled={!canEditDonation} className={styles.textarea} />
                                    </div>
                                )}
                                <div className={styles.actionButtons}>
                                    <button type="button" className={`${styles.button} ${styles.backButton}`} onClick={() => navigate('/staff-dashboard/donation-processes')}>
                                        Quay lại
                                    </button>
                                    {canEditDonation && (
                                        <button type="button" className={`${styles.button} ${styles.saveButton}`} onClick={handleSaveDonation}>
                                            Lưu kết quả hiến máu
                                        </button>
                                    )}
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonationProcessDetail;