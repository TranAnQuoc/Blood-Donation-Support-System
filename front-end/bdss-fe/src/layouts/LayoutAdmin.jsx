// src/components/Layout/DashboardLayout.jsx
import React, { useState } from 'react';
import LeftPanel from '../components/admin-components/leftPanel/LeftPanel';
import MainContent from '../components/admin-components/mainContent/MainContent';
import styles from './LayoutAdmin.module.css';

const LayoutAdmin = () => {
  const [activePage, setActivePage] = useState('Trang chủ'); // Mặc định là 'Trang chủ'

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
  };

  return (
    <div className={styles.dashboardLayout}>
      <LeftPanel onNavClick={handleNavClick} />
      <MainContent activePage={activePage} />
    </div>
  );
};

export default LayoutAdmin;