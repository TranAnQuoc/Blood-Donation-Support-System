import React from 'react';
import styles from './HomePage.module.css'; // Import CSS module nếu bạn có

const HomePage = () => {
    return (
        <div className={styles.homePage}>
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        SAVE A LIFE,
                        <br />
                        DONATE BLOOD
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Cùng nhau tạo nên sự khác biệt. Hiến máu cứu người.
                    </p>
                    <button className={styles.donateButton}>
                        Tìm hiểu thêm về hiến máu
                    </button>
                </div>
                {/* Bạn có thể thêm hình ảnh vào đây */}
                {/* <img src="/images/hero-image.jpg" alt="Hiến máu" className={styles.heroImage} /> */}
            </section>

            <section className={styles.infoSection}>
                <div className={styles.infoItem}>
                    <h3>Tại sao nên hiến máu?</h3>
                    <p>
                        Hiến máu không chỉ là một hành động cao cả mà còn mang lại
                        nhiều lợi ích cho sức khỏe của bạn.
                    </p>
                </div>
                <div className={styles.infoItem}>
                    <h3>Quy trình hiến máu</h3>
                    <p>
                        Tìm hiểu về quy trình hiến máu an toàn và dễ dàng.
                    </p>
                </div>
                <div className={styles.infoItem}>
                    <h3>Địa điểm hiến máu</h3>
                    <p>
                        Tìm các địa điểm hiến máu gần bạn.
                    </p>
                </div>
            </section>

            <section className={styles.communitySection}>
                <h2>Cộng đồng hiến máu</h2>
                {/* Hiển thị các bài viết, tin tức từ cộng đồng */}
            </section>
        </div>
    );
};

export default HomePage;