// src/components/LeftPanel/LeftPanel.jsx
import React from 'react';
import AdminDropdown from './AdminDropdown';
import NavButton from './NavButton';
import styles from './LeftPanel.module.css';

const LeftPanel = ({ onNavClick }) => {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Trang chủ' },
    { id: 'employees', icon: '👤', label: 'Danh Sách Nhân Viên' },
    { id: 'members', icon: '👥', label: 'Danh Sách Thành Viên' },
    { id: 'bloodRequests', icon: '🩸', label: 'Yêu Cầu Nhận Máu' },
    { id: 'bloodDonations', icon: '❤️', label: 'Yêu Cầu Hiến Máu' },
    { id: 'bloodStock', icon: '📦', label: 'Kho Máu' },
    { id: 'coordination', icon: '🔗', label: 'Điều Phối Liên Cơ Sở' },
    { id: 'donationStatus', icon: '⏳', label: 'Trạng Thái Hiến Máu' },
    { id: 'notifications', icon: '✉️', label: 'Thông Báo' },
    { id: 'reminders', icon: '🔔', label: 'Nhắc Nhở Hồi Phục' },
    { id: 'communityPosts', icon: '✍️', label: 'Bài Viết Cộng Đồng' },
    { id: 'reports', icon: '📊', label: 'Báo Cáo' },
    { id: 'support', icon: '❓', label: 'Trung Tâm Hỗ Trợ' },
  ];

  return (
    <div className={styles.leftPanel}>
      <AdminDropdown adminName="Nguyen" />
      <div className={styles.navButtonsContainer}>
        {navItems.map(item => (
          <NavButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            onClick={() => onNavClick(item.label)} // Gửi tên trang khi click
          />
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;