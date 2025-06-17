// src/components/LeftPanel/LeftPanel.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import StaffDropdown from './StaffDropdown';
import NavButton from './NavButton';
import RequestManagementDropdown from './RequestManagementDropdown';
import UserManagementDropdown from './UserManagementDropdown';
import ProcessDropdown from './ProcessDropdown';
import HistoryDropdown from './HistoryDropdown';

import styles from './LeftPanel.module.css';

// Import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,           // Trang Chủ
    faUsers,          // Quản Lý Người Dùng
    faClipboardList,  // Quản Lý Yêu Cầu
    faBook,           // Quản Lý Quy Trình
    faHistory,        // Lịch Sử
    faFileAlt,        // Đơn Đăng Ký
    faCalendarAlt,    // Quản Lý Lịch Hiến Máu
    faBox,            // Kho Máu
    faBuilding,       // Điều Phối Liên Cơ Sở
    faHourglassHalf,  // Trạng Thái Hiến Máu
    faBell,           // Thông Báo
    faCalendarCheck,  // Nhắc Nhở Hồi Phục
    faNewspaper,      // Bài Viết Cộng Đồng
    faChartBar,       // Báo Cáo
    faHeadset         // Trung Tâm Hỗ Trợ
} from '@fortawesome/free-solid-svg-icons';

