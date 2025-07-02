import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GuestService.module.css';

const GuestService = () => {
    return (
        <div className={styles.dashboardContainer}>
            <h1>Chào mừng, Quý khách!</h1>
            <p>Bạn vui lòng nhập để có thể đăng ký hiến máu, yêu cầu nhận máu và theo dõi lịch sử của mình.</p>

            <div className={styles.featureGrid}>
                <div className={styles.featureCard}>
                    <h3>Đăng ký Hiến máu</h3>
                    <p>Đăng ký lịch hiến máu sắp tới của bạn.</p>
                    <Link to="/login" className={styles.actionButton}>Đăng ký ngay</Link>
                </div>
            
                <div className={styles.featureCard}>
                    <h3>Yêu cầu Nhận máu</h3>
                    <p>Gửi yêu cầu nhận máu cho bản thân hoặc người thân.</p>
                    <Link to="/login" className={styles.actionButton}>Yêu cầu nhận máu</Link>
                </div>
            
                <div className={styles.featureCard}>
                    <h3>Đơn Đăng Ký Của Tôi</h3>
                    <p>Xem lại trạng thái và chi tiết các đơn đăng ký hiến máu của bạn.</p>
                    <Link to="/login" className={styles.actionButton}>Xem đơn</Link>
                </div>
            
                <div className={styles.featureCard}>
                    <h3>Lịch Sử Hiến Máu</h3>
                    <p>Xem lại lịch sử các lần hiến máu đã hoàn thành của bạn.</p>
                    <Link to="/login" className={styles.actionButton}>Xem lịch sử</Link>
                </div>
            </div>
        </div>
        
    );
};

export default GuestService;