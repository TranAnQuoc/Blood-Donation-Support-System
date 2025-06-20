import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../configs/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import dayjs from 'dayjs';
import styles from './RegisterDonation.module.css';

const RegisterDonation = () => {
    const [donationSchedules, setDonationSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [selectedBloodType, setSelectedBloodType] = useState(null);
    const [quantityMl, setQuantityMl] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasRegisteredBefore, setHasRegisteredBefore] = useState(false);

    const staticBloodTypes = [
        { id: 1, bloodName: 'Unknown' },
        { id: 2, bloodName: 'A+' },
        { id: 3, bloodName: 'A-' },
        { id: 4, bloodName: 'B+' },
        { id: 5, bloodName: 'B-' },
        { id: 6, bloodName: 'AB+' },
        { id: 7, bloodName: 'AB-' },
        { id: 8, bloodName: 'O+' },
        { id: 9, bloodName: 'O-' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const scheduleRes = await axiosInstance.get('/schedules');
                console.log("Raw schedules from API:", scheduleRes.data);
                const activeSchedules = scheduleRes.data.filter((s) => {
                    const availableSlots = s.maxSlot - s.currentSlot;
                    const scheduleDateTimeString = `${s.date}T${s.startTime}`;
                    const scheduleDateTime = dayjs(scheduleDateTimeString);
                    return (
                        availableSlots > 0 &&
                        scheduleDateTime.isAfter(dayjs())
                    );
                });

                console.log("Active schedules after filtering:", activeSchedules);
                setDonationSchedules(activeSchedules);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Không thể tải dữ liệu lịch hiến máu hoặc nhóm máu. Vui lòng thử lại sau.');
                toast.error(`Lỗi tải dữ liệu: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSchedule || !selectedBloodType || !quantityMl || !reason) {
            toast.error('Vui lòng điền đầy đủ tất cả các trường.');
            return;
        }

        const parsedQuantityMl = parseInt(quantityMl);
        if (isNaN(parsedQuantityMl) || parsedQuantityMl <= 0) {
            toast.error('Số lượng máu phải là một số dương.');
            return;
        }

        const payload = {
            bloodTypeId: selectedBloodType.value,
            quantityMl: parsedQuantityMl,
            reason: reason.trim(),
        };

        try {
            setIsSubmitting(true);
            const res = await axiosInstance.post(`/donation-requests/register/${selectedSchedule.value}`, payload);

            if (res.data && res.data.message) {
                toast.success(res.data.message);
            } else {
                toast.success('Đăng ký hiến máu thành công! Yêu cầu của bạn đang chờ duyệt.');
            }

            setSelectedSchedule(null);
            setSelectedBloodType(null);
            setQuantityMl('');
            setReason('');
            setHasRegisteredBefore(false);

            setDonationSchedules(prevSchedules =>
                prevSchedules.map(s =>
                    s.id === selectedSchedule.value ? { ...s, currentSlot: s.currentSlot + 1 } : s
                )
            );
        } catch (err) {
            console.error('Lỗi khi đăng ký hiến máu:', err);
            if (err.response) {
                const errorMessage = err.response.data?.message || 'Có lỗi xảy ra từ máy chủ.';
                if (errorMessage.includes('Tài khoản này đã đăng ký hiến máu trước đó.')) {
                    setHasRegisteredBefore(true);
                    toast.warn('Bạn đã đăng ký hiến máu cho một lịch trình trước đó. Vui lòng kiểm tra trạng thái.');
                } else {
                    setHasRegisteredBefore(false);
                    toast.error(`Lỗi hệ thống: ${errorMessage}`);
                }
            } else if (err.request) {
                toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.');
                setHasRegisteredBefore(false);
            } else {
                toast.error('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
                setHasRegisteredBefore(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className={styles.loadingContainer}>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>{error}</div>;
    }

    const scheduleOptions = donationSchedules.map((schedule) => ({
        value: schedule.id,
        label: `${schedule.name} - ${dayjs(`${schedule.date}T${schedule.startTime}`).format('DD/MM/YYYY HH:mm')} - ${schedule.facility.name} (Còn ${schedule.maxSlot - schedule.currentSlot} slot)`,
    }));

    const bloodTypeOptions = staticBloodTypes.map((type) => ({
        value: type.id,
        label: type.bloodName,
    }));

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Đăng Ký Hiến Máu</h2>
            {hasRegisteredBefore && (
                <div className={styles.warningBanner} role="alert">
                    <p className={styles.warningTitle}>Lưu ý:</p>
                    <p>Tài khoản của bạn đã đăng ký hiến máu cho một lịch trình trước đó. Vui lòng kiểm tra trạng thái yêu cầu của bạn hoặc đợi lịch trình hiện tại kết thúc trước khi đăng ký lại.</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label htmlFor="schedule" className={styles.label}>
                        Chọn Lịch Hiến Máu:
                    </label>
                    <Select
                        id="schedule"
                        options={scheduleOptions}
                        value={selectedSchedule}
                        onChange={setSelectedSchedule}
                        placeholder="Chọn một lịch hiến máu..."
                        isClearable
                        required
                        className={styles.reactSelectContainer}
                        classNamePrefix="react-select"
                        isDisabled={isSubmitting}
                    />
                    {scheduleOptions.length === 0 && !loading && (
                        <p className={styles.noScheduleMessage}>Hiện không có lịch hiến máu nào khả dụng.</p>
                    )}
                </div>

                <div>
                    <label htmlFor="bloodType" className={styles.label}>
                        Nhóm Máu Bạn Muốn Hiến:
                    </label>
                    <Select
                        id="bloodType"
                        options={bloodTypeOptions}
                        value={selectedBloodType}
                        onChange={setSelectedBloodType}
                        placeholder="Chọn nhóm máu của bạn..."
                        isClearable
                        required
                        className={styles.reactSelectContainer}
                        classNamePrefix="react-select"
                        isDisabled={isSubmitting}
                    />
                </div>

                <div>
                    <label htmlFor="quantityMl" className={styles.label}>
                        Số Lượng Máu (ml):
                    </label>
                    <input
                        type="number"
                        id="quantityMl"
                        className={styles.input}
                        value={quantityMl}
                        onChange={(e) => setQuantityMl(e.target.value)}
                        placeholder="Ví dụ: 250, 350, 450"
                        min="1"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label htmlFor="reason" className={styles.label}>
                        Lý Do Đăng Ký Hiến Máu:
                    </label>
                    <textarea
                        id="reason"
                        rows="4"
                        className={styles.textarea}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Ví dụ: Tôi muốn góp phần giúp đỡ cộng đồng và những người cần máu."
                        required
                        disabled={isSubmitting}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu Đăng Ký'}
                </button>
            </form>
        </div>
    );
};

export default RegisterDonation;