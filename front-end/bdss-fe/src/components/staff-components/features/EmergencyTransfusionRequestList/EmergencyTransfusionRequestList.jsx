import React from 'react';
import styles from './EmergencyTransfusionRequestList.module.css'; // Đảm bảo file CSS này tồn tại

const EmergencyTransfusionRequestList = () => {
    // Dữ liệu mẫu cho yêu cầu nhận máu khẩn cấp
    const requests = [
        { id: 'ET001', patientName: 'Nguyễn Văn K', requiredBloodType: 'B+', units: 4, location: 'Phòng cấp cứu', date: '2024-06-02', status: 'Chờ phân phối' },
        { id: 'ET002', patientName: 'Phạm Thị L', requiredBloodType: 'A-', units: 2, location: 'Phòng mổ', date: '2024-06-04', status: 'Đã hoàn tất' },
    ];

    return (
        <div className={styles.tableContainer}>
            <h2>Danh Sách Yêu Cầu Nhận Máu Khẩn Cấp</h2>
            <p>Trang này hiển thị các yêu cầu nhận máu khẩn cấp cần được cung cấp ngay lập tức.</p>

            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th className={styles.tableCell}>ID Yêu Cầu</th>
                        <th className={styles.tableCell}>Tên Bệnh Nhân</th>
                        <th className={styles.tableCell}>Nhóm Máu Cần</th>
                        <th className={styles.tableCell}>Số Đơn Vị</th>
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
                            <td className={styles.tableCell}>{request.patientName}</td>
                            <td className={styles.tableCell}>{request.requiredBloodType}</td>
                            <td className={styles.tableCell}>{request.units}</td>
                            <td className={styles.tableCell}>{request.location}</td>
                            <td className={styles.tableCell}>{request.date}</td>
                            <td className={styles.tableCell}>{request.status}</td>
                            <td className={styles.tableCell}>
                                <button className={styles.actionButton}>Chi tiết</button>
                                <button className={`${styles.actionButton} ${styles.dangerButton}`}>Phân phối</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmergencyTransfusionRequestList;