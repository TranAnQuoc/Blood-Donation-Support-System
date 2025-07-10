import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GuestDashboard.module.css';
import EventSearchAndList from '../../components/member-components/features/EventSearchAndList/EventSearchAndList';
import BloodDonationParticipationStandard from '../../components/common/BloodDonationParticipationStandard/BloodDonationParticipationStandard';
import BloodDonationRecommendation from '../../components/common/BloodDonationRecommendation/BloodDonationRecommendation';

const GuestDashboard = () => {
    return (
        <div className={styles.dashboardContainer}>
            <h1>Chào mừng, Quý khách!</h1>

            <div className={styles.eventSection}>
                <EventSearchAndList />
            </div>

            <div className={styles.standardSection}>
                <BloodDonationParticipationStandard/>
            </div>

            <div className={styles.recommendSection}>
                <BloodDonationRecommendation/>
            </div>
        </div>
    );
};

export default GuestDashboard;