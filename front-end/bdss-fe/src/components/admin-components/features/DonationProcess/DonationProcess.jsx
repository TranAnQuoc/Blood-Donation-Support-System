import React, { useState, useEffect } from 'react';
import axiosInstance from "../../../../configs/axios"; // Đảm bảo đường dẫn đúng đến axiosInstance của bạn
import styles from './DonationProcess.module.css'; // Import CSS module

const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        // Kiểm tra nếu chuỗi chỉ là ngày (YYYY-MM-DD)
        if (isoString.includes('T')) {
            const date = new Date(isoString);
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // Định dạng 24 giờ
            };
            return date.toLocaleString('vi-VN', options);
        } else {
            // Nếu chỉ là ngày, định dạng DD/MM/YYYY
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

const getStatusHealthCheckName = (status) => {
    switch (status) {
        case 'PASS': return 'Đạt';
        case 'FAIL': return 'Không đạt';
        case 'UNKNOWN': return 'Chưa xác định';
        default: return 'N/A';
    }
};

const getGenderName = (gender) => {
    switch (gender) {
        case 'MALE': return 'Nam';
        case 'FEMALE': return 'Nữ';
        case 'OTHER': return 'Khác';
        default: return 'N/A';
    }
};

const getDonationTypeName = (type) => {
    switch (type) {
        case 'WHOLE_BLOOD': return 'Máu toàn phần';
        case 'PLATELETS': return 'Tiểu cầu';
        case 'PLASMA': return 'Huyết tương';
        default: return 'N/A';
    }
};

const DonationProcessList = () => {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedProcessId, setExpandedProcessId] = useState(null); // State để theo dõi quy trình đang mở rộng

    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const response = await axiosInstance.get('/donation-processes/all-list');
                setProcesses(response.data);
            } catch (err) {
                console.error("Error fetching donation processes:", err);
                setError("Không thể tải danh sách quy trình hiến máu.");
            } finally {
                setLoading(false);
            }
        };

        fetchProcesses();
    }, []);

    const toggleDetail = (id) => {
        setExpandedProcessId(prevId => (prevId === id ? null : id)); // Toggle mở/đóng chi tiết
    };

    if (loading) {
        return <div className={styles.loading}>Đang tải danh sách quy trình hiến máu...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Danh Sách Quy Trình Hiến Máu</h1>
            {processes.length === 0 ? (
                <p className={styles.noProcesses}>Không có quy trình hiến máu nào.</p>
            ) : (
                <ul className={styles.processList}>
                    {processes.map((process) => (
                        <li key={process.id} className={`${styles.processItem} ${expandedProcessId === process.id ? styles.expanded : ''}`}>
                            <div className={styles.processSummary}>
                                <div className={styles.processInfo}>
                                    <p><strong>Mã QT:</strong> {process.id}</p>
                                    <p><strong>Người hiến:</strong> {process.donorFullName}</p>
                                    <p><strong>Nhóm máu:</strong> {process.donorBloodType ? `${process.donorBloodType.type}${process.donorBloodType.rhFactor}` : 'N/A'}</p>
                                    <p><strong>Sự kiện:</strong> {process.eventName}</p>
                                    <p><strong>Thời gian bắt đầu:</strong> {formatDateTime(process.startTime)}</p>
                                    <p>
                                        <strong>Trạng thái:</strong>
                                        <span className={`${styles.statusBadge} ${styles[process.process?.toLowerCase()]}`}>
                                            {getStatusProcessName(process.process)}
                                        </span>
                                    </p>
                                    {process.statusHealthCheck && (
                                        <p>
                                            <strong>Sàng lọc:</strong>
                                            <span className={`${styles.statusBadge} ${styles[process.statusHealthCheck?.toLowerCase()]}`}>
                                                {getStatusHealthCheckName(process.statusHealthCheck)}
                                            </span>
                                        </p>
                                    )}
                                </div>
                                <button
                                    className={styles.detailButton}
                                    onClick={() => toggleDetail(process.id)}
                                >
                                    {expandedProcessId === process.id ? 'Thu Gọn' : 'Xem Chi Tiết'}
                                </button>
                            </div>

                            {expandedProcessId === process.id && (
                                <div className={styles.processDetails}>
                                    <h3>Thông tin chi tiết</h3>
                                    <ul>
                                        <li><strong>Ngày sinh:</strong> {formatDateTime(process.donorBirthDate)}</li>
                                        <li><strong>SĐT người hiến:</strong> {process.donorPhone || 'N/A'}</li>
                                        <li><strong>Giới tính:</strong> {getGenderName(process.donorGender)}</li>
                                        <li><strong>Người thực hiện:</strong> {process.performerFullName || 'N/A'}</li>
                                        <li><strong>Thời gian kết thúc:</strong> {process.endTime ? formatDateTime(process.endTime) : 'Chưa kết thúc'}</li>
                                    </ul>

                                    <h4>Thông số sức khỏe:</h4>
                                    <ul>
                                        <li><strong>Nhịp tim:</strong> {process.heartRate || 'N/A'} bpm</li>
                                        <li><strong>Nhiệt độ:</strong> {process.temperature !== null ? `${process.temperature} °C` : 'N/A'}</li>
                                        <li><strong>Cân nặng:</strong> {process.weight !== null ? `${process.weight} kg` : 'N/A'}</li>
                                        <li><strong>Chiều cao:</strong> {process.height !== null ? `${process.height} cm` : 'N/A'}</li>
                                        <li><strong>Hemoglobin:</strong> {process.hemoglobin !== null ? `${process.hemoglobin} g/dL` : 'N/A'}</li>
                                        <li><strong>Huyết áp:</strong> {process.bloodPressure || 'N/A'}</li>
                                        {process.statusHealthCheck === 'FAIL' && (
                                            <li><strong>Lý do thất bại sàng lọc:</strong> {process.failureReason || 'N/A'}</li>
                                        )}
                                    </ul>

                                    <h4>Thông tin hiến máu:</h4>
                                    <ul>
                                        <li><strong>Lượng máu hiến:</strong> {process.quantity !== 0 ? `${process.quantity} ml` : 'N/A'}</li>
                                        <li><strong>Loại hiến:</strong> {getDonationTypeName(process.typeDonation)}</li>
                                        <li><strong>Ghi chú quy trình:</strong> {process.notes || 'Không có'}</li>
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DonationProcessList;