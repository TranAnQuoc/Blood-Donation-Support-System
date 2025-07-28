import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../../configs/axios';
import styles from './DonationProcess.module.css';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../../../hooks/useWebSocket';
import { toast } from 'react-toastify';

const getStatusName = (status) => {
    switch (status) {
        case 'WAITING': return 'Đang chờ';
        case 'SCREENING': return 'Đang sàng lọc';
        case 'SCREENING_FAILED': return 'Sàng lọc thất bại';
        case 'IN_PROCESS': return 'Đang tiến hành';
        case 'COMPLETED': return 'Hoàn thành';
        case 'FAILED': return 'Thất bại';
        case 'DONOR_CANCEL': return 'Người hiến hủy bỏ';
        default: return 'Không xác định';
    }
};

const DonationProcessList = () => {
    const { notifications } = useWebSocket();
    const navigate = useNavigate();
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedProcessId, setSelectedProcessId] = useState(null);

    const fetchProcesses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
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
        const hasProcessUpdate = notifications.some(n =>
            n.type === 'DONATION_PROCESS_UPDATED' || n.type === 'DONATION_REQUEST_APPROVED'
        );
        if (hasProcessUpdate) {
            fetchProcesses();
        }
    }, [notifications, fetchProcesses]);

    const openConfirmModal = (processId) => {
        setSelectedProcessId(processId);
        setShowConfirmModal(true);
    };

    const confirmArrival = async () => {
        if (!selectedProcessId) return;

        try {
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
                toast.error('Không xác định được người thực hiện. Vui lòng đăng nhập lại.');
                return;
            }

            const payload = {
                process: 'IN_PROCESS',
                performerId: performerId,
                date: new Date().toISOString().split('T')[0],
            };

            await axiosInstance.put(`/donation-processes/edit/${selectedProcessId}`, payload);
            toast.success('Đã xác nhận người hiến và chuyển sang trạng thái "Đang tiến hành".');
            fetchProcesses();
        } catch (err) {
            console.error('Error confirming arrival:', err);
            const errorMessage = err.response?.data?.message || 'Lỗi xác nhận. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setShowConfirmModal(false);
            setSelectedProcessId(null);
        }
    };

    const handleActionButtonClick = (process) => {
        const { id, process: status, statusHealthCheck } = process;

        if (status === 'WAITING') {
            openConfirmModal(id);
        } else if (status === 'IN_PROCESS') {
            if (statusHealthCheck === 'PASS') {
                navigate(`/staff-dashboard/donation-processes/${id}?step=donation`);
            } else {
                navigate(`/staff-dashboard/donation-processes/${id}?step=screening`);
            }
        } else {
            navigate(`/staff-dashboard/donation-processes/${id}?step=detail`);
        }
    };

    const getButtonText = (status, statusHealthCheck) => {
        switch (status) {
            case 'WAITING':
                return 'Xác nhận đã tới';
            case 'IN_PROCESS':
                return statusHealthCheck === 'PASS' ? 'Tiến hành truyền máu' : 'Khảo sát sức khỏe';
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
            <h2>Danh Sách Quá Trình Hiến Máu</h2>

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

            {showConfirmModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.modalTitle}>XÁC NHẬN</h3>
                        <p>Bạn có chắc chắn xác nhận người hiến đã tới và bắt đầu quá trình hiến máu?</p>
                        <div className={styles.modalActions}>
                            <button className={styles.confirmButton} onClick={confirmArrival}>Xác nhận</button>
                            <button className={styles.cancelButton} onClick={() => setShowConfirmModal(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationProcessList;
