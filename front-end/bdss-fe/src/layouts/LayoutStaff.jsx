// src/components/Layout/DashboardLayout.jsx
import React, { useState } from 'react';
import LeftPanel from "../components/staff-components/leftPanel/LeftPanel";
import MainContent from "../components/staff-components/mainContent/MainContent";
import styles from './LayoutStaff.module.css';

const LayoutStaff = () => {
    const [activePage, setActivePage] = useState('home');

    const handleNavClick = (pageName) => {
        setActivePage(pageName);
    };

    return (
        <div className={styles.dashboardLayout}>
            {/* TRUYỀN PROP activeItem XUỐNG LEFT PANEL */}
            <LeftPanel onNavClick={handleNavClick} activeItem={activePage} />
            <MainContent activePage={activePage} />
        </div>
    );
};

export default LayoutStaff;