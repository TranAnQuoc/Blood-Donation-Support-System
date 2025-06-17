// src/components/staff-components/leftPanel/HistoryDropdown.jsx
import React from 'react';
import styles from './HistoryDropdown.module.css'; // Tạo file CSS này

const HistoryDropdown = ({ onSelectSubItem, activeItem }) => {
    const subItems = [
        { id: 'history-donations', label: 'Lịch Sử Hiến Máu' },
        { id: 'history-transfusions', label: 'Lịch Sử Nhận Máu' },
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

export default HistoryDropdown;