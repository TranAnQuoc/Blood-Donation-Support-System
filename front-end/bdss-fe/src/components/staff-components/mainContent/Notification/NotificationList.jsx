// src/components/MainContent/NotificationList.jsx
import React from 'react';
import styles from './NotificationList.module.css';

const NotificationList = ({ notifications, onClose }) => {
  return (
    <div className={styles.dropdown}>
      <div className={styles.header}>
        <span>Thông báo</span>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
      </div>
      <ul className={styles.list}>
        {notifications.length === 0 ? (
          <li className={styles.empty}>Không có thông báo</li>
        ) : (
          notifications.map((notification, index) => (
            <li key={index} className={styles.item}>
              {notification.message}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationList;
