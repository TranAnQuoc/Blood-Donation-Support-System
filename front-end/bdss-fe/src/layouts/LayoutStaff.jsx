import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftPanel from '../components/staff-components/leftPanel/LeftPanel';
import ContentHeader from '../components/staff-components/mainContent/ContentHeader';
import styles from './LayoutStaff.module.css';

const LayoutStaff = () => {
    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.mainContentArea}>
                <LeftPanel />
                <div className={styles.outletContainer}>
                    <ContentHeader />
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default LayoutStaff;