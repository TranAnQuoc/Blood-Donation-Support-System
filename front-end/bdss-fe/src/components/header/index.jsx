import React from 'react';
import styles from './index.module.css'; // Đảm bảo import đúng tên file CSS Module
import logo from '../../assets/logo.png'; 
import { Link } from 'react-router-dom';

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
                        <li><Link to="/">HOME</Link></li>
                        <li><Link to="/">SERVICE</Link></li>
                        <li><Link to="/">EMERGENCY</Link></li>
                        <li><Link to="/">COMMUNITY</Link></li>
                        <li><Link to="/">ABOUT US</Link></li>
                        <li><Link to="/">BLOG</Link></li>
                        <li><Link to="/login">LOGIN</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;