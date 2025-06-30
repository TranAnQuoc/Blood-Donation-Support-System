import React from 'react';
import styles from './BloodDonationParticipationStandard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faWeightScale,
    faCalendarAlt,
    faClock,
    faVirus,
    faHeartbeat,
    faVial,
    faIdCard,
    faWineBottle,
    faTint
} from '@fortawesome/free-solid-svg-icons';

const BloodDonationParticipationStandard = () => {
    const criteriaItems = [
        {
            icon: faWeightScale,
            title: 'Cân nặng',
            description: 'Cân nặng: Nam ≥ 45 kg, Nữ ≥ 42 kg'
        },
        {
            icon: faCalendarAlt,
            title: 'Độ tuổi',
            description: 'Người khỏe mạnh trong độ tuổi từ 18 đến 60 tuổi'
        },
        {
            icon: faClock,
            title: 'Thời gian giãn cách',
            description: 'Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ'
        },
        {
            icon: faIdCard,
            title: 'Giấy tờ tùy thân',
            description: 'Mang theo chứng minh nhân dân/hộ chiếu'
        },
        {
            icon: faVirus,
            title: 'Bệnh truyền nhiễm',
            description: 'Không mắc hoặc không có các hành vi nguy cơ lây nhiễm HIV, không nhiễm viêm gan B, viêm gan C, và các virus lây qua đường truyền máu'
        },
        {
            icon: faWineBottle,
            title: 'Chất kích thích',
            description: 'Không nghiện ma túy, rượu bia và các chất kích thích'
        },
        {
            icon: faHeartbeat,
            title: 'Sức khỏe tổng quát',
            description: 'Không mắc các bệnh mãn tính liên quan tim mạch, huyết áp, hô hấp, dạ dày...'
        },
        {
            icon: faTint,
            title: 'Chỉ số huyết sắc tố',
            description: 'Chỉ số huyết sắc tố (Hb) ≥ 120g/l (≥ 125g/l nếu hiến từ 350ml trở lên).'
        },
        {
            icon: faVial,
            title: 'Kết quả xét nghiệm',
            description: 'Kết quả test nhanh âm tính với kháng nguyên bề mặt của siêu vi B'
        }
    ];

    return (
        <div className={styles.donationCriteriaSection}>
            <h2 className={styles.sectionTitle}>Tiêu chuẩn tham gia hiến máu</h2>
            <div className={styles.criteriaGrid}>
                {criteriaItems.map((item, index) => (
                    <div key={index} className={styles.criteriaCard}>
                        <div className={styles.iconWrapper}>
                            <FontAwesomeIcon icon={item.icon} className={styles.criteriaIcon} />
                        </div>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <p className={styles.cardDescription}>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BloodDonationParticipationStandard;
