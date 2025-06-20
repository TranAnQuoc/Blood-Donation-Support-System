import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import StaffDropdown from './StaffDropdown';
import NavButton from './NavButton';
import RequestManagementDropdown from './RequestManagementDropdown';
import UserManagementDropdown from './UserManagementDropdown';
import ProcessDropdown from './ProcessDropdown';
import HistoryDropdown from './HistoryDropdown';

import styles from './LeftPanel.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faUsers,
    faClipboardList,
    faBook,
    faHistory,
    faFileAlt,
    faCalendarAlt,
    faBox,
    faBuilding,
    faHourglassHalf,
    faBell,
    faCalendarCheck,
    faNewspaper,
    faChartBar,
    faHeadset
} from '@fortawesome/free-solid-svg-icons';

const LeftPanel = () => {
    const [isRequestDropdownOpen, setIsRequestDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isProcessDropdownOpen, setIsProcessDropdownOpen] = useState(false);
    const [isHistoryDropdownOpen, setIsHistoryDropdownOpen] = useState(false);

    const user = useSelector(state => state.user);
    const isLoggedIn = !!user?.token;

    const location = useLocation();

    const closeAllDropdownsExcept = (dropdownToKeepOpen) => {
        if (dropdownToKeepOpen !== 'request') setIsRequestDropdownOpen(false);
        if (dropdownToKeepOpen !== 'user') setIsUserDropdownOpen(false);
        if (dropdownToKeepOpen !== 'process') setIsProcessDropdownOpen(false);
        if (dropdownToKeepOpen !== 'history') setIsHistoryDropdownOpen(false);
    };

    const toggleUserDropdown = () => {
        closeAllDropdownsExcept('user');
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const toggleRequestDropdown = () => {
        closeAllDropdownsExcept('request');
        setIsRequestDropdownOpen(!isRequestDropdownOpen);
    };

    const toggleProcessDropdown = () => {
        closeAllDropdownsExcept('process');
        setIsProcessDropdownOpen(!isProcessDropdownOpen);
    };

    const toggleHistoryDropdown = () => {
        closeAllDropdownsExcept('history');
        setIsHistoryDropdownOpen(!isHistoryDropdownOpen);
    };

    
    const isNavItemActive = (expectedPathSegment) => {
        if (expectedPathSegment === 'userManagement') {
            return location.pathname.startsWith('/staff-dashboard/user-management');
        }
        if (expectedPathSegment === 'requestManagement') {
            return location.pathname.startsWith('/staff-dashboard/transfusion-requests-management') || location.pathname.startsWith('/staff-dashboard/donation-requests') || location.pathname.startsWith('/staff-dashboard/emergency-transfusion-requests');
        }
        if (expectedPathSegment === 'process') {
            return location.pathname.startsWith('/staff-dashboard/donation-processes') || location.pathname.startsWith('/staff-dashboard/transfusion-processes') || location.pathname.startsWith('/staff-dashboard/emergency-transfusion-processes');
        }
        if (expectedPathSegment === 'history') {
            return location.pathname.startsWith('/staff-dashboard/donation-histories');
        }

        if (expectedPathSegment === '') {
            return location.pathname === '/staff-dashboard' || location.pathname === '/staff-dashboard/';
        }
        return location.pathname.startsWith(`/staff-dashboard/${expectedPathSegment}`);
    };

    const navItems = [
        { id: 'home', icon: faHome, label: 'Trang chủ', fullPath: '/staff-dashboard' },
        { id: 'userManagement', icon: faUsers, label: 'Quản Lý Người Dùng', hasDropdown: true },
        { id: 'requestManagement', icon: faClipboardList, label: 'Quản Lý Yêu Cầu', hasDropdown: true },
        { id: 'process', icon: faBook, label: 'Quy Trình', hasDropdown: true },
        { id: 'history', icon: faHistory, label: 'Lịch Sử', hasDropdown: true },
        { id: 'registrationList', icon: faFileAlt, label: 'Đơn Đăng Ký', fullPath: '/staff-dashboard/registration-list' },
        { id: 'scheduleManagement', icon: faCalendarAlt, label: 'Quản Lý Lịch Hiến Máu', fullPath: '/staff-dashboard/schedule-management' },
        { id: 'bloodStock', icon: faBox, label: 'Kho Máu', fullPath: '/staff-dashboard/blood-stock' },
        { id: 'interFacilityCoordination', icon: faBuilding, label: 'Điều Phối Liên Cơ Sở', fullPath: '/staff-dashboard/inter-facility-coordination' },
        { id: 'donationStatus', icon: faHourglassHalf, label: 'Trạng Thái Hiến Máu', fullPath: '/staff-dashboard/donation-status' },
        { id: 'notifications', icon: faBell, label: 'Thông Báo', fullPath: '/staff-dashboard/notifications' },
        { id: 'recoveryReminders', icon: faCalendarCheck, label: 'Nhắc Nhở Hồi Phục', fullPath: '/staff-dashboard/recovery-reminders' },
        { id: 'communityPosts', icon: faNewspaper, label: 'Bài Viết Cộng Đồng', fullPath: '/staff-dashboard/community-posts' },
        { id: 'reports', icon: faChartBar, label: 'Báo Cáo', fullPath: '/staff-dashboard/reports' },
        { id: 'supportCenter', icon: faHeadset, label: 'Trung Tâm Hỗ Trợ', fullPath: '/staff-dashboard/support-center' },
    ];

    return (
        <div className={styles.leftPanel}>
            <StaffDropdown />
            <div className={styles.navButtonsContainer}>
                {navItems.map(item => {
                    const handleNavButtonClick = () => {
                        if (item.id === 'userManagement') toggleUserDropdown();
                        else if (item.id === 'requestManagement') toggleRequestDropdown();
                        else if (item.id === 'process') toggleProcessDropdown();
                        else if (item.id === 'history') toggleHistoryDropdown();
                        else {
                            closeAllDropdownsExcept(null);
                        }
                    };

                    let isDropdownOpen = false;
                    let DropdownComponent = null;

                    if (item.id === 'userManagement') {
                        if (!isLoggedIn) return null;
                        isDropdownOpen = isUserDropdownOpen;
                        DropdownComponent = UserManagementDropdown;
                    } else if (item.id === 'requestManagement') {
                        isDropdownOpen = isRequestDropdownOpen;
                        DropdownComponent = RequestManagementDropdown;
                    } else if (item.id === 'process') {
                        isDropdownOpen = isProcessDropdownOpen;
                        DropdownComponent = ProcessDropdown;
                    } else if (item.id === 'history') {
                        isDropdownOpen = isHistoryDropdownOpen;
                        DropdownComponent = HistoryDropdown;
                    }

                    return (
                        <div key={item.id}>
                            {item.hasDropdown ? (
                                <>
                                    <NavButton
                                        icon={<FontAwesomeIcon icon={item.icon} />}
                                        label={item.label}
                                        onClick={handleNavButtonClick}
                                        isActive={isNavItemActive(item.id)}
                                        hasDropdown={true}
                                        isArrowUp={isDropdownOpen}
                                    />
                                    {isDropdownOpen && DropdownComponent && (
                                        <DropdownComponent />
                                    )}
                                </>
                            ) : (
                                <Link
                                    to={item.fullPath}
                                    className={`${styles.navItem} ${isNavItemActive(item.path || item.id) ? styles.active : ''}`}
                                    onClick={handleNavButtonClick}
                                >
                                    <NavButton
                                        icon={<FontAwesomeIcon icon={item.icon} />}
                                        label={item.label}
                                        isActive={isNavItemActive(item.path || item.id)}
                                        hasDropdown={false}
                                    />
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LeftPanel;