import React from 'react';
import styles from './index.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.contactInfo}>
                    <h3>LIÊN HỆ</h3>
                    <div className={styles.addressSection}>
                        <h4>TT Hiến Máu Nhân Đạo</h4>
                        <div className={styles.contactItem}>
                            <i className="fas fa-map-marker-alt"></i>
                            <p>466 Nguyễn Thị Minh Khai, Phường 2, Quận 3, Thành phố Hồ Chí Minh</p>
                            <span className={styles.phone}>028 3868 5502</span>
                        </div>
                        <div className={styles.contactItem}>
                            <i className="fas fa-map-marker-alt"></i>
                            <p>106 Thiên Phước, Phường 9, Tân Bình, Thành phố Hồ Chí Minh</p>
                            <span className={styles.phone}>028 3868 5507</span>
                        </div>
                    </div>

                    <div className={styles.addressSection}>
                        <h4>Bệnh viện BTH</h4>
                        <div className={styles.contactItem}>
                            <i className="fas fa-map-marker-alt"></i>
                            <p>106 Thiên Phước, Phường 9, Tân Bình, Thành phố Hồ Chí Minh</p>
                            <span className={styles.phone}>028 39571342</span>
                        </div>
                        <div className={styles.contactItem}>
                            <i className="fas fa-map-marker-alt"></i>
                            <p>106 Thiên Phước, Phường 9, Tân Bình, Thành phố Hồ Chí Minh</p>
                            <span className={styles.phone}>028 39557858</span>
                        </div>
                    </div>

                    <div className={styles.addressSection}>
                        <h4>TT truyền máu Chợ Rẫy</h4>
                        <div className={styles.contactItem}>
                            <i className="fas fa-map-marker-alt"></i>
                            <p>56 Phạm Hữu Chí, Phường 12, Quận 5, Thành phố Hồ Chí Minh</p>
                            <span className={styles.phone}>028 39555885</span>
                        </div>
                    </div>
                </div>

                <div className={styles.supportInfo}>
                    <h3>HỖ TRỢ</h3>
                    <ul>
                        <li><a href="#">Điều khoản sử dụng</a></li>
                        {/* Add more support links as needed */}
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;