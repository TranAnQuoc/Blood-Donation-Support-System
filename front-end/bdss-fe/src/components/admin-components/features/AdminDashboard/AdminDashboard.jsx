import React from 'react';
import styles from './AdminDashboard.module.css';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaUserShield, FaUsers, FaHospitalAlt, FaDatabase } from 'react-icons/fa';

const AdminDashboard = () => {
    const stats = {
        totalAdmins: 12,
        totalStaff: 40,
        totalMedicalFacilities: 18,
        totalSystemAccounts: 52,
        bloodGroupStats: {
            'A+': 200,
            'O+': 250,
            'B+': 210,
            'AB+': 120,
            'A-': 40,
            'O-': 30,
            'B-': 35,
            'AB-': 15,
        },
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.boxGrid}>
                <div className={styles.statBox}>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{stats.totalAdmins}</div>
                        <div className={styles.statLabel}>Quản trị viên</div>
                    </div>
                    <FaUserShield className={styles.statIcon} />
                </div>

                <div className={styles.statBox}>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{stats.totalStaff}</div>
                        <div className={styles.statLabel}>Nhân viên</div>
                    </div>
                    <FaUsers className={styles.statIcon} />
                </div>

                <div className={styles.statBox}>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{stats.totalMedicalFacilities}</div>
                        <div className={styles.statLabel}>Tổng sự kiện</div>
                    </div>
                    <FaHospitalAlt className={styles.statIcon} />
                </div>

                <div className={styles.statBox}>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{stats.totalSystemAccounts}</div>
                        <div className={styles.statLabel}>Tài khoản hệ thống</div>
                    </div>
                    <FaDatabase className={styles.statIcon} />
                </div>
            </div>

            <div className={styles.chartGrid}>
                <div className={styles.chartWideBox}>
                    <h3>Tỷ lệ nhóm máu</h3>
                    <Pie
                        data={{
                            labels: Object.keys(stats.bloodGroupStats),
                            datasets: [
                                {
                                    label: 'Túi máu',
                                    data: Object.values(stats.bloodGroupStats),
                                    backgroundColor: [
                                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                                        '#9966FF', '#F67019', '#00A651', '#FF9F40',
                                    ],
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'right',
                                },
                            },
                        }}
                    />
                </div>

                <div className={styles.chartSideBox}>
                    <h3>Thông tin khác</h3>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
