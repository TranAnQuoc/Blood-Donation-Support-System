// src/components/staff-components/mainContent/MemberList.jsx
import React from 'react';
import styles from './MemberList.module.css'; // Tạo file CSS này

const MemberList = () => {
    const members = [
        { id: 'MB001', name: 'Đỗ Thị Hương', bloodType: 'A+', lastDonation: '2024-03-15', status: 'Active' },
        { id: 'MB002', name: 'Phạm Quang Minh', bloodType: 'B-', lastDonation: '2024-01-20', status: 'Inactive' },
        { id: 'MB003', name: 'Hoàng Văn Trung', bloodType: 'O-', lastDonation: '2024-05-01', status: 'Active' },
    ];

    return (
        <div className={styles.tableContainer}>
            <h2>Danh Sách Thành Viên</h2>
            <p>Tổng hợp và quản lý thông tin các thành viên đã đăng ký hiến/nhận máu.</p>

            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th className={styles.tableCell}>ID</th>
                        <th className={styles.tableCell}>Họ và Tên</th>
                        <th className={styles.tableCell}>Nhóm Máu</th>
                        <th className={styles.tableCell}>Lần hiến gần nhất</th>
                        <th className={styles.tableCell}>Trạng thái</th>
                        <th className={styles.tableCell}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(member => (
                        <tr key={member.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>{member.id}</td>
                            <td className={styles.tableCell}>{member.name}</td>
                            <td className={styles.tableCell}>{member.bloodType}</td>
                            <td className={styles.tableCell}>{member.lastDonation}</td>
                            <td className={styles.tableCell}>{member.status}</td>
                            <td className={styles.tableCell}>
                                <button className={styles.actionButton}>Xem hồ sơ</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MemberList;