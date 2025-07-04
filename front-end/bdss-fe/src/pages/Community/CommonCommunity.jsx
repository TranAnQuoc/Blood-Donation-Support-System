import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CommonCommunity.module.css';

const CommonCommunity = () => {
    return (
        <div className={styles.dashboardContainer}>
            <h2 className={styles.pageTitle}>Cộng Đồng</h2>
            <p className={styles.introText}>
                Bạn có thể xem các bài viết cộng đồng.
            </p>
        </div>
    );
};

export default CommonCommunity;