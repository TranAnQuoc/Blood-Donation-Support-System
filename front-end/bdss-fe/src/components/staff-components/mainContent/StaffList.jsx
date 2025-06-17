// src/components/staff-components/mainContent/StaffList.jsx
import React from 'react';
import styles from './StaffList.module.css'; // Tạo file CSS này

const StaffList = () => {
    const staffMembers = [
        { id: 'NV001', name: 'Nguyễn Văn Khoa', position: 'Quản lý', email: 'khoa.nv@example.com' },
        { id: 'NV002', name: 'Trần Thị Mỹ', position: 'Y tá', email: 'my.tt@example.com' },
        { id: 'NV003', name: 'Lê Văn Đạt', position: 'Hành chính', email: 'dat.lv@example.com' },
    ];

    return (
        <div className={styles.tableContainer}>
            <h2>Danh Sách Nhân Viên</h2>
            <p>Quản lý thông tin các nhân viên trong hệ thống.</p>

            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th className={styles.tableCell}>ID</th>
                        <th className={styles.tableCell}>Họ và Tên</th>
                        <th className={styles.tableCell}>Chức vụ</th>
                        <th className={styles.tableCell}>Email</th>
                        <th className={styles.tableCell}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {staffMembers.map(staff => (
                        <tr key={staff.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>{staff.id}</td>
                            <td className={styles.tableCell}>{staff.name}</td>
                            <td className={styles.tableCell}>{staff.position}</td>
                            <td className={styles.tableCell}>{staff.email}</td>
                            <td className={styles.tableCell}>
                                <button className={styles.actionButton}>Sửa</button>
                                <button className={`${styles.actionButton} ${styles.deleteButton}`}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StaffList;