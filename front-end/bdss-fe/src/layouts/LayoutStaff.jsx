// src/components/Layout/DashboardLayout.jsx
import React, { useState } from 'react';
import LeftPanel from '../components/staff-components/leftPanel/LeftPanel';
import MainContent from '../components/staff-components/mainContent/MainContent';
import styles from './LayoutStaff.module.css';

const LayoutStaff = () => {
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

export default LayoutStaff;