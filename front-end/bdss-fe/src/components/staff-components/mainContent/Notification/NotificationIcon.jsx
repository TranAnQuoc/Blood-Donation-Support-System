import React from 'react';
import styles from './NotificationIcon.module.css';
import { FaBell } from 'react-icons/fa';

const NotificationIcon = ({ count = 0, onClick }) => {
  const displayCount = count > 99 ? '99+' : count;

  return (
    <div className={styles.notificationIcon} onClick={onClick} title="Thông báo">
      <FaBell className={styles.bellIcon} />
      {count > 0 && (
        <span className={styles.notificationCount}>
          {displayCount}
        </span>
      )}
    </div>
  );
};

export default NotificationIcon;
