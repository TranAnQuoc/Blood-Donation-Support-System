// src/components/staff-components/mainContent/TransfusionRequestList.jsx
// (hoặc src/components/admin-components/mainContent/TransfusionRequestList.jsx)
import React from 'react';
import styles from './TransfusionRequestList.module.css'; // Đảm bảo file CSS này tồn tại

const TransfusionRequestList = () => {
    // Dữ liệu mẫu
    const requests = [
        { id: 'TR001', patientName: 'Nguyễn Thị X', requiredBloodType: 'O+', units: 2, date: '2024-05-09', status: 'Đang xử lý' },
        { id: 'TR002', patientName: 'Trần Văn Y', requiredBloodType: 'A-', units: 1, date: '2024-05-11', status: 'Hoàn thành' },
        { id: 'TR003', patientName: 'Phạm Thị Z', requiredBloodType: 'B+', units: 3, date: '2024-05-14', status: 'Đang chờ' },
    ];

    return (
        <div className={styles.tableContainer}>
            <h2>Danh Sách Yêu Cầu Nhận Máu</h2>
            <p>Đây là trang quản lý các yêu cầu nhận máu từ bệnh viện hoặc cá nhân.</p>

            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th className={styles.tableCell}>ID Yêu Cầu</th>
                        <th className={styles.tableCell}>Tên Bệnh Nhân</th>
                        <th className={styles.tableCell}>Nhóm Máu Cần</th>
                        <th className={styles.tableCell}>Đơn Vị</th>
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
                            <td className={styles.tableCell}>{request.date}</td>
                            <td className={styles.tableCell}>{request.status}</td>
                            <td className={styles.tableCell}>
                                <button className={styles.actionButton}>Xem chi tiết</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransfusionRequestList;