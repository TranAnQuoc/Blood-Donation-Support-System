import React from 'react';
import styles from './StaffDashboard.module.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaUserFriends, FaCalendarAlt, FaClipboardList, FaTint } from 'react-icons/fa';

const StaffDashboard = () => {
    const stats = {
        totalMembers: 53,
        totalEvents: 20,
        totalDonations: 10,
        totalRequests: 6,
        bloodGroupStats: {
            'A+': 150,
            'O+': 200,
            'B+': 180,
            'AB+': 90,
            'A-': 30,
            'O-': 25,
            'B-': 20,
            'AB-': 10,
        },
        donationByMonth: {
            Jan: 50,
            Feb: 60,
            Mar: 80,
            Apr: 70,
            May: 90,
            Jun: 100,
            Jul: 110,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
        },
    };

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.boxGrid}>
                <div className={styles.statBox}>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{stats.totalMembers}</div>
                        <div className={styles.statLabel}>Tổng thành viên</div>
                    </div>
                    <FaUserFriends className={styles.statIcon} />
                </div>

                <div className={styles.statBox}>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{stats.totalEvents}</div>
                        <div className={styles.statLabel}>Sự kiện đã tạo</div>
                    </div>
                    <FaCalendarAlt className={styles.statIcon} />
                </div>

                <div className={styles.statBox}>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{stats.totalRequests}</div>
                        <div className={styles.statLabel}>Đăng ký chờ xử lý</div>
                    </div>
                    <FaClipboardList className={styles.statIcon} />
                </div>

                <div className={styles.statBox}>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>
                            {Object.values(stats.bloodGroupStats).reduce((a, b) => a + b, 0)}
                        </div>
                        <div className={styles.statLabel}>Túi máu hiện có</div>
                    </div>
                    <FaTint className={styles.statIcon} />
                </div>
            </div>

            <div className={styles.chartGrid}>
                <div className={styles.chartLargeBox}>
                    <h3>Biểu đồ hiến máu theo tháng</h3>
                    <Line
                        data={{
                            labels: monthLabels,
                            datasets: [
                                {
                                    label: 'Số lượt hiến',
                                    data: monthLabels.map(month => stats.donationByMonth[month] || 0),
                                    borderColor: 'rgba(192, 32, 68, 1)',
                                    backgroundColor: 'rgba(192, 32, 68, 0.2)',
                                    tension: 0.3,
                                    fill: true,
                                    pointBackgroundColor: '#fff',
                                    pointBorderColor: 'rgba(192, 32, 68, 1)',
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: false },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    min: 0,
                                    max: 120,
                                    ticks: { stepSize: 20 },
                                    title: {
                                        display: true,
                                        text: 'Số lượt hiến',
                                    },
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Tháng',
                                    },
                                },
                            },
                        }}
                    />
                </div>

                <div className={styles.chartSideBox}>
                    <h3>Thông tin khác</h3>
                    <p>Ví dụ: Top 5 người hiến máu nhiều nhất</p>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
