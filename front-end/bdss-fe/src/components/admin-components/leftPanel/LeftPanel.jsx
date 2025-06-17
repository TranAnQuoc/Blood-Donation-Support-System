// src/components/LeftPanel/LeftPanel.jsx
import React from 'react';
import AdminDropdown from './AdminDropdown';
import NavButton from './NavButton';
import styles from './LeftPanel.module.css';

// Import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,           // Trang chủ
  faUsers,          // Quản Lý Người Dùng
  faClipboardList,  // Quản Lý Yêu Cầu
  faBox,            // Kho Máu
  faBuilding,       // Điều Phối Liên Cơ Sở
  faHourglassHalf,  // Trạng Thái Hiến Máu
  faBell,           // Thông Báo
  faCalendarCheck,  // Nhắc Nhở Hồi Phục
  faNewspaper,      // Bài Viết Cộng Đồng
  faChartBar,       // Báo Cáo
  faHeadset         // Trung Tâm Hỗ Trợ
} from '@fortawesome/free-solid-svg-icons';

const LeftPanel = ({ onNavClick }) => {
  const navItems = [
    { id: 'home', icon: faHome, label: 'Trang chủ' },
    { id: 'userManagement', icon: faUsers, label: 'Quản Lý Người Dùng', hasDropdown: true }, // Có mũi tên sổ xuống
    { id: 'requestManagement', icon: faClipboardList, label: 'Quản Lý Yêu Cầu', hasDropdown: true }, // Có mũi tên sổ xuống
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
      <AdminDropdown adminName="Admin" /> {/* Đảm bảo prop adminName được sử dụng đúng cách trong AdminDropdown */}
      <div className={styles.navButtonsContainer}>
        {navItems.map(item => (
          <NavButton
            key={item.id}
            // Truyền FontAwesome icon object trực tiếp vào prop icon
            icon={<FontAwesomeIcon icon={item.icon} />}
            label={item.label}
            onClick={() => onNavClick(item.id)} // Khuyên dùng gửi item.id thay vì item.label để quản lý routing dễ hơn
            hasDropdown={item.hasDropdown} // Truyền prop hasDropdown nếu có
          />
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;