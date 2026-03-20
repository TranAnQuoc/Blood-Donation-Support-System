import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CommonEmergency.module.css';

const CommonEmergency = () => {
    return (
        <div className={styles.dashboardContainer}>
            <h2 className={styles.pageTitle}>Dịch Vụ Khẩn Cấp</h2>
            <p className={styles.introText}>
                Bạn có thể đăng ký yêu cầu nhận máu khẩn cấp ngay bây giờ.
            </p>

            <div className={styles.featureGrid}>
                <div className={styles.featureCard}>
                    <h3 className={styles.cardTitle}>Đăng ký nhận máu khẩn cấp</h3>
                    <p className={styles.cardDescription}>Gửi yêu cầu nhận máu khẩn cấp cho bản thân hoặc người thân.</p>
                    <Link to="/emergency-request" className={styles.actionButton}>Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
};

export default CommonEmergency;
