// src/components/staff-components/mainContent/EmergencyDonationRequestList.jsx
// (hoặc src/components/admin-components/mainContent/EmergencyDonationRequestList.jsx)
import React from 'react';
import styles from './EmergencyDonationRequestList.module.css'; // Đảm bảo file CSS này tồn tại

const EmergencyDonationRequestList = () => {
    // Dữ liệu mẫu cho yêu cầu hiến khẩn cấp
    const requests = [
        { id: 'ED001', donorName: 'Võ Thị G', bloodType: 'O+', location: 'Bệnh viện XYZ', date: '2024-06-01', status: 'Cần gấp' },
        { id: 'ED002', donorName: 'Trần Thanh H', bloodType: 'AB-', location: 'Trung tâm y tế ABC', date: '2024-06-03', status: 'Đã xử lý' },
    ];

    return (
        <div className={styles.tableContainer}>
            <h2>Danh Sách Yêu Cầu Hiến Máu Khẩn Cấp</h2>
            <p>Trang này hiển thị các yêu cầu hiến máu khẩn cấp cần được ưu tiên.</p>

            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th className={styles.tableCell}>ID Yêu Cầu</th>
                        <th className={styles.tableCell}>Tên Người Hiến</th>
                        <th className={styles.tableCell}>Nhóm Máu</th>
                        <th className={styles.tableCell}>Địa điểm</th>
                        <th className={styles.tableCell}>Ngày Yêu Cầu</th>
                        <th className={styles.tableCell}>Trạng Thái</th>
                        <th className={styles.tableCell}>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => (
                        <tr key={request.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>{request.id}</td>
                            <td className={styles.tableCell}>{request.donorName}</td>
                            <td className={styles.tableCell}>{request.bloodType}</td>
                            <td className={styles.tableCell}>{request.location}</td>
                            <td className={styles.tableCell}>{request.date}</td>
                            <td className={styles.tableCell}>{request.status}</td>
                            <td className={styles.tableCell}>
                                <button className={styles.actionButton}>Chi tiết</button>
                                <button className={`${styles.actionButton} ${styles.dangerButton}`}>Cấp cứu</button> {/* Nút cấp cứu */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmergencyDonationRequestList;