// src/components/staff-components/leftPanel/UserManagementDropdown.jsx
import React from 'react';
import styles from './UserManagementDropdown.module.css'; // Tạo file CSS này

const UserManagementDropdown = ({ onSelectSubItem, activeItem }) => {
    const subItems = [
        { id: 'user-staff-list', label: 'Danh Sách Nhân Viên' },
        { id: 'user-member-list', label: 'Danh Sách Thành Viên' },
    ];

    return (
        <ul className={styles.dropdownMenu}>
            {subItems.map(item => (
                <li
                    key={item.id}
                    className={`${styles.dropdownMenuItem} ${activeItem === item.id ? styles.active : ''}`}
                    onClick={() => onSelectSubItem(item.id)}
                >
                    {item.label}
                </li>
            ))}
        </ul>
    );
};

export default UserManagementDropdown;