import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faBullseye } from '@fortawesome/free-solid-svg-icons';
import styles from "./CommonAboutUs.module.css";

const CommonAboutUs = () => {
    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.aboutUsWrapper}>
                <section className={styles.aboutUsHeader}>
                    <div className={styles.headerOverlay}></div>
                    <div className={styles.headerContent}>
                        <p className={styles.headerSubtitle}>Trung tâm Hỗ trợ Hiến máu (Blood Donation Support Center)</p>
                        <h1 className={styles.headerTitle}>Về chúng tôi</h1>
                    </div>
                </section>

                <section className={styles.aboutUsMainContent}>
                    <div className={styles.contentContainer}>
                        <div className={styles.imageColumn}>
                            <img
                                src="https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg"
                                alt=""
                                className={styles.mainImage}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg";
                                }}
                            />
                        </div>

                        <div className={styles.textColumn}>
                            <p className={styles.sectionCategory}>Về chúng tôi</p>
                            <h2 className={styles.sectionHeading}>
                                Trung tâm hỗ trợ hiến máu - Blood Donation Support Center
                            </h2>
                            <p className={styles.sectionDescription}>
                                Dự án Hệ thống Hỗ trợ Hiến máu - Blood Donation Support System (BDSS) được phát triển bởi nhóm sinh viên thuộc ngành Kỹ thuật phần mềm, Trường Đại học FPT. 
                                Mục tiêu của chúng tôi là tạo ra một nền tảng giúp việc đăng ký hiến máu, tiếp nhận yêu cầu, hiến nhận máu khẩn cấp, quản lý và hỗ trợ người hiến máu để thuận tiện và hiệu quả hơn.
                            </p>

                            <div className={styles.missionVisionItem}>
                                <div className={styles.iconWrapper}>
                                    <FontAwesomeIcon icon={faUserMd} className={styles.iconMission} />
                                </div>
                                <div className={styles.textWrapper}>
                                    <h3 className={styles.itemTitle}>Nhiệm vụ của chúng tôi</h3>
                                    <p className={styles.itemDescription}>
                                        Kết nối người hiến máu với người cần máu kịp thời, đặc biệt trong các tình huống khẩn cấp.
                                        Cung cấp công cụ để quản lý thông tin, lịch sử hiến máu, và tồn kho máu một cách hiệu quả.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.missionVisionItem}>
                                <div className={styles.iconWrapper}>
                                    <FontAwesomeIcon icon={faBullseye} className={styles.iconVision} />
                                </div>
                                <div className={styles.textWrapper}>
                                    <h3 className={styles.itemTitle}>Tầm nhìn của chúng tôi</h3>
                                    <p className={styles.itemDescription}>
                                        Chúng tôi mong muốn Dự án Hệ thống Hỗ trợ Hiến máu - Blood Donation Support System (BDSS) giúp lan tỏa ý nghĩa của việc hiến máu trong cộng đồng.
                                        Dù là một dự án học tập, nhóm chúng tôi luôn nỗ lực xây dựng hệ thống một cách nghiêm túc, tối ưu hóa trải nghiệm người dùng, và đặt con người – sự sống – cộng đồng làm trọng tâm.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CommonAboutUs;
