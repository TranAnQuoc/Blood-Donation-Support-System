import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MemberDashboard.module.css';
import EventSearchAndList from '../../components/member-components/features/EventSearchAndList/EventSearchAndList';
import BloodDonationParticipationStandard from '../../components/common/BloodDonationParticipationStandard/BloodDonationParticipationStandard';
import BloodDonationRecommendation from '../../components/common/BloodDonationRecommendation/BloodDonationRecommendation';
// import Banner from '../../components/common/Banner/Banner';

const MemberDashboard = () => {
    return (
        <div className={styles.dashboardContainer}>
            {/* <div className={styles.bannerSection}>
                <Banner />
            </div> */}

            <h1>Chào mừng, Thành viên!</h1>
            <p>Tại đây bạn có thể đăng ký hiến máu, yêu cầu nhận máu và theo dõi lịch sử của mình.</p>

            <div className={styles.eventSection}>
                <EventSearchAndList />
            </div>

            {/* <div className={styles.featureGrid}>
                <div className={styles.featureCard}>
                    <h3>Đăng ký Hiến máu</h3>
                    <p>Đăng ký lịch hiến máu sắp tới của bạn.</p>
                    <Link to="/member/register-donation" className={styles.actionButton}>Đăng ký ngay</Link>
                </div>

                <div className={styles.featureCard}>
                    <h3>Yêu cầu Nhận máu</h3>
                    <p>Gửi yêu cầu nhận máu cho bản thân hoặc người thân.</p>
                    <Link to="/member/request-transfusion" className={styles.actionButton}>Yêu cầu nhận máu</Link>
                </div>
            </div> */}

            <div className={styles.standardSection}>
                <BloodDonationParticipationStandard/>
            </div>

            <div className={styles.recommendSection}>
                <BloodDonationRecommendation/>
            </div>
        </div>
        
    );
};

export default MemberDashboard;