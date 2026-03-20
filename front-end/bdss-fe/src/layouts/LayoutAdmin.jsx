import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftPanel from '../components/admin-components/leftPanel/LeftPanel';
import ContentHeader from '../components/admin-components/mainContent/ContentHeader';
import styles from './LayoutAdmin.module.css';

const LayoutAdmin = () => {
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

export default LayoutAdmin;