// src/components/Common/Logo.jsx
import React from 'react';
import styles from './Logo.module.css';

const Logo = ({ text, imageUrl }) => {
  return (
    <div className={styles.logo}>
      {imageUrl && <img src={imageUrl} alt="Logo" className={styles.logoImage} />}
      <span className={styles.logoText}>{text}</span>
    </div>
  );
};

export default Logo;