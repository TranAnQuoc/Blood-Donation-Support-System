import React from 'react';
import styles from './Banner.module.css';
import bannerImage from '../../../assets/—Pngtree—world blood donor day ribbon_16653052.jpg';

const Banner = () => {
    return (
        <div className={styles.bannerContainer}>
            {/* Ghi công hình ảnh từ Pngtree:
                Bạn cần @pngtree trên phương tiện truyền thông xã hội và chia sẻ nó hoặc sao chép văn bản dưới đây vào dự án hoặc trang web của bạn để ghi công:
                <a href="https://www.pngtree.com/freepng/world-blood-donor-day-ribbon_16653052.html">Pngtree.com</a>
            */}
            <img
                src={bannerImage} // Sử dụng hình ảnh đã import trực tiếp
                alt="World Blood Donor Day Banner" // Mô tả alt text phù hợp với hình ảnh
                className={styles.bannerImage}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/1920x600/C12759/ffffff?text=L%E1%BB%97i+T%E1%BA%A3i+%E1%BA%A2nh"; // Fallback nếu hình ảnh không tải được
                }}
            />
        </div>
    );
};

export default Banner;
