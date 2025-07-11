import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import StaffDropdown from './StaffDropdown';
import NavButton from './NavButton';
import RequestManagementDropdown from './RequestManagementDropdown';
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
    faCalendarAlt,
    faBox,
    faCalendarCheck,
    // faNewspaper,
    faChartBar,
    // faHeadset
} from '@fortawesome/free-solid-svg-icons';

const LeftPanel = () => {
    const [isRequestDropdownOpen, setIsRequestDropdownOpen] = useState(false);
    const [isProcessDropdownOpen, setIsProcessDropdownOpen] = useState(false);
    const [isHistoryDropdownOpen, setIsHistoryDropdownOpen] = useState(false);

    const user = useSelector(state => state.user);
    const isLoggedIn = !!user?.token;

    const location = useLocation();

    const closeAllDropdownsExcept = (dropdownToKeepOpen) => {
        if (dropdownToKeepOpen !== 'request') setIsRequestDropdownOpen(false);
        if (dropdownToKeepOpen !== 'process') setIsProcessDropdownOpen(false);
        if (dropdownToKeepOpen !== 'history') setIsHistoryDropdownOpen(false);
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
        { id: 'home', icon: faHome, label: 'Trang Chủ', fullPath: '/staff-dashboard' },
        { id: 'memberList', icon: faUsers, label: 'Danh Sách Thành Viên', fullPath: '/staff-dashboard/member-list' },
        { id: 'requestManagement', icon: faClipboardList, label: 'Quản Lý Yêu Cầu', hasDropdown: true },
        { id: 'process', icon: faBook, label: 'Quy Trình', hasDropdown: true },
        { id: 'history', icon: faHistory, label: 'Lịch Sử', hasDropdown: true },
        { id: 'eventManagement', icon: faCalendarAlt, label: 'Quản Lý Sự Kiện Hiến Máu', fullPath: '/staff-dashboard/event-management' },
        { id: 'bloodStock', icon: faBox, label: 'Kho Máu', fullPath: '/staff-dashboard/blood-storage' },
        { id: 'recoveryReminders', icon: faCalendarCheck, label: 'Nhắc Nhở Hồi Phục', fullPath: '/staff-dashboard/recovery-reminders' },
        // { id: 'communityPosts', icon: faNewspaper, label: 'Bài Viết Cộng Đồng', fullPath: '/staff-dashboard/community-posts' },
        { id: 'reports', icon: faChartBar, label: 'Báo Cáo', fullPath: '/staff-dashboard/reports' },
        // { id: 'supportCenter', icon: faHeadset, label: 'Trung Tâm Hỗ Trợ', fullPath: '/staff-dashboard/support-center' },
    ];

    return (
        <div className={styles.leftPanel}>
            <StaffDropdown />
            <div className={styles.navButtonsContainer}>
                {navItems.map(item => {
                    const handleNavButtonClick = () => {
                        if (item.id === 'requestManagement') toggleRequestDropdown();
                        else if (item.id === 'process') toggleProcessDropdown();
                        else if (item.id === 'history') toggleHistoryDropdown();
                        else {
                            closeAllDropdownsExcept(null);
                        }
                    };

                    let isDropdownOpen = false;
                    let DropdownComponent = null;

                    if (item.id === 'requestManagement') {
                        isDropdownOpen = isRequestDropdownOpen;
                        DropdownComponent = RequestManagementDropdown;
                    } else if (item.id === 'process') {
                        isDropdownOpen = isProcessDropdownOpen;
                        DropdownComponent = ProcessDropdown;
                    } else if (item.id === 'history') {
                        isDropdownOpen = isHistoryDropdownOpen;
                        DropdownComponent = HistoryDropdown;
                    }

                    if (item.id === 'memberList' && !isLoggedIn) {
                        return null;
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
            
            <div className={styles.leftPanelFooter}>
                <p>&copy; 2025 Save A Life - Donate Blood. All rights reserved.</p>
            </div>
        </div>
    );
};

export default LeftPanel;