import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios';
import styles from './DonationProcess.module.css';
import DonationProcessDetail from '../DonationProcessDetail/DonationProcessDetail';

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
        console.error("Chuỗi ngày/giờ không hợp lệ:", isoString, e);
        return 'Ngày/giờ không hợp lệ';
    }
};

const DonationProcess = () => {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [editingProcessId, setEditingProcessId] = useState(null);
    const [currentEditData, setCurrentEditData] = useState({});

    const staticBloodTypes = [
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
    const [bloodTypes] = useState(staticBloodTypes);

    const fetchProcesses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/donation-processes/list');
            setProcesses(response.data);
            console.log("Đã tải danh sách quy trình hiến máu:", response.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách quy trình:", err);
            setError('Không thể tải danh sách quy trình hiến máu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProcesses();
    }, []);

    const handleViewDetailClick = (process) => {
        setSelectedProcess(process);
        setEditingProcessId(null);
        setCurrentEditData({});
    };

    const handleBackToList = () => {
        setSelectedProcess(null);
        setEditingProcessId(null);
        setCurrentEditData({});
    };

    const handleEditClick = (processToEdit) => {
        setEditingProcessId(processToEdit.id);
        setCurrentEditData({
            ...processToEdit,
            
            date: processToEdit.date && typeof processToEdit.date === 'string' ? processToEdit.date.split('T')[0] : '',
            
            bloodTypeId: processToEdit.bloodType ? processToEdit.bloodType.id : '',
            
            type: processToEdit.type || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingProcessId(null);
        setCurrentEditData({});
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentEditData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUpdateProcess = async (processId) => {
        if (window.confirm(`Bạn có chắc chắn muốn cập nhật quy trình ID ${processId} này không?`)) {
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
                    alert('Không thể xác định người thực hiện (performerId). Vui lòng đăng nhập lại.');
                    return;
                }

                const selectedBloodType = bloodTypes.find(bt => bt.id === parseInt(currentEditData.bloodTypeId));
                if (!selectedBloodType && currentEditData.bloodTypeId) {
                    alert('Nhóm máu được chọn không hợp lệ.');
                    return;
                }

                const payload = {
                    ...currentEditData,
                    performerId: performerId,
                    bloodType: selectedBloodType ? { id: selectedBloodType.id } : null,
                    bloodTypeId: undefined,
                };

                ['hemoglobin', 'quantity'].forEach(field => {
                    if (payload[field] === '') {
                        payload[field] = null;
                    } else if (payload[field] !== null && typeof payload[field] === 'string') {
                        payload[field] = parseFloat(payload[field]);
                    }
                });
                ['bloodPressure', 'notes', 'startTime', 'endTime'].forEach(field => {
                    if (payload[field] === '') {
                        payload[field] = null;
                    }
                });


                const response = await axiosInstance.put(`/donation-processes/edit/${processId}`, payload);
                console.log("Quy trình đã được cập nhật:", response.data);
                alert(`Quy trình ID ${processId} đã được cập nhật thành công!`);
                setEditingProcessId(null);
                
                await fetchProcesses();
                
                setSelectedProcess(response.data);
            } catch (err) {
                console.error("Lỗi khi cập nhật quy trình:", err);
                const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật quy trình. Vui lòng thử lại.';
                alert(errorMessage);
            }
        }
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải danh sách quy trình hiến máu...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (selectedProcess) {
        return (
            <DonationProcessDetail
                process={selectedProcess}
                onBack={handleBackToList}
                bloodTypes={bloodTypes}
                onUpdate={editingProcessId === selectedProcess.id ? handleUpdateProcess : handleEditClick} 
                onCancelEdit={handleCancelEdit}
                currentEditData={currentEditData}
                handleInputChange={handleInputChange}
                isEditing={editingProcessId === selectedProcess.id}
            />
        );
    }

    return (
        <div className={styles.donationProcessListContainer}>
            <h2>Danh sách Quy trình Hiến máu</h2>
            {processes.length === 0 ? (
                <p className={styles.noProcessesMessage}>Không có quy trình hiến máu nào đang chờ xử lý.</p>
            ) : (
                <div className={styles.processCardsContainer}>
                    {processes.map((process) => (
                        <div key={process.id} className={styles.processCard}>
                            <h3>ID Quy trình: {process.id}</h3>
                            <p><strong>Người hiến:</strong> {process.donorFullName || 'N/A'}</p>
                            <p><strong>Ngày hiến (ĐK):</strong> {formatDateTime(process.scheduleDate) || 'N/A'}</p>
                            <p><strong>Cơ sở (ĐK):</strong> {process.medicalFacilityName || 'N/A'}</p>
                            <p>
                                <strong>Trạng thái:</strong>
                                <span className={`${styles.statusBadge} ${styles[process.process ? process.process.toLowerCase() : '']}`}>
                                    {process.process === 'IN_PROCESS' ? 'Đang tiến hành' :
                                        (process.process === 'COMPLETED' ? 'Hoàn thành' :
                                            (process.process === 'FAILED' ? 'Thất bại' : 'N/A'))}
                                </span>
                            </p>
                            <button
                                className={styles.viewDetailButton}
                                onClick={() => handleViewDetailClick(process)}
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DonationProcess;