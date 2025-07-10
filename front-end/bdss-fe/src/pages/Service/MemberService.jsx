import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MemberService.module.css';
import BloodDonationParticipationStandard from '../../components/common/BloodDonationParticipationStandard/BloodDonationParticipationStandard';
import BloodDonationRecommendation from '../../components/common/BloodDonationRecommendation/BloodDonationRecommendation';

const MemberService = () => {
    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.pageTitle}>Các Dịch Vụ Dành Cho Thành Viên</h1>
            {/* <p className={styles.introText}>Truy cập và quản lý các dịch vụ hiến máu của bạn tại đây.</p> */}

            <div className={styles.featureGrid}>
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

                <div className={styles.featureCard}>
                    <h3>Đơn Đăng Ký Của Tôi</h3>
                    <p>Xem lại trạng thái và chi tiết các đơn đăng ký hiến máu của bạn.</p>
                    <Link to="/member/my-donation-request" className={styles.actionButton}>Xem đơn</Link>
                </div>

                <div className={styles.featureCard}>
                    <h3>Quá Trình hiến  Của Tôi</h3>
                    <p>Xem lại trạng thái và chi tiết các đơn đăng ký hiến máu của bạn.</p>
                    <Link to="/member/my-donation-process" className={styles.actionButton}>Xem quy trình</Link>
                </div>

                <div className={styles.featureCard}>
                    <h3>Lịch Sử Hiến Máu</h3>
                    <p>Xem lại lịch sử các lần hiến máu đã hoàn thành của bạn.</p>
                    <Link to="/member/my-donation-history" className={styles.actionButton}>Xem lịch sử</Link>
                </div>

                <div className={styles.featureCard}>
                    <h3>Tra Cứu Nhóm Máu</h3>
                    <p>Tra cứu thông tin phù hợp giữa các nhóm máu của người nhận và người hiến.</p>
                    <Link to="/member/SearchMatchBlood" className={styles.actionButton}>Tra Cứu</Link>
                </div>
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

export default MemberService;