const LeftPanel = ({ onNavClick, activeItem }) => {
    const [isRequestDropdownOpen, setIsRequestDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isProcessDropdownOpen, setIsProcessDropdownOpen] = useState(false);
    const [isHistoryDropdownOpen, setIsHistoryDropdownOpen] = useState(false);

    const user = useSelector(state => state.user);
    const isLoggedIn = !!user?.token;// Giả sử user state có token khi đăng nhập thành công

    // Helper để đóng tất cả các dropdown khác
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

    const handleNavButtonClick = (id) => {
        if (id === 'requestManagement') {
            toggleRequestDropdown();
        } else if (id === 'userManagement') {
            toggleUserDropdown();
        } else if (id === 'process') {
            toggleProcessDropdown();
        } else if (id === 'history') {
            toggleHistoryDropdown();
        }
        else {
            // Nếu là một NavButton độc lập, đóng tất cả dropdown và điều hướng
            closeAllDropdownsExcept(null);
            onNavClick(id);
        }
    };

    const handleUserSubItemClick = (subItemId) => {
        setIsUserDropdownOpen(false);
        onNavClick(subItemId);
    };
    
    const handleRequestSubItemClick = (subItemId) => {
        setIsRequestDropdownOpen(false); // Đóng dropdown sau khi chọn mục con
        onNavClick(subItemId); // Gửi ID của mục con lên Layout
    };

    const handleProcessSubItemClick = (subItemId) => {
        setIsProcessDropdownOpen(false);
        onNavClick(subItemId);
    };

    const handleHistorySubItemClick = (subItemId) => {
        setIsHistoryDropdownOpen(false);
        onNavClick(subItemId);
    };


    // Điều chỉnh lại navItems để khớp với hình ảnh và sử dụng FontAwesome icons
    const navItems = [
        { id: 'home', icon: faHome, label: 'Trang chủ' },
        { id: 'userManagement', icon: faUsers, label: 'Quản Lý Người Dùng', hasDropdown: true }, // Có dropdown
        { id: 'requestManagement', icon: faClipboardList, label: 'Quản Lý Yêu Cầu', hasDropdown: true }, // Có dropdown
        { id: 'process', icon: faBook, label: 'Quy Trình', hasDropdown: true }, // Có dropdown
        { id: 'history', icon: faHistory, label: 'Lịch Sử', hasDropdown: true }, // Có dropdown
        { id: 'registrationList', icon: faFileAlt, label: 'Đơn Đăng Ký' },
        { id: 'scheduleManagement', icon: faCalendarAlt, label: 'Quản Lý Lịch Hiến Máu' },
        { id: 'bloodStock', icon: faBox, label: 'Kho Máu' },
        { id: 'interFacilityCoordination', icon: faBuilding, label: 'Điều Phối Liên Cơ Sở' },
        { id: 'donationStatus', icon: faHourglassHalf, label: 'Trạng Thái Hiến Máu' },
        { id: 'notifications', icon: faBell, label: 'Thông Báo' },
        { id: 'recoveryReminders', icon: faCalendarCheck, label: 'Nhắc Nhở Hồi Phục' },
        { id: 'communityPosts', icon: faNewspaper, label: 'Bài Viết Cộng Đồng' },
        { id: 'reports', icon: faChartBar, label: 'Báo Cáo' },
        { id: 'supportCenter', icon: faHeadset, label: 'Trung Tâm Hỗ Trợ' },
    ];

    return (
        <div className={styles.leftPanel}>
            <StaffDropdown />
            <div className={styles.navButtonsContainer}>
                {navItems.map(item => {
                    // Tính toán trạng thái active cho NavButton
                    const isActive = activeItem === item.id ||
                        (typeof activeItem === 'string' && activeItem.startsWith('request-')) ||
                        (typeof activeItem === 'string' && activeItem.startsWith('user-')) ||
                        (typeof activeItem === 'string' && activeItem.startsWith('process-')) ||
                        (typeof activeItem === 'string' && activeItem.startsWith('history-'));

                    // Logic render cho từng loại mục
                    // --- Start: Logic chung cho các NavButton có dropdown ---
                    if (item.hasDropdown) {
                        let isDropdownOpen;
                        let DropdownComponent;
                        let handleSubItemClick;

                        if (item.id === 'userManagement') {
                            if (!isLoggedIn) return null; // Không render nếu chưa đăng nhập
                            isDropdownOpen = isUserDropdownOpen;
                            DropdownComponent = UserManagementDropdown;
                            handleSubItemClick = handleUserSubItemClick;
                        } else if (item.id === 'requestManagement') {
                            isDropdownOpen = isRequestDropdownOpen;
                            DropdownComponent = RequestManagementDropdown;
                            handleSubItemClick = handleRequestSubItemClick;
                        } else if (item.id === 'process') {
                            isDropdownOpen = isProcessDropdownOpen;
                            DropdownComponent = ProcessDropdown;
                            handleSubItemClick = handleProcessSubItemClick;
                        } else if (item.id === 'history') {
                            isDropdownOpen = isHistoryDropdownOpen;
                            DropdownComponent = HistoryDropdown;
                            handleSubItemClick = handleHistorySubItemClick;
                        }

                        return (
                            <div key={item.id}>
                                <NavButton
                                    icon={<FontAwesomeIcon icon={item.icon} />}
                                    label={item.label}
                                    onClick={() => handleNavButtonClick(item.id)}
                                    isActive={isActive}
                                    hasDropdown={true} // Luôn là true cho các mục này vì chúng có dropdown
                                    isArrowUp={isDropdownOpen}
                                />
                                {isDropdownOpen && (
                                    <DropdownComponent onSelectSubItem={handleSubItemClick} activeItem={activeItem} />
                                )}
                            </div>
                        );
                    }
                    // --- End: Logic chung cho các NavButton có dropdown ---

                    // --- Start: Logic cho các NavButton không có dropdown (độc lập) ---
                    else {
                        return (
                            <NavButton
                                key={item.id}
                                icon={<FontAwesomeIcon icon={item.icon} />}
                                label={item.label}
                                onClick={() => handleNavButtonClick(item.id)}
                                isActive={isActive}
                                hasDropdown={false} // Luôn là false cho các mục này
                            />
                        );
                    }
                    // --- End: Logic cho các NavButton không có dropdown (độc lập) ---
                })}
            </div>
        </div>
    );
};

export default LeftPanel;