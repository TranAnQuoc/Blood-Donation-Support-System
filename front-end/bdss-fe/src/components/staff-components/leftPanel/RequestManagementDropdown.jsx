import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import commonStyles from '../leftPanel/commonDropdown.module.css';

const RequestManagementDropdown = () => {
    const location = useLocation();

    const isSubItemActive = (pathSegment) => {
        return location.pathname.startsWith(`/staff-dashboard/${pathSegment}`);
    };

    const subItems = [
        // { id: 'donation-requests', label: 'Yêu Cầu Hiến Máu', path: 'donation-requests' },
        { id: 'transfusion-requests-management', label: 'Yêu Cầu Nhận Máu', path: 'transfusion-requests-management' },
        { id: 'emergency-transfusion-requests', label: 'Yêu Cầu Nhận Máu Khẩn Cấp', path: 'emergency-transfusion-requests' },
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

export default RequestManagementDropdown;