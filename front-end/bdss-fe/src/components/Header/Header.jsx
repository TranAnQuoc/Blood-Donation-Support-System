import React from 'react';
import styles from './Header.module.css';
import logo from '../../assets/logo.png'; 

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.topBar}>
                <div className={styles.languageSelect}>
                    <span>VN</span> | <span>EN</span>
                </div>
                <div className={styles.logo}>
                    <img src={logo} alt="Save a Life - Donate Blood" />
                    <div className={styles.logoText}>
                        <p>SAVE A LIFE</p>
                        <p>DONATE BLOOD</p>
                    </div>
                </div>
                <div className={styles.authLinks}>
                    <a href="#">
                        <i className="fas fa-user-circle"></i> Đăng nhập
                    </a>
                </div>
            </div>
            <div className={styles.mainNav}>
                <nav>
                    <ul>
                        <li><a href="#">TRANG CHỦ</a></li>
                        <li><a href="#">CỘNG ĐỒNG</a></li>
                        <li><a href="#">LIÊN HỆ</a></li>
                        <li><a href="#">HỎI - ĐÁP</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;