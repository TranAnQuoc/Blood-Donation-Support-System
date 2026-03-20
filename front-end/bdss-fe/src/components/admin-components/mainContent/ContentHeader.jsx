// src/components/MainContent/ContentHeader.jsx
import React from 'react';
import Logo from '../../../commons/Logo';
import SearchBar from './SearchBar';
import NotificationIcon from './NotificationIcon';
import styles from './ContentHeader.module.css';
import { FaBell, FaBars } from 'react-icons/fa';
import logoImage from '../../../assets/logo.png';

const ContentHeader = () => {
  return (
    <div className={styles.contentHeader}>
      <div className={styles.logoContainer}>
        <Logo text="SAVE A LIFE DONATE BLOOD" imageUrl={logoImage} />
      </div>
      <div className={styles.rightSection}>
        {/* <SearchBar />
        <FaBars className={styles.menuIcon} />
        <NotificationIcon count={5} /> */}
      </div>
    </div>
  );
};

export default ContentHeader;