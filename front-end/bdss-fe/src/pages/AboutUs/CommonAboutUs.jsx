import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CommonAboutUs.module.css';

const CommonAboutUs = () => {
    return (
        <div className={styles.dashboardContainer}>
            <h2 className={styles.pageTitle}>Về Chúng Tôi</h2>
            <p className={styles.introText}>
                Bạn có thể xem thông tin về chúng tôi tại đây.
            </p>
        </div>
    );
};

export default CommonAboutUs;