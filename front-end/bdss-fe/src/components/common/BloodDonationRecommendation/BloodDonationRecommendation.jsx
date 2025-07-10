import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './BloodDonationRecommendation.module.css';

const RecommendationSection = () => {
    const shouldItems = [
        'Ăn nhẹ và uống nhiều nước (300-500ml) trước khi hiến máu.',
        'Để chất miệng bông gòn kèm nơi kim chích 10 phút, giữ băng keo cá nhân trong 4-6 giờ.',
        'Nằm và nghỉ ngơi tại chỗ 10 phút sau khi hiến máu.',
        'Nằm ngay đầu thấp, kê chân cao nếu thấy chóng mặt, mệt, buồn nôn.',
        'Chườm lạnh (túi chườm chuyên dụng hoặc đá vào khăn) chườm vết chích nếu bị sưng, bầm tím.'
    ];

    const shouldNotItems = [
        'Uống rượu, bia trước khi hiến máu.',
        'Lái xe đi xa, khuân vác, làm việc nặng hoặc luyện tập thể thao gắng sức ngay từ ngày lấy máu.'
    ];

    const noteItems = [
        'Nếu phát hiện chảy máu tại chỗ chích: Giơ tay cao.',
        'Lấy tay kia ấn nhẹ vào miếng bông hoặc băng dính.',
        'Liên hệ nhân viên y tế để được hỗ trợ khi cần thiết.'
    ];

    const doctorInfo = {
        name: 'Bác sĩ Ngô Văn Tấn',
        title: 'Trưởng khoa Khoa Tiếp nhận hiến máu.',
        hospital: 'Bệnh viện Truyền máu Huyết học'
    };

    return (
        <div className={styles.recommendationContainer}>
            <h2 className={styles.pageTitle}>Những lời khuyên trước và sau hiến máu</h2>
            <div className={styles.contentGrid}>
                <div className={styles.leftColumn}>
                    <div className={`${styles.card} ${styles.shouldCard}`}>
                        <div className={styles.cardHeader}>
                            <FontAwesomeIcon icon={faCheckCircle} className={styles.shouldIcon} />
                            <h3>Nên:</h3>
                        </div>
                        <ul className={styles.recommendationList}>
                            {shouldItems.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                        <div className={styles.doctorInfo}>
                            <p>{doctorInfo.name}</p>
                            <p>{doctorInfo.title}</p>
                            <p>{doctorInfo.hospital}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <div className={`${styles.card} ${styles.shouldNotCard}`}>
                        <div className={styles.cardHeader}>
                            <FontAwesomeIcon icon={faTimesCircle} className={styles.shouldNotIcon} />
                            <h3>Không nên:</h3>
                        </div>
                        <ul className={styles.recommendationList}>
                            {shouldNotItems.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                        <div className={styles.doctorInfo}>
                            <p>{doctorInfo.name}</p>
                            <p>{doctorInfo.title}</p>
                            <p>{doctorInfo.hospital}</p>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.noteCard}`}>
                        <div className={styles.cardHeader}>
                            <FontAwesomeIcon icon={faExclamationCircle} className={styles.noteIcon} />
                            <h3>Lưu ý:</h3>
                        </div>
                        <ul className={styles.recommendationList}>
                            {noteItems.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                        <div className={styles.doctorInfo}>
                            <p>{doctorInfo.name}</p>
                            <p>{doctorInfo.title}</p>
                            <p>{doctorInfo.hospital}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationSection;