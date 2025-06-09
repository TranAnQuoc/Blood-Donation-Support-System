// src/components/LeftPanel/NavButton.jsx
import React from 'react';
import styles from './NavButton.module.css';

const NavButton = ({ icon, label, onClick }) => {
  return (
    <button className={styles.navButton} onClick={onClick}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </button>
  );
};

export default NavButton;