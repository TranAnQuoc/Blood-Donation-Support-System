import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import commonStyles from '../leftPanel/commonDropdown.module.css';

const ProcessDropdown = () => {
    const location = useLocation();

    const isSubItemActive = (pathSegment) => {
        return location.pathname.startsWith(`/staff-dashboard/${pathSegment}`);
    };

    const subItems = [
        { id: 'donation-process', label: 'Quá Trình Hiến Máu', path: 'donation-processes' },
        { id: 'emergency-transfusion-process', label: 'Quá Trình Nhận Máu Khẩn Cấp', path: 'emergency-transfusion-processes' },
    ];

    return (
        <ul className={commonStyles.dropdownMenu}>
            {subItems.map(item => (
                <li key={item.id}>
                    <Link
                        to={`/staff-dashboard/${item.path}`}
                        className={`${commonStyles.dropdownMenuItem} ${isSubItemActive(item.path) ? commonStyles.active : ''}`}
                    >
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default ProcessDropdown;