// src/components/MainContent/MainContent.jsx
import React from 'react';
import ContentHeader from './ContentHeader';


import styles from './MainContent.module.css';

const MainContent = ({ activePage }) => {
  const renderPage = () => {
    switch (activePage) {
      case 'Trang chủ':
        return <div>Main dashboard</div>;;
      case 'Danh Sách Nhân Viên':
        return <div>List staff</div>;;
      case 'Danh Sách Thành Viên':
        return <div>Nội dung Danh Sách Thành Viên</div>;
      case 'Yêu Cầu Nhận Máu':
        return <div>Nội dung Yêu Cầu Nhận Máu</div>;

      default:
        return <div>Chọn một mục từ menu bên trái</div>;
    }
  };

  return (
    <div className={styles.mainContent}>
      <ContentHeader />
      <div className={styles.contentArea}>
        {renderPage()} {/* Hiển thị nội dung của trang hiện tại */}
      </div>
    </div>
  );
};

export default MainContent;