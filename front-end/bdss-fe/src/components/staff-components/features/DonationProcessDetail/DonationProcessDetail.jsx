import React from 'react';
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
        console.error("Chuỗi ngày/giờ không hợp lệ:", isoString, e);
        return 'Ngày/giờ không hợp lệ';
    }
};

const DonationProcessDetail = ({ process, onBack, bloodTypes, onUpdate, onCancelEdit, currentEditData, handleInputChange, isEditing }) => {
    if (!process) {
        return <div className={styles.detailContainer}>Không có dữ liệu quy trình để hiển thị.</div>;
    }

    const getBloodTypeName = (bloodTypeId) => {
        const bt = bloodTypes.find(b => b.id === parseInt(bloodTypeId));
        return bt ? `${bt.type}${bt.rhFactor === 'UNKNOWN' ? '' : bt.rhFactor}` : 'N/A';
    };

    return (
        <div className={styles.detailContainer}>
            <button onClick={onBack} className={styles.backButton}>&larr; Quay lại danh sách</button>
            <h2>Chi tiết Quy trình Hiến máu ID: {process.id}</h2>

            <div className={styles.detailCard}>
                <div className={styles.detailItem}>
                    <strong>ID:</strong> {process.id}
                </div>
                <div className={styles.detailItem}>
                    <strong>Người hiến:</strong> {process.donorFullName || 'N/A'}
                </div>
                <div className={styles.detailItem}>
                    <strong>Ngày hiến (Đăng ký):</strong> {formatDateTime(process.scheduleDate) || 'N/A'}
                </div>
                <div className={styles.detailItem}>
                    <strong>Cơ sở (Đăng ký):</strong> {process.medicalFacilityName || 'N/A'}
                </div>
                <div className={styles.detailItem}>
                    <strong>Nhóm máu Đăng ký:</strong> {process.donorBloodType ? `${process.donorBloodType.type}${process.donorBloodType.rhFactor}` : 'N/A'}
                </div>

                <div className={styles.detailItem}>
                    <strong>Nhóm máu Thực tế:</strong>
                    {isEditing ? (
                        <select
                            name="bloodTypeId"
                            value={currentEditData.bloodTypeId || ''}
                            onChange={handleInputChange}
                            className={styles.selectInput}
                        >
                            <option value="">Chọn nhóm máu</option>
                            {bloodTypes.map(bt => (
                                <option key={bt.id} value={bt.id}>
                                    {bt.type}{bt.rhFactor === 'UNKNOWN' ? '' : bt.rhFactor}
                                </option>
                            ))}
                        </select>
                    ) : (
                        getBloodTypeName(process.bloodType ? process.bloodType.id : '') || 'Unknown / Chưa cập nhật'
                    )}
                </div>

                <div className={styles.detailItem}>
                    <strong>Ngày hiến Thực tế:</strong>
                    {isEditing ? (
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
                </div>

                <div className={styles.detailItem}>
                    <strong>Thời gian Bắt đầu:</strong>
                    {isEditing ? (
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
                </div>

                <div className={styles.detailItem}>
                    <strong>Thời gian Kết thúc:</strong>
                    {isEditing ? (
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
                </div>

                <div className={styles.detailItem}>
                    <strong>Hemoglobin:</strong>
                    {isEditing ? (
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
                </div>

                <div className={styles.detailItem}>
                    <strong>Huyết áp:</strong>
                    {isEditing ? (
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
                </div>

                <div className={styles.detailItem}>
                    <strong>Số lượng (ml):</strong>
                    {isEditing ? (
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
                </div>

                <div className={styles.detailItem}>
                    <strong>Loại hiến:</strong>
                    {isEditing ? (
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
                </div>

                <div className={styles.detailItem}>
                    <strong>Kiểm tra Sức khỏe:</strong>
                    {isEditing ? (
                        <input
                            type="checkbox"
                            name="healthCheck"
                            checked={currentEditData.healthCheck || false}
                            onChange={handleInputChange}
                            className={styles.checkboxInput}
                        />
                    ) : (
                        process.healthCheck ? 'Đã kiểm tra' : 'Chưa kiểm tra'
                    )}
                </div>

                <div className={styles.detailItem}>
                    <strong>Ghi chú:</strong>
                    {isEditing ? (
                        <textarea
                            name="notes"
                            value={currentEditData.notes || ''}
                            onChange={handleInputChange}
                            className={styles.textareaInput}
                        />
                    ) : (
                        process.notes || 'Không có'
                    )}
                </div>

                <div className={styles.detailItem}>
                    <strong>Trạng thái:</strong>
                    {isEditing ? (
                        <select
                            name="process" // Tên thuộc tính trong payload
                            value={currentEditData.process || ''}
                            onChange={handleInputChange}
                            className={styles.selectInput}
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="IN_PROCESS">Đang tiến hành</option>
                            <option value="COMPLETED">Hoàn thành</option>
                            <option value="FAILED">Thất bại</option>
                        </select>
                    ) : (
                        <span className={`${styles.statusBadge} ${styles[process.process ? process.process.toLowerCase() : '']}`}>
                            {process.process === 'IN_PROCESS' ? 'Đang tiến hành' :
                                (process.process === 'COMPLETED' ? 'Hoàn thành' :
                                    (process.process === 'FAILED' ? 'Thất bại' : 'N/A'))}
                        </span>
                    )}
                </div>

                <div className={styles.detailActions}>
                    {isEditing ? (
                        <>
                            <button className={styles.saveButton} onClick={() => onUpdate(process.id)}>Lưu</button>
                            <button className={styles.cancelButton} onClick={onCancelEdit}>Hủy</button>
                        </>
                    ) : (
                        process.process !== 'COMPLETED' && process.process !== 'FAILED' && (
                            <button className={styles.editButton} onClick={() => onUpdate(process)}>Chỉnh sửa</button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonationProcessDetail;