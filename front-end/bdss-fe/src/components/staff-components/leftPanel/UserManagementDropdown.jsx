import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import commonStyles from '../leftPanel/commonDropdown.module.css';

const UserManagementDropdown = () => {
    const location = useLocation();

    const isSubItemActive = (pathSegment) => {
        return location.pathname.startsWith(`/staff-dashboard/${pathSegment}`);
    };

    const subItems = [
        { id: 'staff-list', label: 'Danh Sách Nhân Viên', path: 'user-management/staff-list' },
        { id: 'member-list', label: 'Danh Sách Thành Viên', path: 'user-management/member-list' },
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

export default UserManagementDropdown;