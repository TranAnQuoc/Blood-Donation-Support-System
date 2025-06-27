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

// Hàm mới để dịch trạng thái sang tiếng Việt
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

const DonationProcessDetail = ({ 
    process, 
    onBack, 
    //bloodTypes, 
    onStartEdit, 
    onSave,      
    onCancelEdit, 
    currentEditData, 
    handleInputChange, 
    isEditing 
}) => {
    if (!process) {
        return <div className={styles.detailContainer}>Không có dữ liệu quy trình để hiển thị.</div>;
    }

    const getBloodTypeName = (bloodTypeObj) => {
        if (!bloodTypeObj) return 'N/A';
        return `${bloodTypeObj.type}${bloodTypeObj.rhFactor === 'UNKNOWN' ? '' : bloodTypeObj.rhFactor}`;
    };

    const isCompleted = process.process === 'COMPLETED';

    if (isCompleted) {
        return (
            <div className={styles.detailContainer}>
                <button onClick={onBack} className={styles.backButton}>&larr; Quay lại danh sách</button>
                <h2>Chi tiết Quy trình Hiến máu ID: {process.id} (Đã hoàn thành)</h2>
                <div className={styles.detailCard}>
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Thông tin Đăng ký</legend>
                        <div className={styles.detailItem}><strong>Người hiến:</strong> {process.donorFullName || 'N/A'}</div>
                        <div className={styles.detailItem}><strong>Ngày sinh:</strong> {formatDateTime(process.donorBirthDate) || 'N/A'}</div>
                        <div className={styles.detailItem}><strong>Số điện thoại:</strong> {process.donorPhone || 'N/A'}</div>
                        <div className={styles.detailItem}><strong>Giới tính:</strong> {process.donorGender || 'N/A'}</div>
                        <div className={styles.detailItem}><strong>Nhóm máu Đăng ký:</strong> {getBloodTypeName(process.donorBloodType)}</div>
                        <div className={styles.detailItem}><strong>Sự kiện:</strong> {process.eventName || 'N/A'}</div>
                        <div className={styles.detailItem}><strong>Thời gian sự kiện:</strong> {formatDateTime(process.startTime) || 'N/A'} - {formatDateTime(process.endTime) || 'N/A'}</div>
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Thông tin Khám sàng lọc</legend>
                        <div className={styles.detailItem}><strong>Nhịp tim:</strong> {process.heartRate || 'N/A'}</div>
                        <div className={styles.detailItem}><strong>Nhiệt độ:</strong> {process.temperature || 'N/A'} °C</div>
                        <div className={styles.detailItem}><strong>Cân nặng:</strong> {process.weight || 'N/A'} kg</div>
                        <div className={styles.detailItem}><strong>Chiều cao:</strong> {process.height || 'N/A'} cm</div>
                        <div className={styles.detailItem}><strong>Hemoglobin:</strong> {process.hemoglobin || 'N/A'} g/dL</div>
                        <div className={styles.detailItem}><strong>Huyết áp:</strong> {process.bloodPressure || 'N/A'}</div>
                        <div className={styles.detailItem}><strong>Mắc bệnh mãn tính:</strong> {process.hasChronicDisease ? 'Có' : 'Không'}</div>
                        <div className={styles.detailItem}><strong>Mới xăm hình:</strong> {process.hasRecentTattoo ? 'Có' : 'Không'}</div>
                        <div className={styles.detailItem}><strong>Sử dụng ma túy:</strong> {process.hasUsedDrugs ? 'Có' : 'Không'}</div>
                        <div className={styles.detailItem}><strong>Ghi chú sàng lọc:</strong> {process.screeningNote || 'Không có'}</div>
                        <div className={styles.detailItem}><strong>Kết quả kiểm tra sức khỏe chung:</strong> {process.healthCheck ? 'Đạt' : 'Không đạt / Chưa xác định'}</div>
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Thông tin Hiến máu thực tế</legend>
                        <div className={styles.detailItem}><strong>Số lượng:</strong> {process.quantity || 'N/A'} ml</div>
                        <div className={styles.detailItem}><strong>Loại hiến:</strong> {process.typeDonation || 'N/A'}</div>
                        <div className={styles.detailItem}><strong>Ghi chú:</strong> {process.notes || 'Không có'}</div>
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Trạng thái Quy trình</legend>
                        <div className={styles.detailItem}>
                            <strong>Trạng thái:</strong>
                            <span className={`${styles.statusBadge} ${styles[process.process ? process.process.toLowerCase() : '']}`}>
                                {getStatusName(process.process)} {/* SỬ DỤNG HÀM MỚI */}
                            </span>
                        </div>
                        <div className={styles.detailItem}><strong>Người thực hiện:</strong> {process.performerFullName || 'N/A'}</div>
                    </fieldset>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.detailContainer}>
            <button onClick={onBack} className={styles.backButton}>&larr; Quay lại danh sách</button>
            <h2>Chi tiết Quy trình Hiến máu ID: {process.id}</h2>

            <div className={styles.detailCard}>
                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Thông tin Đăng ký</legend>
                    <div className={styles.detailItem}><strong>Người hiến:</strong> {process.donorFullName || 'N/A'}</div>
                    <div className={styles.detailItem}><strong>Ngày sinh:</strong> {formatDateTime(process.donorBirthDate) || 'N/A'}</div>
                    <div className={styles.detailItem}><strong>Số điện thoại:</strong> {process.donorPhone || 'N/A'}</div>
                    <div className={styles.detailItem}><strong>Giới tính:</strong> {process.donorGender || 'N/A'}</div>
                    <div className={styles.detailItem}><strong>Nhóm máu Đăng ký:</strong> {getBloodTypeName(process.donorBloodType)}</div>
                    <div className={styles.detailItem}><strong>Sự kiện:</strong> {process.eventName || 'N/A'}</div>
                    <div className={styles.detailItem}><strong>Thời gian sự kiện:</strong> {formatDateTime(process.startTime) || 'N/A'} - {formatDateTime(process.endTime) || 'N/A'}</div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Thông tin Khám sàng lọc</legend>
                    <div className={styles.detailItem}>
                        <strong>Nhịp tim:</strong>
                        {isEditing ? (
                            <input type="text" name="heartRate" value={currentEditData.heartRate || ''} onChange={handleInputChange} className={styles.textInput} />
                        ) : (
                            process.heartRate || 'N/A'
                        )}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Nhiệt độ (°C):</strong>
                        {isEditing ? (
                            <input type="number" name="temperature" value={currentEditData.temperature || ''} onChange={handleInputChange} className={styles.numberInput} step="0.1" />
                        ) : (
                            process.temperature || 'N/A'
                        )}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Cân nặng (kg):</strong>
                        {isEditing ? (
                            <input type="number" name="weight" value={currentEditData.weight || ''} onChange={handleInputChange} className={styles.numberInput} step="0.1" />
                        ) : (
                            process.weight || 'N/A'
                        )}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Chiều cao (cm):</strong>
                        {isEditing ? (
                            <input type="number" name="height" value={currentEditData.height || ''} onChange={handleInputChange} className={styles.numberInput} step="0.1" />
                        ) : (
                            process.height || 'N/A'
                        )}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Hemoglobin (g/dL):</strong>
                        {isEditing ? (
                            <input type="number" name="hemoglobin" value={currentEditData.hemoglobin || ''} onChange={handleInputChange} className={styles.numberInput} step="0.1" />
                        ) : (
                            process.hemoglobin || 'N/A'
                        )}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Huyết áp:</strong>
                        {isEditing ? (
                            <input type="text" name="bloodPressure" value={currentEditData.bloodPressure || ''} onChange={handleInputChange} className={styles.textInput} />
                        ) : (
                            process.bloodPressure || 'N/A'
                        )}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Mắc bệnh mãn tính:</strong>
                        {isEditing ? (
                            <input type="checkbox" name="hasChronicDisease" checked={currentEditData.hasChronicDisease || false} onChange={handleInputChange} className={styles.checkboxInput} />
                        ) : (
                            process.hasChronicDisease ? 'Có' : 'Không'
                        )}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Mới xăm hình:</strong>
                        {isEditing ? (
                            <input type="checkbox" name="hasRecentTattoo" checked={currentEditData.hasRecentTattoo || false} onChange={handleInputChange} className={styles.checkboxInput} />
                        ) : (
                            process.hasRecentTattoo ? 'Có' : 'Không'
                        )}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Sử dụng ma túy:</strong>
                        {isEditing ? (
                            <input type="checkbox" name="hasUsedDrugs" checked={currentEditData.hasUsedDrugs || false} onChange={handleInputChange} className={styles.checkboxInput} />
                        ) : (
                            process.hasUsedDrugs ? 'Có' : 'Không'
                        )}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Ghi chú sàng lọc:</strong>
                        {isEditing ? (
                            <textarea name="screeningNote" value={currentEditData.screeningNote || ''} onChange={handleInputChange} className={styles.textareaInput} />
                        ) : (
                            process.screeningNote || 'Không có'
                        )}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Kết quả kiểm tra sức khỏe chung:</strong>
                        {isEditing ? (
                            <input type="checkbox" name="healthCheck" checked={currentEditData.healthCheck || false} onChange={handleInputChange} className={styles.checkboxInput} />
                        ) : (
                            process.healthCheck ? 'Đạt' : 'Không đạt / Chưa xác định'
                        )}
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Thông tin Hiến máu thực tế</legend>
                    <div className={styles.detailItem}>
                        <strong>Số lượng (ml):</strong>
                        {isEditing ? (
                            <input type="number" name="quantity" value={currentEditData.quantity || ''} onChange={handleInputChange} className={styles.numberInput} />
                        ) : (
                            process.quantity || 'N/A'
                        )}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Loại hiến:</strong>
                        {isEditing ? (
                            <select name="typeDonation" value={currentEditData.typeDonation || ''} onChange={handleInputChange} className={styles.selectInput}>
                                <option value="">Chọn loại</option>
                                <option value="WHOLE_BLOOD">Máu toàn phần</option>
                                <option value="PLASMA">Huyết tương</option>
                                <option value="PLATELETS">Tiểu cầu</option>
                                <option value="RED_BLOOD_CELLS">Hồng cầu</option>
                            </select>
                        ) : (
                            process.typeDonation || 'N/A'
                        )}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Ghi chú:</strong>
                        {isEditing ? (
                            <textarea name="notes" value={currentEditData.notes || ''} onChange={handleInputChange} className={styles.textareaInput} />
                        ) : (
                            process.notes || 'Không có'
                        )}
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Trạng thái Quy trình</legend>
                    <div className={styles.detailItem}>
                        <strong>Trạng thái:</strong>
                        {isEditing ? (
                            <select name="process" value={currentEditData.process || ''} onChange={handleInputChange} className={styles.selectInput}>
                                <option value="">Chọn trạng thái</option>
                                <option value="WAITING" disabled>Đang chờ</option> {/* WAITING thường không được chọn lại */}
                                <option value="SCREENING">Đang sàng lọc</option>
                                <option value="SCREENING_FAILED">Sàng lọc thất bại</option>
                                <option value="IN_PROCESS">Đang tiến hành</option>
                                <option value="COMPLETED">Hoàn thành</option>
                                <option value="FAILED">Thất bại</option>
                                <option value="DONOR_CANCEL">Người hiến hủy bỏ</option>
                            </select>
                        ) : (
                            <span className={`${styles.statusBadge} ${styles[process.process ? process.process.toLowerCase() : '']}`}>
                                {getStatusName(process.process)} {/* SỬ DỤNG HÀM MỚI */}
                            </span>
                        )}
                    </div>
                    <div className={styles.detailItem}><strong>Người thực hiện:</strong> {process.performerFullName || 'N/A'}</div>
                </fieldset>

                <div className={styles.detailActions}>
                    {isEditing ? (
                        <>
                            <button className={styles.saveButton} onClick={() => onSave(process.id)}>Lưu</button>
                            <button className={styles.cancelButton} onClick={onCancelEdit}>Hủy</button>
                        </>
                    ) : (
                        (process.process !== 'COMPLETED' && process.process !== 'WAITING' && process.process !== 'SCREENING_FAILED' && process.process !== 'DONOR_CANCEL') && (
                            <button className={styles.editButton} onClick={() => onStartEdit(process)}>Chỉnh sửa</button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonationProcessDetail;