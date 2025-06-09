import React from 'react';
import styles from './index.module.css'; // Đảm bảo import đúng tên file CSS Module
import logo from '../../assets/logo.png'; 

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.mainContent}>
                <div className={styles.logoArea}>
                    <img src={logo} alt="Save a Life - Donate Blood" className={styles.logoImage} />
                    <div className={styles.logoText}>
                        <p>SAVE A LIFE</p>
                        <p>DONATE BLOOD</p>
                    </div>
                </div>
            </div>
            <div className={styles.mainNav}>
                <nav>
                    <ul>
                        <li><a href="#">HOME</a></li>
                        <li><a href="#">SERVICE</a></li>
                        <li><a href="#">EMERGENCY</a></li>
                        <li><a href="#">COMMUNITY</a></li>
                        <li><a href="#">ABOUT US</a></li>
                        <li><a href="#">BLOG</a></li>
                        <li><a href="#">LOGIN</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;