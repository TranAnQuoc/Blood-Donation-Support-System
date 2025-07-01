import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GuestDashboard.module.css';
import BloodDonationParticipationStandard from '../../components/common/BloodDonationParticipationStandard/BloodDonationParticipationStandard';

const GuestDashboard = () => {
    return (
        <div className={styles.dashboardContainer}>
            <h1>Chào mừng, Quý khách!</h1>

            <div className={styles.standardSection}>
                <BloodDonationParticipationStandard/>
            </div>
        </div>
    );
};

export default GuestDashboard;