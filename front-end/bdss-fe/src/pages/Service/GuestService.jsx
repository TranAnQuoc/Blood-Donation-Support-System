import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GuestService.module.css';

const GuestService = () => {
    return (
        <div className={styles.dashboardContainer}>
            <h1>Chào mừng, Quý khách!</h1>
            <p>Tại đây bạn có thể đăng ký hiến máu, yêu cầu nhận máu và theo dõi lịch sử của mình.</p>

        </div>
        
    );
};

export default GuestService;