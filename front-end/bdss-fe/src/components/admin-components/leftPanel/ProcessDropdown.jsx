import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import commonStyles from '../leftPanel/commonDropdown.module.css';

const ProcessDropdown = () => {
    const location = useLocation();

    const isSubItemActive = (pathSegment) => {
        return location.pathname.startsWith(`/admin-dashboard/${pathSegment}`);
    };

    const subItems = [
        { id: 'donation-process', label: 'Quy Trình Hiến', path: 'donation-processes' },
        { id: 'transfusion-process', label: 'Quy Trình Nhận', path: 'transfusion-processes' },
        { id: 'emergency-transfusion-process', label: 'Quy Trình Nhận Khẩn Cấp', path: 'emergency-transfusion-processes' },
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

export default ProcessDropdown;