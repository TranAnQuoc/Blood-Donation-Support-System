import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import commonStyles from '../leftPanel/commonDropdown.module.css';

const HistoryDropdown = () => {
    const location = useLocation();

    const isSubItemActive = (pathSegment) => {
        return location.pathname.startsWith(`/admin-dashboard/${pathSegment}`);
    };

    const subItems = [
        { id: 'donation-histories', label: 'Lịch Sử Hiến Máu', path: 'donation-histories' },
        { id: 'emergency-histories', label: 'Lịch Sử Nhận Máu Khẩn Cấp', path: 'emergency-histories' },
    ];

    return (
        <ul className={commonStyles.dropdownMenu}>
            {subItems.map(item => (
                <li key={item.id}>
                    <Link
                        to={`/admin-dashboard/${item.path}`}
                        className={`${commonStyles.dropdownMenuItem} ${isSubItemActive(item.path) ? commonStyles.active : ''}`}
                    >
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default HistoryDropdown;