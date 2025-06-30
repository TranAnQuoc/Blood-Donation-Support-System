import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);
import styles from './RegisterDonation.module.css';

const RegisterDonation = () => {
    const [donationEvents, setDonationEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [userBloodType, setUserBloodType] = useState(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasRegisteredBefore, setHasRegisteredBefore] = useState(false);

    const staticBloodTypes = [
        { id: 1, bloodName: 'Unknown', type: 'Unknown', rhFactor: '' },
        { id: 2, bloodName: 'A+', type: 'A', rhFactor: 'positive' },
        { id: 3, bloodName: 'A-', type: 'A', rhFactor: 'negative' },
        { id: 4, bloodName: 'B+', type: 'B', rhFactor: 'positive' },
        { id: 5, bloodName: 'B-', type: 'B', rhFactor: 'negative' },
        { id: 6, bloodName: 'AB+', type: 'AB', rhFactor: 'positive' },
        { id: 7, bloodName: 'AB-', type: 'AB', rhFactor: 'negative' },
        { id: 8, bloodName: 'O+', type: 'O', rhFactor: 'positive' },
        { id: 9, bloodName: 'O-', type: 'O', rhFactor: 'negative' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const eventRes = await axiosInstance.get('/event');
                console.log("Raw events from API:", eventRes.data);

                const now = dayjs();
                const activeEvents = eventRes.data.filter((event) => {
                    const availableSlots = event.maxSlot - (event.currentSlot || 0);
                    const eventDateTime = dayjs(`${event.date}T${event.startTime}`);
                    
                    console.log(`--- Event ID: ${event.id} ---`);
                    console.log(`Event Date/Time: ${eventDateTime.format('YYYY-MM-DD HH:mm:ss')}`);
                    console.log(`Current Time (now): ${now.format('YYYY-MM-DD HH:mm:ss')}`);
                    console.log(`Status is ACTIVE: ${event.status === 'ACTIVE'}`);
                    console.log(`Available Slots > 0: ${availableSlots > 0} (Slots: ${availableSlots})`);
                    console.log(`Event is same or after current day: ${eventDateTime.isSameOrAfter(now, 'day')}`);

                    return (
                        event.status === 'ACTIVE' &&
                        availableSlots > 0 &&
                        eventDateTime.isSameOrAfter(now, 'day')
                    );
                });
                console.log("Active events after filtering:", activeEvents);
                setDonationEvents(activeEvents);

                const userProfileRes = await axiosInstance.get('/account/view-profile');
                const userProfile = userProfileRes.data;
                console.log("User Profile:", userProfile);

                if (userProfile && userProfile.bloodType) {
                    const matchedBloodType = staticBloodTypes.find(
                        bt => bt.id === userProfile.bloodType.id
                    );
                    if (matchedBloodType) {
                        setUserBloodType({
                            value: matchedBloodType.id,
                            label: matchedBloodType.bloodName
                        });
                    } else {
                        setError('Không thể tìm thấy thông tin nhóm máu của bạn.');
                        toast.error('Không thể tự động điền nhóm máu của bạn. Vui lòng liên hệ hỗ trợ.');
                    }
                } else {
                    setError('Không tìm thấy thông tin nhóm máu trong hồ sơ của bạn.');
                    toast.warn('Vui lòng cập nhật thông tin nhóm máu trong hồ sơ cá nhân để hoàn tất đăng ký.');
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Không thể tải dữ liệu sự kiện hoặc thông tin người dùng. Vui lòng thử lại sau.');
                toast.error(`Lỗi tải dữ liệu: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedEvent || !userBloodType || !reason) {
            toast.error('Vui lòng điền đầy đủ tất cả các trường.');
            return;
        }

        const payload = {
            bloodTypeId: userBloodType.value,
            reason: reason.trim(),
        };

        try {
            setIsSubmitting(true);
            const res = await axiosInstance.post(`/donation-requests/register/${selectedEvent.value}`, payload);

            if (res.data && res.data.message) {
                toast.success(res.data.message);
            } else {
                toast.success('Đăng ký hiến máu thành công! Yêu cầu của bạn đang chờ duyệt.');
            }

            setSelectedEvent(null);
            setReason('');
            setHasRegisteredBefore(false);

            setDonationEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === selectedEvent.value ? { ...event, currentSlot: (event.currentSlot || 0) + 1 } : event
                ).filter(event => (event.maxSlot - (event.currentSlot || 0)) > 0)
            );
        } catch (err) {
            console.error('Lỗi khi đăng ký hiến máu:', err);
            if (err.response) {
                const errorMessage = err.response.data?.message || 'Có lỗi xảy ra từ máy chủ.';

                if (errorMessage.includes('Tài khoản này đã đăng ký hiến máu trước đó.')) {
                    setHasRegisteredBefore(true);
                    toast.warn('Bạn đã đăng ký hiến máu cho một sự kiện trước đó. Vui lòng kiểm tra trạng thái.');
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

    const eventOptions = donationEvents.map((event) => ({
        value: event.id,
        label: `${event.name} - ${dayjs(`${event.date}T${event.startTime}`).format('DD/MM/YYYY HH:mm')} - ${event.address} (Còn ${event.maxSlot - (event.currentSlot || 0)} slot)`,
    }));

    const bloodTypeOptions = userBloodType ? [userBloodType] : [];

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Đăng Ký Hiến Máu</h2>
            {hasRegisteredBefore && (
                <div className={styles.warningBanner} role="alert">
                    <p className={styles.warningTitle}>Lưu ý:</p>
                    <p>Tài khoản của bạn đã đăng ký hiến máu cho một sự kiện trước đó. Vui lòng kiểm tra trạng thái yêu cầu của bạn hoặc đợi sự kiện hiện tại kết thúc trước khi đăng ký lại.</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label htmlFor="event" className={styles.label}>
                        Chọn Sự kiện Hiến Máu:
                    </label>
                    <Select
                        id="event"
                        options={eventOptions}
                        value={selectedEvent}
                        onChange={setSelectedEvent}
                        placeholder="Chọn một sự kiện hiến máu..."
                        isClearable
                        required
                        className={styles.reactSelectContainer}
                        classNamePrefix="react-select"
                        isDisabled={isSubmitting || eventOptions.length === 0}
                    />
                    {eventOptions.length === 0 && !loading && (
                        <p className={styles.noScheduleMessage}>Hiện không có sự kiện hiến máu nào khả dụng.</p>
                    )}
                </div>

                <div>
                    <label htmlFor="bloodType" className={styles.label}>
                        Nhóm Máu Của Bạn:
                    </label>
                    <Select
                        id="bloodType"
                        options={bloodTypeOptions}
                        value={userBloodType}
                        placeholder={userBloodType ? userBloodType.label : "Đang tải nhóm máu..."}
                        isClearable={false}
                        required
                        className={styles.reactSelectContainer}
                        classNamePrefix="react-select"
                        isDisabled={true}
                        components={{ DropdownIndicator: null }}
                    />
                    {!userBloodType && !loading && !error && (
                        <p className={styles.noBloodTypeMessage}>Vui lòng cập nhật nhóm máu trong hồ sơ cá nhân của bạn.</p>
                    )}
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
                    disabled={isSubmitting || eventOptions.length === 0 || !userBloodType} 
                >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu Đăng Ký'}
                </button>
            </form>
        </div>
    );
};

export default RegisterDonation;
