// src/components/staff-components/leftPanel/ProcessDropdown.jsx
import React from 'react';
import styles from './ProcessDropdown.module.css';

const ProcessDropdown = ({ onSelectSubItem, activeItem }) => {
    const subItems = [
        { id: 'process-donation', label: 'Quy Trình Hiến' },
        { id: 'process-transfusion', label: 'Quy Trình Nhận' },
        { id: 'process-emergency-transfusion', label: 'Quy Trình Nhận Khẩn Cấp' },
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

export default ProcessDropdown;