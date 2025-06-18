// src/components/staff-components/mainContent/DonationProcess.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../configs/axios';
import styles from './DonationProcess.module.css';

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
    const [editingProcessId, setEditingProcessId] = useState(null);
    const [currentEditData, setCurrentEditData] = useState({});
    const [bloodTypes, setBloodTypes] = useState([]);

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

    const fetchBloodTypes = async () => {
        try {
            const response = await axiosInstance.get('/blood-types');
            setBloodTypes(response.data);
        } catch (err) {
            console.error("Lỗi khi tải nhóm máu:", err);
        }
    };

    useEffect(() => {
        fetchProcesses();
        fetchBloodTypes();
    }, []);

    const handleEditClick = (processToEdit) => {
        setEditingProcessId(processToEdit.id);
        setCurrentEditData({
            ...processToEdit,
            date: processToEdit.date && typeof processToEdit.date === 'string' ? processToEdit.date.split('T')[0] : '',
            bloodTypeId: processToEdit.bloodType ? processToEdit.bloodType.id : '',
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
                const response = await axiosInstance.put(`/donation-processes/edit/${processId}`, currentEditData);
                console.log("Quy trình đã được cập nhật:", response.data);
                alert(`Quy trình ID ${processId} đã được cập nhật thành công!`);
                setEditingProcessId(null);
                fetchProcesses();
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

    return (
        <div className={styles.donationProcessContainer}>
            <div className={styles.tableWrapper}>
                {processes.length === 0 ? (
                    <p className={styles.noProcessesMessage}>Không có quy trình hiến máu nào đang chờ xử lý.</p>
                ) : (
                    <table className={styles.donationProcessTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Người hiến</th>
                                <th>Ngày hiến (ĐK)</th>
                                <th>Cơ sở (ĐK)</th>
                                <th>Nhóm máu ĐK</th>
                                <th>Nhóm máu TT</th>
                                <th>Ngày hiến TT</th>
                                <th>Bắt đầu</th>
                                <th>Kết thúc</th>
                                <th>Hemoglobin</th>
                                <th>Huyết áp</th>
                                <th>SL (ml)</th>
                                <th>Loại hiến</th>
                                <th>Kiểm tra SK</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processes.map((process) => (
                                <tr key={process.id}>
                                    <td>{process.id}</td>
                                    <td>{process.donorFullName || 'N/A'}</td>
                                    <td>{formatDateTime(process.scheduleDate) || 'N/A'}</td>
                                    <td>{process.medicalFacilityName || 'N/A'}</td>
                                    <td>
                                        {process.donorBloodType ?
                                            `${process.donorBloodType.type}${process.donorBloodType.rhFactor}` : 'N/A'}
                                    </td>

                                    {/* Nhóm máu Thực tế */}
                                    <td>
                                        {editingProcessId === process.id ? (
                                            <select
                                                name="bloodTypeId"
                                                value={currentEditData.bloodTypeId || ''}
                                                onChange={handleInputChange}
                                                className={styles.selectInput}
                                            >
                                                <option value="">Chọn nhóm máu</option>
                                                {bloodTypes.map(bt => (
                                                    <option key={bt.id} value={bt.id}>
                                                        {bt.type}{bt.rhFactor}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            (process.bloodType ? `${process.bloodType.type}${process.bloodType.rhFactor}` : 'Unknown / Chưa cập nhật')
                                        )}
                                    </td>
                                    {/* Ngày hiến Thực tế (date) */}
                                    <td>
                                        {editingProcessId === process.id ? (
                                            <input
                                                type="date"
                                                name="date"
                                                value={currentEditData.date || ''}
                                                onChange={handleInputChange}
                                                className={styles.textInput}
                                            />
                                        ) : (
                                            formatDateTime(process.date) || 'N/A'
                                        )}
                                    </td>
                                    {/* Thời gian Bắt đầu */}
                                    <td>
                                        {editingProcessId === process.id ? (
                                            <input
                                                type="time"
                                                name="startTime"
                                                value={currentEditData.startTime || ''}
                                                onChange={handleInputChange}
                                                className={styles.textInput}
                                            />
                                        ) : (
                                            process.startTime || 'N/A'
                                        )}
                                    </td>
                                    {/* Thời gian Kết thúc */}
                                    <td>
                                        {editingProcessId === process.id ? (
                                            <input
                                                type="time"
                                                name="endTime"
                                                value={currentEditData.endTime || ''}
                                                onChange={handleInputChange}
                                                className={styles.textInput}
                                            />
                                        ) : (
                                            process.endTime || 'N/A'
                                        )}
                                    </td>
                                    {/* Hemoglobin */}
                                    <td>
                                        {editingProcessId === process.id ? (
                                            <input
                                                type="number"
                                                name="hemoglobin"
                                                value={currentEditData.hemoglobin || ''}
                                                onChange={handleInputChange}
                                                className={styles.numberInput}
                                                step="0.1"
                                            />
                                        ) : (
                                            process.hemoglobin || 'N/A'
                                        )}
                                    </td>
                                    {/* Huyết áp */}
                                    <td>
                                        {editingProcessId === process.id ? (
                                            <input
                                                type="text"
                                                name="bloodPressure"
                                                value={currentEditData.bloodPressure || ''}
                                                onChange={handleInputChange}
                                                className={styles.textInput}
                                            />
                                        ) : (
                                            process.bloodPressure || 'N/A'
                                        )}
                                    </td>
                                    {/* Số lượng */}
                                    <td>
                                        {editingProcessId === process.id ? (
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={currentEditData.quantity || ''}
                                                onChange={handleInputChange}
                                                className={styles.numberInput}
                                            />
                                        ) : (
                                            process.quantity || 'N/A'
                                        )}
                                    </td>
                                    {/* Loại hiến */}
                                    <td>
                                        {editingProcessId === process.id ? (
                                            <select
                                                name="type"
                                                value={currentEditData.type || ''}
                                                onChange={handleInputChange}
                                                className={styles.selectInput}
                                            >
                                                <option value="">Chọn loại</option>
                                                <option value="WHOLE_BLOOD">Máu toàn phần</option>
                                                <option value="PLASMA">Huyết tương</option>
                                                <option value="PLATELETS">Tiểu cầu</option>
                                                <option value="RED_BLOOD_CELLS">Hồng cầu</option>
                                            </select>
                                        ) : (
                                            process.type || 'N/A'
                                        )}
                                    </td>
                                    {/* Kiểm tra Sức khỏe */}
                                    <td>
                                        {editingProcessId === process.id ? (
                                            <input
                                                type="checkbox"
                                                name="healthCheck"
                                                checked={currentEditData.healthCheck || false}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            process.healthCheck ? 'Đã kiểm tra' : 'Chưa kiểm tra'
                                        )}
                                    </td>
                                    {/* Ghi chú */}
                                    <td>
                                        {editingProcessId === process.id ? (
                                            <textarea
                                                name="notes"
                                                value={currentEditData.notes || ''}
                                                onChange={handleInputChange}
                                                className={styles.textareaInput}
                                            />
                                        ) : (
                                            process.notes || 'Không có'
                                        )}
                                    </td>
                                    {/* Trạng thái */}
                                    <td>
                                        {editingProcessId === process.id ? (
                                            <select
                                                name="process"
                                                value={currentEditData.process || ''}
                                                onChange={handleInputChange}
                                                className={styles.selectInput}
                                            >
                                                <option value="">Chọn trạng thái</option>
                                                {/* Cập nhật các option theo enum StatusProcess mới */}
                                                <option value="IN_PROCESS">Đang tiến hành</option>
                                                <option value="COMPLETED">Hoàn thành</option>
                                                <option value="FAILED">Thất bại</option>
                                            </select>
                                        ) : (
                                            <span className={`${styles.statusBadge} ${styles[process.process ? process.process.toLowerCase() : '']}`}>
                                                {/* Cập nhật logic hiển thị trạng thái */}
                                                {process.process === 'IN_PROCESS' ? 'Đang tiến hành' :
                                                 (process.process === 'COMPLETED' ? 'Hoàn thành' :
                                                 (process.process === 'FAILED' ? 'Thất bại' : 'N/A'))}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {editingProcessId === process.id ? (
                                            <>
                                                <button
                                                    className={styles.saveButton}
                                                    onClick={() => handleUpdateProcess(process.id)}
                                                >
                                                    Lưu
                                                </button>
                                                <button
                                                    className={styles.cancelEditButton}
                                                    onClick={handleCancelEdit}
                                                >
                                                    Hủy
                                                </button>
                                            </>
                                        ) : (
                                            // Chỉ cho phép chỉnh sửa nếu trạng thái chưa phải là COMPLETED hoặc FAILED
                                            process.process !== 'COMPLETED' && process.process !== 'FAILED' && (
                                                <button
                                                    className={styles.editButton}
                                                    onClick={() => handleEditClick(process)}
                                                >
                                                    Chỉnh sửa
                                                </button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DonationProcess;