// src/components/staff-components/leftPanel/RequestManagementDropdown.jsx
import React from 'react';
import styles from './RequestManagementDropdown.module.css';

const RequestManagementDropdown = ({ onSelectSubItem, activeItem }) => {
    const subItems = [
        { id: 'request-donation', label: 'Yêu Cầu Hiến Máu' },
        { id: 'request-transfusion', label: 'Yêu Cầu Nhận Máu' },
        { id: 'request-emergency-transfusion', label: 'Yêu Cầu Nhận Khẩn Cấp' },
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

export default RequestManagementDropdown;