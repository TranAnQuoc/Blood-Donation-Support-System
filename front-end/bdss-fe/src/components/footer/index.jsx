import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faClock } from '@fortawesome/free-solid-svg-icons';
import styles from './index.module.css';
import logo from '../../assets/logo.png';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const Footer = () => {
    const user = useSelector((state) => state.user);
    const isAuthenticated = !!user;
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.contactInfoMain}>
                    <div className={styles.logoContainer}>
                        <img src={logo} alt="Logo" className={styles.footerLogo} />
                        <h2 className={styles.logoText}>SAVE A LIFE - DONATION BLOOD</h2>
                    </div>
                    <div className={styles.contactItem}>
                        <FontAwesomeIcon icon={faClock} className={styles.mainContactIcon} />
                        <p><span className={styles.contactLabel}>Giờ mở cửa:</span> Thứ 2 - Thứ 6: 8h00 - 18h00</p>
                    </div>
                    <div className={styles.contactItem}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.mainContactIcon} />
                        <p><span className={styles.contactLabel}>Địa chỉ:</span> 7 Đường D1, P. Long Thạch Mỹ, Thủ Đức, TP. Hồ Chí Minh</p>
                    </div>
                    <div className={styles.contactItem}>
                        <FontAwesomeIcon icon={faPhone} className={styles.mainContactIcon} />
                        <p><span className={styles.contactLabel}>Điện thoại:</span> 012 345 6789</p>
                    </div>
                </div>

                <div className={styles.serviceSection}>
                    <h3>Dịch vụ</h3>
                    <ul>
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <li><Link to="/member/register-donation" className={styles.footerLink}>Đăng ký hiến máu</Link></li>
                        ) : (
                            <li><Link to="/login" className={styles.footerLink}>Đăng ký hiến máu</Link></li>
                        )}
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <li><Link to="/member/request-transfusion" className={styles.footerLink}>Đăng ký nhận máu</Link></li>
                        ) : (
                            <li><Link to="/login" className={styles.footerLink}>Đăng ký nhận máu</Link></li>
                        )}
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <li><Link to="/member/emergency" className={styles.footerLink}>Đăng ký nhận máu khẩn cấp</Link></li>
                        ) : (
                            <li><Link to="/emergency" className={styles.footerLink}>Đăng ký nhận máu khẩn cấp</Link></li>
                        )}
                    </ul>
                </div>

                <div className={styles.quickLinkSection}>
                    <h3>Liên kết nhanh</h3>
                    <ul>
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <li><Link to="/member" className={styles.footerLink}>Trang chủ</Link></li>
                        ) : (
                            <li><Link to="/" className={styles.footerLink}>Trang chủ</Link></li>
                        )}
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <li><Link to="/member/member-service" className={styles.footerLink}>Dịch vụ</Link></li>
                        ) : (
                            <li><Link to="/service" className={styles.footerLink}>Dịch vụ</Link></li>
                        )}
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <li><Link to="/member/about-us" className={styles.footerLink}>Về chúng tôi</Link></li>
                        ) : (
                            <li><Link to="/about-us" className={styles.footerLink}>Về chúng tôi</Link></li>
                        )}
                    </ul>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p>&copy; {new Date().getFullYear()} Save A Life - Donate Blood. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
