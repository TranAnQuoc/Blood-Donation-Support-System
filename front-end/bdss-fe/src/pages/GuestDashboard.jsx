import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GuestDashboard.module.css';

const MemberDashboard = () => {
    return (
        <div className={styles.dashboardContainer}>
            <h1>Chào mừng, Khách!</h1>
        </div>
    );
};

export default MemberDashboard;