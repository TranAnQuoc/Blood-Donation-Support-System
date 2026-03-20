import React, { useState, useEffect } from 'react';
import axiosInstance from "../../../../configs/axios"; // Đảm bảo đường dẫn đúng đến axiosInstance của bạn
import styles from './DonationRequest.module.css'; // Import CSS module

const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatusRequestName = (status) => {
    switch (status) {
        case 'PENDING': return 'Đang chờ';
        case 'APPROVED': return 'Đã duyệt';
        case 'REJECTED': return 'Từ chối';
        case 'CANCELLED': return 'Đã hủy';
        default: return 'Không xác định';
    }
};

const DonationRequestList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRequestId, setExpandedRequestId] = useState(null); // State để theo dõi yêu cầu đang mở rộng

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axiosInstance.get('/donation-requests/list');
                setRequests(response.data);
            } catch (err) {
                console.error("Error fetching donation requests:", err);
                setError("Không thể tải danh sách yêu cầu hiến máu.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const toggleDetail = (id) => {
        setExpandedRequestId(prevId => (prevId === id ? null : id)); // Toggle mở/đóng chi tiết
    };

    if (loading) {
        return <div className={styles.loading}>Đang tải danh sách yêu cầu...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    const booleanToText = (value) => {
        if (value === null) return 'Không xác định';
        return value ? 'Có' : 'Không';
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Danh Sách Yêu Cầu Hiến Máu</h1>
            {requests.length === 0 ? (
                <p className={styles.noRequests}>Không có yêu cầu hiến máu nào.</p>
            ) : (
                <ul className={styles.requestList}>
                    {requests.map((request) => (
                        <li key={request.id} className={`${styles.requestItem} ${expandedRequestId === request.id ? styles.expanded : ''}`}>
                            <div className={styles.requestSummary}>
                                <div className={styles.requestInfo}>
                                    <p><strong>Mã Yêu Cầu:</strong> {request.id}</p>
                                    <p><strong>Người Hiến:</strong> {request.donorFullName}</p>
                                    <p><strong>Nhóm Máu:</strong> {request.donorBloodType ? `${request.donorBloodType.type}${request.donorBloodType.rhFactor}` : 'N/A'}</p>
                                    <p><strong>Sự Kiện:</strong> {request.eventName}</p>
                                    <p><strong>Thời Gian Yêu Cầu:</strong> {formatDateTime(request.requestTime)}</p>
                                    <p>
                                        <strong>Trạng Thái:</strong>
                                        <span className={`${styles.statusBadge} ${styles[request.statusRequest?.toLowerCase()]}`}>
                                            {getStatusRequestName(request.statusRequest)}
                                        </span>
                                    </p>
                                </div>
                                <button
                                    className={styles.detailButton}
                                    onClick={() => toggleDetail(request.id)}
                                >
                                    {expandedRequestId === request.id ? 'Thu Gọn' : 'Xem Chi Tiết'}
                                </button>
                            </div>

                            {expandedRequestId === request.id && (
                                <div className={styles.requestDetails}>
                                    <h3>Thông tin chi tiết</h3>
                                    <p><strong>Giới tính:</strong> {request.donorGender || 'N/A'}</p>
                                    <p><strong>Thời gian được duyệt:</strong> {request.approvedTime ? formatDateTime(request.approvedTime) : 'Chưa được duyệt'}</p>
                                    <p><strong>Ghi chú:</strong> {request.note || 'Không có'}</p>

                                    <h4>Khảo sát sức khỏe:</h4>
                                    <ul>
                                        <li><strong>Khỏe mạnh hôm nay:</strong> {booleanToText(request.isHealthyToday)}</li>
                                        <li><strong>Có triệu chứng bệnh:</strong> {booleanToText(request.hasSymptoms)}</li>
                                        <li><strong>Có bệnh truyền nhiễm:</strong> {booleanToText(request.hasInfectiousDiseases)}</li>
                                        <li><strong>Quan hệ tình dục không an toàn:</strong> {booleanToText(request.unsafeSex)}</li>
                                        <li><strong>Phẫu thuật/Xăm gần đây:</strong> {booleanToText(request.recentSurgeryTattoo)}</li>
                                        <li><strong>Tiêm chủng gần đây:</strong> {booleanToText(request.recentVaccination)}</li>
                                        <li><strong>Đang dùng thuốc:</strong> {booleanToText(request.onMedication)}</li>
                                        <li><strong>Có bệnh mãn tính:</strong> {booleanToText(request.hasChronicDisease)}</li>
                                        {request.hasChronicDisease && <li><strong>Chi tiết bệnh mãn tính:</strong> {request.chronicDiseaseNote || 'N/A'}</li>}
                                        <li><strong>Số ngày kể từ lần hiến cuối:</strong> {request.lastDonationDays !== null ? `${request.lastDonationDays} ngày` : 'Chưa từng hiến trước đây.'}</li>
                                        <li><strong>Có phản ứng phụ lần hiến trước:</strong> {booleanToText(request.hadReactionPreviousDonation)}</li>
                                        {request.hadReactionPreviousDonation && <li><strong>Chi tiết phản ứng phụ:</strong> {request.previousReactionNote || 'N/A'}</li>}
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

export default DonationRequestList;