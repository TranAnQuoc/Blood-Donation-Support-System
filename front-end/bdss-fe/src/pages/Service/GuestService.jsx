import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GuestService.module.css';
import BloodDonationParticipationStandard from '../../components/common/BloodDonationParticipationStandard/BloodDonationParticipationStandard';
import BloodDonationRecommendation from '../../components/common/BloodDonationRecommendation/BloodDonationRecommendation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeartbeat,
    // faSyringe,
    faClipboardList,
    faTasks,
    faHistory,
    faSearch,
    faBell
} from '@fortawesome/free-solid-svg-icons';

const GuestService = () => {
    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.pageTitle}>Các Dịch Vụ Dành Cho Thành Viên</h1>

            <div className={styles.featureGrid}>
                <div className={styles.featureCard}>
                    <div className={styles.iconWrapper}>
                        <FontAwesomeIcon icon={faHeartbeat} className={styles.featureIcon} />
                    </div>
                    <h3 className={styles.cardTitle}>Đăng ký Hiến máu</h3>
                    <p className={styles.cardDescription}>Đăng ký lịch hiến máu sắp tới của bạn.</p>
                    <Link to="/login" className={styles.actionButton}>
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                        </svg>
                    </Link>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.iconWrapper}>
                        <FontAwesomeIcon icon={faHeartbeat} className={styles.featureIcon} />
                    </div>
                    <h3 className={styles.cardTitle}>Yêu cầu Nhận máu</h3>
                    <p className={styles.cardDescription}>Gửi yêu cầu nhận máu cho bản thân hoặc người thân.</p>
                    <Link to="/login" className={styles.actionButton}>
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                        </svg>
                    </Link>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.iconWrapper}>
                        <FontAwesomeIcon icon={faClipboardList} className={styles.featureIcon} />
                    </div>
                    <h3 className={styles.cardTitle}>Đơn Đăng Ký Hiến Máu Của Tôi</h3>
                    <p className={styles.cardDescription}>Xem lại trạng thái và chi tiết các đơn đăng ký hiến máu của bạn.</p>
                    <Link to="/login" className={styles.actionButton}>
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                        </svg>
                    </Link>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.iconWrapper}>
                        <FontAwesomeIcon icon={faTasks} className={styles.featureIcon} />
                    </div>
                    <h3 className={styles.cardTitle}>Quá Trình Hiến Máu Của Tôi</h3>
                    <p className={styles.cardDescription}>Theo dõi quá trình hiến máu hiện tại của bạn.</p>
                    <Link to="/login" className={styles.actionButton}>
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                        </svg>
                    </Link>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.iconWrapper}>
                        <FontAwesomeIcon icon={faHistory} className={styles.featureIcon} />
                    </div>
                    <h3 className={styles.cardTitle}>Lịch Sử Hiến Máu Của Tôi</h3>
                    <p className={styles.cardDescription}>Xem lại lịch sử các lần hiến máu đã hoàn thành của bạn.</p>
                    <Link to="/login" className={styles.actionButton}>
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                        </svg>
                    </Link>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.iconWrapper}>
                        <FontAwesomeIcon icon={faSearch} className={styles.featureIcon} />
                    </div>
                    <h3 className={styles.cardTitle}>Tra Cứu Nhóm Máu</h3>
                    <p className={styles.cardDescription}>Tra cứu thông tin phù hợp giữa các nhóm máu của người nhận và người hiến.</p>
                    <Link to="/SearchMatchBlood" className={styles.actionButton}>
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                        </svg>
                    </Link>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.iconWrapper}>
                        <FontAwesomeIcon icon={faBell} className={styles.featureIcon} />
                    </div>
                    <h3 className={styles.cardTitle}>Tra Cứu Đơn Khẩn Cấp</h3>
                    <p className={styles.cardDescription}>Kiểm tra trạng thái yêu cầu nhận máu khẩn cấp của bạn bằng thông tin cá nhân.</p>
                    <Link to="/emergency-lookup" className={styles.actionButton}>
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                        </svg>
                    </Link>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.iconWrapper}>
                        <FontAwesomeIcon icon={faBell} className={styles.featureIcon} /> {/* Icon mới */}
                    </div>
                    <h3 className={styles.cardTitle}>Tra Cứu Túi Máu Của Bản Thân</h3>
                    <p className={styles.cardDescription}>Kiểm tra tình trạng túi máu của bạn.</p>
                    <Link to="/login" className={styles.actionButton}>
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                        </svg>
                    </Link>
                </div>
            </div>

            <div className={styles.standardSection}>
                <BloodDonationParticipationStandard/>
            </div>

            <div className={styles.recommendSection}>
                <BloodDonationRecommendation/>
            </div>
        </div>
    );
};

export default GuestService;