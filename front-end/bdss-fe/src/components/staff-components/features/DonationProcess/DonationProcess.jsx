import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../../configs/axios'; // Make sure this path is correct for your axios setup
import styles from './DonationProcess.module.css';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../../../hooks/useWebSocket'; // Assuming you have a WebSocket hook
import { toast } from 'react-toastify'; // For notifications


const getStatusName = (status) => {
    switch (status) {
        case 'WAITING': return 'Đang chờ';
        case 'SCREENING': return 'Đang sàng lọc'; // This status might be unused if 'IN_PROCESS' covers it
        case 'SCREENING_FAILED': return 'Sàng lọc thất bại';
        case 'IN_PROCESS': return 'Đang tiến hành'; // Covers both screening and donation process
        case 'COMPLETED': return 'Hoàn thành';
        case 'FAILED': return 'Thất bại';
        case 'DONOR_CANCEL': return 'Người hiến hủy bỏ';
        default: return 'Không xác định';
    }
};
// --- End Utility Functions ---


const DonationProcessList = () => {
    const { notifications } = useWebSocket(); // Assuming this hook provides notifications
    const navigate = useNavigate();
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProcesses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Adjust this API endpoint if needed to fetch donation processes
            const response = await axiosInstance.get('/donation-processes/list');
            setProcesses(response.data);
            console.log("Fetched donation processes:", response.data);
        } catch (err) {
            console.error("Error fetching donation processes:", err);
            setError('Could not load donation processes. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProcesses();
    }, [fetchProcesses]);

    useEffect(() => {
        // Refetch if there's a relevant notification (e.g., process updated or new request approved)
        const hasProcessUpdate = notifications.some(n =>
            n.type === 'DONATION_PROCESS_UPDATED' || n.type === 'DONATION_REQUEST_APPROVED'
        );
        if (hasProcessUpdate) {
            fetchProcesses();
        }
    }, [notifications, fetchProcesses]);

    const handleConfirmArrival = async (processId) => {
        if (window.confirm('Xác nhận người hiến đã tới và bắt đầu quy trình hiến máu?')) {
            try {
                // Get performerId from localStorage or wherever it's stored
                const storedUser = localStorage.getItem('user');
                let performerId = null;
                if (storedUser) {
                    try {
                        const userObject = JSON.parse(storedUser);
                        performerId = userObject.id;
                    } catch (parseError) {
                        console.error("Error parsing user from localStorage:", parseError);
                    }
                }

                if (!performerId) {
                    toast.error('Could not identify performer. Please log in again.');
                    return;
                }

                // Update the process status to IN_PROCESS when confirmed arrival
                const payload = {
                    process: 'IN_PROCESS', // This is the StatusProcess enum
                    performerId: performerId,
                    date: new Date().toISOString().split('T')[0], // Set current date for process start
                };

                await axiosInstance.put(`/donation-processes/edit/${processId}`, payload);
                toast.success('Donor arrival confirmed! Process status updated to "In Process".');
                fetchProcesses(); // Refresh the list
            } catch (err) {
                console.error('Error confirming arrival:', err);
                const errorMessage = err.response?.data?.message || 'Failed to confirm. Please try again.';
                toast.error(errorMessage);
            }
        }
    };

    const handleActionButtonClick = (process) => {
        const { id, process: status, statusHealthCheck } = process;

        if (status === 'WAITING') {
            handleConfirmArrival(id);
        } else if (status === 'IN_PROCESS') {
            // If IN_PROCESS, determine if health check has passed or not
            if (statusHealthCheck === 'PASS') {
                navigate(`/staff-dashboard/donation-process/${id}?step=donation`); // Go to donation step
            } else {
                navigate(`/staff-dashboard/donation-process/${id}?step=screening`); // Go to screening step
            }
        } else {
            // For SCREENING_FAILED, COMPLETED, FAILED, DONOR_CANCEL, etc.
            navigate(`/staff-dashboard/donation-process/${id}?step=detail`); // Go to detail view
        }
    };

    const getButtonText = (status, statusHealthCheck) => {
        switch (status) {
            case 'WAITING':
                return 'Xác nhận đã tới';
            case 'IN_PROCESS':
                // If it's IN_PROCESS and health check is already PASS, next step is donation
                if (statusHealthCheck === 'PASS') {
                    return 'Tiến hành truyền máu';
                }
                return 'Khảo sát sức khỏe'; // Otherwise, it's still about screening
            case 'SCREENING_FAILED':
            case 'COMPLETED':
            case 'FAILED':
            case 'DONOR_CANCEL':
            default:
                return 'Xem chi tiết';
        }
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải danh sách quy trình hiến máu...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.donationProcessListContainer}>
            <h2>Danh Sách Quy Trình Hiến Máu</h2>

            {processes.length === 0 ? (
                <div className={styles.noDataMessage}>Không có quy trình hiến máu nào để hiển thị.</div>
            ) : (
                <ul className={styles.processList}>
                    {processes.map((process) => (
                        <li key={process.id} className={styles.processItem}>
                            <div className={styles.processInfo}>
                                <p><strong>Sự kiện:</strong> {process.eventName || 'N/A'}</p>
                                <p><strong>Người hiến:</strong> {process.donorFullName || 'N/A'}</p>
                                <p><strong>SĐT:</strong> {process.donorPhone || 'N/A'}</p>
                                <p><strong>Nhóm máu ĐK:</strong> {process.donorBloodType ? `${process.donorBloodType.type}${process.donorBloodType.rhFactor}` : 'Chưa cập nhật'}</p>
                                <p>
                                    <strong>Trạng thái:</strong>
                                    <span className={`${styles.statusBadge} ${styles[process.process?.toLowerCase()]}`}>
                                        {getStatusName(process.process)}
                                    </span>
                                </p>
                            </div>
                            <div className={styles.processActions}>
                                <button
                                    className={`${styles.actionButton} ${styles[process.process?.toLowerCase()]}`}
                                    onClick={() => handleActionButtonClick(process)}
                                >
                                    {getButtonText(process.process, process.statusHealthCheck)}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DonationProcessList;