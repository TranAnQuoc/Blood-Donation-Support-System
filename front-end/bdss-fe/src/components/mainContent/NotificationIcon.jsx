// src/components/MainContent/NotificationIcon.jsx
import React from 'react';
import styles from './NotificationIcon.module.css';
import { FaBell } from 'react-icons/fa';

const NotificationIcon = ({ count }) => {
  return (
    <div className={styles.notificationIcon}>
      <FaBell className={styles.bellIcon} />
      {count > 0 && <span className={styles.notificationCount}>{count}</span>}
    </div>
  );
};

export default NotificationIcon;