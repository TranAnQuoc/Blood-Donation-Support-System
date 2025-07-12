import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
            let dateToParse = isoString;
            if (isoString.match(/^\d{2}:\d{2}:\d{2}(.\d{3})?$/)) { 
                dateToParse = `2000-01-01T${isoString}`;
            }
            const date = new Date(dateToParse);

            if (isNaN(date.getTime())) { 
                return isoString;
            }

            if (isoString.match(/^\d{2}:\d{2}:\d{2}(.\d{3})?$/)) {
                const hours = date.getHours();
                const minutes = date.getMinutes();
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            }

            const [year, month, day] = isoString.split('-');
            return `${day}/${month}/${year}`;
        }
    } catch (e) {
        console.error("Chuỗi ngày/giờ không hợp lệ:", isoString, e);
        return 'Ngày/giờ không hợp lệ';
    }
};

const getStatusName = (status) => {
    switch (status) {
        case 'WAITING': return 'Đang chờ';
        case 'SCREENING': return 'Đang sàng lọc';
        case 'SCREENING_FAILED': return 'Sàng lọc thất bại';
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

    const [process, setProcess] = useState(null);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormEditable, setIsFormEditable] = useState(false);
    const [isCompletedOrCancelled, setIsCompletedOrCancelled] = useState(false);

    const genderMap = {
        'MALE': 'Nam',
        'FEMALE': 'Nữ',
        'OTHER': 'Khác'
    };

    const processStatusMap = {
        // 'WAITING': 'Đang chờ',
        'SCREENING': 'Đang sàng lọc',
        'SCREENING_FAILED': 'Sàng lọc thất bại',
        'IN_PROCESS': 'Đang tiến hành',
        'COMPLETED': 'Hoàn thành',
        'FAILED': 'Thất bại',
        // 'DONOR_CANCEL': 'Người hiến hủy bỏ'
    };

    const donationTypeMap = {
        'WHOLE_BLOOD': 'Máu toàn phần',
        'PLATELETS': 'Tiểu cầu',
        'PLASMA': 'Huyết tương',
    };

    const staticBloodTypes = [// eslint-disable-line no-unused-vars
        { id: 1, type: 'UNKNOWN', rhFactor: 'UNKNOWN' },
        { id: 2, type: 'A', rhFactor: '+' },
        { id: 3, type: 'A', rhFactor: '-' },
        { id: 4, type: 'B', rhFactor: '+' },
        { id: 5, type: 'B', rhFactor: '-' },
        { id: 6, type: 'AB', rhFactor: '+' },
        { id: 7, type: 'AB', rhFactor: '-' },
        { id: 8, type: 'O', rhFactor: '+' },
        { id: 9, type: 'O', rhFactor: '-' },
    ];

    const fetchProcessDetail = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        if (!id) {
            setError('ID quy trình không hợp lệ. Vui lòng thử lại.');
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get(`/donation-processes/search/${id}`);
            const fetchedProcess = response.data;
            setProcess(fetchedProcess);
            console.log('Fetched Process Detail:', fetchedProcess);

            const formattedProcessDate = fetchedProcess.processDate
                ? new Date(fetchedProcess.processDate).toISOString().split('T')[0]
                : '';

            setEditData({
                process: fetchedProcess.process, 
                processDate: formattedProcessDate,
                quantity: fetchedProcess.quantity !== null ? fetchedProcess.quantity : '', 
                type: fetchedProcess.type || '',

                hemoglobin: fetchedProcess.hemoglobin !== null ? fetchedProcess.hemoglobin : '',
                bloodPressure: fetchedProcess.bloodPressure || '',
                heartRate: fetchedProcess.heartRate !== null ? fetchedProcess.heartRate : '',
                temperature: fetchedProcess.temperature !== null ? fetchedProcess.temperature : '',
                weight: fetchedProcess.weight !== null ? fetchedProcess.weight : '',
                height: fetchedProcess.height !== null ? fetchedProcess.height : '',
                healthCheck: fetchedProcess.healthCheck !== null ? fetchedProcess.healthCheck : false, 
                hasChronicDisease: fetchedProcess.hasChronicDisease !== null ? fetchedProcess.hasChronicDisease : false, 
                hasRecentTattoo: fetchedProcess.hasRecentTattoo !== null ? fetchedProcess.hasRecentTattoo : false, 
                hasUsedDrugs: fetchedProcess.hasUsedDrugs !== null ? fetchedProcess.hasUsedDrugs : false, 
                screeningNote: fetchedProcess.screeningNote || '',
                notes: fetchedProcess.notes || '', 
            });

            const currentStatus = fetchedProcess.process; 
            if (currentStatus === 'WAITING' || currentStatus === 'COMPLETED' || currentStatus === 'DONOR_CANCEL') {
                setIsFormEditable(false); 
                if (currentStatus === 'COMPLETED' || currentStatus === 'DONOR_CANCEL') {
                    setIsCompletedOrCancelled(true); 
                } else {
                    setIsCompletedOrCancelled(false);
                }
            } else {
                setIsFormEditable(true); 
                setIsCompletedOrCancelled(false);
            }

        } catch (err) {
            console.error('Lỗi khi tải chi tiết quy trình:', err);
            const errorMessage = err.response?.data?.message || 'Không thể tải chi tiết quy trình. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProcessDetail();
    }, [fetchProcessDetail]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            const storedUser = localStorage.getItem('user');
            let performerId = null;
            if (storedUser) {
                try {
                    const userObject = JSON.parse(storedUser);
                    performerId = userObject.id;
                } catch (parseError) {
                    console.error("Lỗi khi phân tích JSON từ localStorage:", parseError);
                }
            }

            if (!performerId) {
                toast.error('Không thể xác định người thực hiện (performerId). Vui lòng đăng nhập lại.');
                setLoading(false); 
                return;
            }

            const eventDateStr = process?.date;
            let eventDate = null;
            if (eventDateStr) {
                eventDate = new Date(eventDateStr);
                eventDate.setHours(0, 0, 0, 0); 
            }
            
            const today = new Date();
            today.setHours(0, 0, 0, 0); 

            if (eventDate && eventDate > today) {
                toast.warn(`Quy trình hiến máu cho sự kiện này (${formatDateTime(eventDateStr)}) chưa tới ngày. Không thể chỉnh sửa.`);
                setLoading(false); 
                return;
            }

            const payload = {
                process: editData.process,
                performerId: performerId,
            };

            const addFieldToPayload = (fieldName, value, type) => {
                if (value === '' || value === null || value === undefined) {
                    payload[fieldName] = null;
                } else {
                    if (type === 'int') {
                        payload[fieldName] = parseInt(value, 10);
                    } else if (type === 'float') {
                        payload[fieldName] = parseFloat(value);
                    } else {
                        payload[fieldName] = value;
                    }
                }
            };

            addFieldToPayload('processDate', editData.processDate);
            addFieldToPayload('quantity', editData.quantity, 'int');
            addFieldToPayload('type', editData.type); 
            
            addFieldToPayload('hemoglobin', editData.hemoglobin, 'float');
            addFieldToPayload('bloodPressure', editData.bloodPressure);
            addFieldToPayload('heartRate', editData.heartRate, 'int');
            addFieldToPayload('temperature', editData.temperature, 'float');
            addFieldToPayload('weight', editData.weight, 'float');
            addFieldToPayload('height', editData.height, 'float');

            payload.healthCheck = editData.healthCheck;
            payload.hasChronicDisease = editData.hasChronicDisease;
            payload.hasRecentTattoo = editData.hasRecentTattoo;
            payload.hasUsedDrugs = editData.hasUsedDrugs;

            addFieldToPayload('screeningNote', editData.screeningNote);
            addFieldToPayload('notes', editData.notes);

            const selectedStatus = editData.process;

            if (selectedStatus === 'COMPLETED') {
                const requiredFieldsForComplete = [
                    'quantity', 'type', 'processDate', 
                    'hemoglobin', 'bloodPressure', 'heartRate', 'temperature', 'weight', 'height', 'healthCheck',
                    'hasChronicDisease', 'hasRecentTattoo', 'hasUsedDrugs' 
                ];
                
                const missingFields = requiredFieldsForComplete.filter(field => {
                    const value = payload[field];
                    if (typeof value === 'boolean') {
                        return value === undefined || value === null; 
                    }
                    return value === null || value === undefined || String(value).trim() === '';
                });

                if (missingFields.length > 0) {
                    throw new Error(`Không thể hoàn thành quy trình. Vui lòng điền đầy đủ các trường sau: ${missingFields.join(', ')}.`);
                }
            }
            
            if ((selectedStatus === 'FAILED' || selectedStatus === 'SCREENING_FAILED') && !payload.notes) {
                throw new Error('Vui lòng thêm ghi chú lý do thất bại.');
            }
            
            const response = await axiosInstance.put(`/donation-processes/edit/${id}`, payload);
            console.log("Quy trình đã được cập nhật:", response.data);
            toast.success(`Cập nhật quy trình thành công${selectedStatus === 'COMPLETED' ? ' và hoàn thành!' : '.'}`);

            if (['COMPLETED'].includes(selectedStatus)) {
                navigate('/staff-dashboard/donation-histories');
            } else {
                await fetchProcessDetail();
            }

        } catch (err) {
            console.error('Lỗi khi cập nhật quy trình:', err);
            const errorMessage = err.message || err.response?.data?.message || 'Không thể cập nhật quy trình. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải chi tiết quy trình...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (!process) {
        return <div className={styles.noDataMessage}>Không tìm thấy chi tiết quy trình.</div>;
    }

    if (isCompletedOrCancelled) {
        return (
            <div className={styles.donationProcessDetailContainer}>
                <h2 className={styles.pageTitle}>Chi tiết Quy trình Hiến máu</h2>
                <p className={styles.completedMessage}>
                    Quy trình này đã **{getStatusName(process.process)}**. Không thể chỉnh sửa thêm.
                </p>
                <div className={styles.summaryDetails}>
                    <p><strong>ID Quy trình:</strong> {process.id || 'N/A'}</p>
                    <p><strong>Người hiến:</strong> {process.donorFullName || 'N/A'}</p>
                    <p><strong>Nhóm máu ĐK:</strong> {process.donorBloodType ? `${process.donorBloodType.type}${process.donorBloodType.rhFactor}` : 'N/A'}</p>
                    <p><strong>Sự kiện:</strong> {process.eventName || 'N/A'}</p>
                    {/* <p><strong>Ngày sự kiện:</strong> {formatDateTime(process.date) || 'N/A'}</p> */}
                    <p><strong>Thời gian sự kiện:</strong> {formatDateTime(process.startTime) || 'N/A'}</p>
                    <p><strong>Ngày thực hiện:</strong> {process.processDate ? formatDateTime(process.processDate) : 'N/A'}</p>
                    <p><strong>Thể tích máu:</strong> {process.quantity || 'N/A'} ml</p>
                    <p><strong>Loại hiến:</strong> {donationTypeMap[process.type] || 'N/A'}</p> 
                    <p><strong>Hemoglobin:</strong> {process.hemoglobin || 'N/A'}</p>
                    <p><strong>Huyết áp:</strong> {process.bloodPressure || 'N/A'}</p>
                    <p><strong>Nhịp tim:</strong> {process.heartRate || 'N/A'}</p>
                    <p><strong>Nhiệt độ:</strong> {process.temperature || 'N/A'} °C</p>
                    <p><strong>Cân nặng:</strong> {process.weight || 'N/A'} kg</p>
                    <p><strong>Chiều cao:</strong> {process.height || 'N/A'} cm</p>
                    <p><strong>Kiểm tra sức khỏe đạt:</strong> {process.healthCheck ? 'Có' : 'Không'}</p>
                    <p><strong>Mắc bệnh mãn tính:</strong> {process.hasChronicDisease ? 'Có' : 'Không'}</p>
                    <p><strong>Xăm gần đây:</strong> {process.hasRecentTattoo ? 'Có' : 'Không'}</p>
                    <p><strong>Sử dụng thuốc:</strong> {process.hasUsedDrugs ? 'Có' : 'Không'}</p>
                    <p><strong>Ghi chú sàng lọc:</strong> {process.screeningNote || 'Không có'}</p>
                    <p><strong>Ghi chú chung:</strong> {process.notes || 'Không có'}</p>
                    <p><strong>Người thực hiện:</strong> {process.performerFullName || 'N/A'}</p>
                </div>
                <button className={styles.backButton} onClick={() => navigate(-1)}>Quay lại danh sách</button>
            </div>
        );
    }

    return (
        <div className={styles.donationProcessDetailContainer}>
            <h2 className={styles.pageTitle}>Chi tiết Quy trình Hiến máu</h2>

            <div className={styles.formLayout}>
                {/* Cột trái: Thông tin từ Donation Request*/}
                <div className={styles.readOnlySection}>
                    <h3>Thông tin Yêu cầu Hiến máu</h3>
                    <div className={styles.infoGroup}>
                        <strong>Mã yêu cầu:</strong>
                        <span>{process.id || 'N/A'}</span> 
                    </div>
                    <div className={styles.infoGroup}>
                        <strong>Người đăng ký:</strong>
                        <span>{process.donorFullName || 'N/A'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <strong>SĐT Người hiến:</strong>
                        <span>{process.donorPhone || 'N/A'}</span>
                    </div>
                     <div className={styles.infoGroup}>
                        <strong>Ngày sinh Người hiến:</strong>
                        <span>{process.donorBirthDate ? formatDateTime(process.donorBirthDate) : 'N/A'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <strong>Nhóm máu người hiến:</strong>
                        <span>
                            {process.donorBloodType
                                ? `${process.donorBloodType.type}${process.donorBloodType.rhFactor}`
                                : 'Chưa cập nhật'}
                        </span>
                    </div>
                    <div className={styles.infoGroup}>
                        <strong>Giới tính:</strong>
                        <span>{genderMap[process.donorGender] || 'N/A'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <strong>Sự kiện hiến máu:</strong>
                        <span>{process.eventName || 'N/A'}</span>
                    </div>
                    {/* <div className={styles.infoGroup}>
                        <strong>Ngày sự kiện:</strong>
                        <span>{process.date ? formatDateTime(process.date) : 'N/A'}</span>
                    </div> */}
                    <div className={styles.infoGroup}>
                        <strong>Thời gian sự kiện:</strong>
                        <span>{process.startTime ? formatDateTime(process.startTime) : 'N/A'} - {process.endTime ? formatDateTime(process.endTime) : 'N/A'}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <strong>Người duyệt yêu cầu:</strong>
                        <span>{process.performerFullName || 'N/A'}</span> 
                    </div>
                     <div className={styles.infoGroup}>
                        <strong>Ghi chú Y/C:</strong>
                        <span>{process.notes || 'Không có'}</span> 
                    </div>
                </div>

                {/* Cột phải: Thông tin quy trình hiến máu */}
                <div className={styles.editableSection}>
                    <h3>Thông tin Quy trình Hiến máu (Cập nhật)</h3>
                    <form>
                        <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                            <label htmlFor="healthCheck">Kiểm tra sức khỏe đạt yêu cầu?</label>
                            <input
                                type="checkbox"
                                id="healthCheck"
                                name="healthCheck"
                                checked={editData.healthCheck}
                                onChange={handleInputChange}
                                disabled={!isFormEditable}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="heartRate">Nhịp tim (bpm):</label>
                            <input
                                type="number"
                                id="heartRate"
                                name="heartRate"
                                value={editData.heartRate}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: 75"
                                disabled={!isFormEditable}
                                className={styles.input}
                            />
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
                                placeholder="Ví dụ: 37.0"
                                disabled={!isFormEditable}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="weight">Cân nặng (kg):</label>
                            <input
                                type="number"
                                step="0.1"
                                id="weight"
                                name="weight"
                                value={editData.weight}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: 60.5"
                                disabled={!isFormEditable}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="height">Chiều cao (cm):</label>
                            <input
                                type="number"
                                step="0.1"
                                id="height"
                                name="height"
                                value={editData.height}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: 170.0"
                                disabled={!isFormEditable}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="hemoglobin">Hemoglobin (g/dL):</label>
                            <input
                                type="number"
                                step="0.1"
                                id="hemoglobin"
                                name="hemoglobin"
                                value={editData.hemoglobin}
                                onChange={handleInputChange}
                                disabled={!isFormEditable}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="bloodPressure">Huyết áp (VD: 120/80):</label>
                            <input
                                type="text"
                                id="bloodPressure"
                                name="bloodPressure"
                                value={editData.bloodPressure}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: 120/80"
                                disabled={!isFormEditable}
                                className={styles.input}
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                            <label htmlFor="hasChronicDisease">Có tiền sử bệnh mãn tính?</label>
                            <input
                                type="checkbox"
                                id="hasChronicDisease"
                                name="hasChronicDisease"
                                checked={editData.hasChronicDisease}
                                onChange={handleInputChange}
                                disabled={!isFormEditable}
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                            <label htmlFor="hasRecentTattoo">Có hình xăm gần đây (trong 12 tháng)?</label>
                            <input
                                type="checkbox"
                                id="hasRecentTattoo"
                                name="hasRecentTattoo"
                                checked={editData.hasRecentTattoo}
                                onChange={handleInputChange}
                                disabled={!isFormEditable}
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                            <label htmlFor="hasUsedDrugs">Có sử dụng ma túy/chất kích thích?</label>
                            <input
                                type="checkbox"
                                id="hasUsedDrugs"
                                name="hasUsedDrugs"
                                checked={editData.hasUsedDrugs}
                                onChange={handleInputChange}
                                disabled={!isFormEditable}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="screeningNote">Ghi chú sàng lọc:</label>
                            <textarea
                                id="screeningNote"
                                name="screeningNote"
                                value={editData.screeningNote}
                                onChange={handleInputChange}
                                rows="2"
                                placeholder="Ghi chú thêm về quá trình sàng lọc..."
                                disabled={!isFormEditable}
                                className={styles.textarea}
                            ></textarea>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="quantity">Thể tích máu (ml):</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={editData.quantity}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: 450"
                                disabled={!isFormEditable}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="notes">Ghi chú chung:</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={editData.notes}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Ghi chú chung về quy trình (VD: lý do thất bại)"
                                disabled={!isFormEditable}
                                className={styles.textarea}
                            ></textarea>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="typeDonation">Loại hiến:</label> 
                            <select
                                id="type" 
                                name="type" 
                                value={editData.typeDonation} 
                                onChange={handleInputChange}
                                disabled={!isFormEditable}
                                className={styles.selectInput}
                            >
                                <option value="">Chọn loại hiến</option>
                                {Object.keys(donationTypeMap).map(key => (
                                    <option key={key} value={key}>{donationTypeMap[key]}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="processDate">Ngày thực hiện:</label>
                            <input
                                type="date"
                                id="processDate"
                                name="processDate"
                                value={editData.processDate}
                                onChange={handleInputChange}
                                disabled={!isFormEditable}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="process">Trạng thái Quy trình:</label>
                            <select
                                id="process"
                                name="process"
                                value={editData.process}
                                onChange={handleInputChange}
                                disabled={!isFormEditable && !(process.process === 'WAITING' && editData.process === 'SCREENING')} 
                                className={styles.selectInput}
                            >
                                {Object.keys(processStatusMap).map(key => (
                                    <option key={key} value={key}>
                                        {processStatusMap[key]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Trạng thái hiện tại:</label>
                            <span className={`${styles.statusBadge} ${styles[process.process?.toLowerCase()]}`}>
                                {getStatusName(process.process)}
                            </span>
                        </div>

                        <div className={styles.actionButtons}>
                            <button type="button" className={`${styles.button} ${styles.backButton}`} onClick={() => navigate(-1)}>
                                Quay lại
                            </button>

                            {!isFormEditable && !isCompletedOrCancelled && (
                                <button
                                    type="button"
                                    className={`${styles.button} ${styles.editButton}`}
                                    onClick={() => setIsFormEditable(true)}
                                >
                                    Chỉnh sửa
                                </button>
                            )}

                            {isFormEditable && (
                                <button
                                    type="button"
                                    className={`${styles.button} ${styles.saveButton}`}
                                    onClick={handleSave}
                                >
                                    Lưu
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DonationProcessDetail;
