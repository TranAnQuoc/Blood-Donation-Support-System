import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../configs/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import styles from './RegisterDonation.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

dayjs.extend(isSameOrAfter);

const RegisterDonation = () => {
    const [donationEvents, setDonationEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [userBloodType, setUserBloodType] = useState(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasRegisteredBefore, setHasRegisteredBefore] = useState(false);
    const [hasRecentDonation, setHasRecentDonation] = useState(false);


    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const eventIdFromUrl = searchParams.get('eventId');

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
                const now = dayjs();
                const activeEvents = eventRes.data.filter((event) => {
                    const availableSlots = event.maxSlot - (event.currentSlot || 0);
                    const eventDateTime = dayjs(`${event.date}T${event.startTime}`);
                    return (
                        event.status === 'ACTIVE' &&
                        availableSlots > 0 &&
                        eventDateTime.isSameOrAfter(now, 'day')
                    );
                });
                setDonationEvents(activeEvents);

                if (eventIdFromUrl && activeEvents.length > 0) {
                    const matchedEvent = activeEvents.find(e => e.id.toString() === eventIdFromUrl);
                    if (matchedEvent) {
                        setSelectedEvent({
                            value: matchedEvent.id,
                            label: `${matchedEvent.name} - ${dayjs(`${matchedEvent.date}T${matchedEvent.startTime}`).format('DD/MM/YYYY HH:mm')} - ${dayjs(`${matchedEvent.date}T${matchedEvent.endTime}`).format('HH:mm')} - ${matchedEvent.address} (Còn ${matchedEvent.maxSlot - (matchedEvent.currentSlot || 0)} slot)`
                        });
                    }
                }

                const userProfileRes = await axiosInstance.get('/account/view-profile');
                const userProfile = userProfileRes.data;

                if (userProfile?.bloodType) {
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
                    toast.warn('Vui lòng cập nhật nhóm máu trong hồ sơ cá nhân để hoàn tất đăng ký.');
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
                prevEvents
                    .map(event =>
                        event.id === selectedEvent.value
                            ? { ...event, currentSlot: (event.currentSlot || 0) + 1 }
                            : event
                    )
                    .filter(event => (event.maxSlot - (event.currentSlot || 0)) > 0)
            );
        } catch (err) {
            console.error('Lỗi khi đăng ký hiến máu:', err);

            const rawResponse = err.response?.data;

            if (rawResponse) {
                // Nếu là string thì dùng trực tiếp, nếu là object thì lấy .message
                let errorMessage = typeof rawResponse === 'string' ? rawResponse : rawResponse.message;

                // Loại bỏ prefix "Lỗi hệ thống: " nếu có
                if (errorMessage.startsWith('Lỗi hệ thống:')) {
                    errorMessage = errorMessage.replace(/^Lỗi hệ thống:\s*/, '');
                }

                const warningMessages = [
                    'Bạn đã đăng ký hiến máu và đang chờ xử lý.',
                    'Đơn hiến máu trước đó đang trong quá trình xử lý.',
                ];

                const recentDonationMessage = 'Bạn cần chờ ít nhất 12 tuần sau khi hiến máu để đăng ký lại.';

                if (warningMessages.includes(errorMessage)) {
                    setHasRegisteredBefore(true);
                    toast.warn(errorMessage);
                } else if (errorMessage === recentDonationMessage) {
                    setHasRecentDonation(true);
                    toast.warn(errorMessage);
                } else {
                    toast.error(errorMessage);
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

    if (loading) return <div className={styles.loadingContainer}>Đang tải dữ liệu...</div>;
    if (error) return <div className={styles.errorContainer}>{error}</div>;

    const eventOptions = donationEvents.map((event) => ({
        value: event.id,
        label: `${event.name} - ${dayjs(`${event.date}T${event.startTime}`).format('DD/MM/YYYY HH:mm')} - ${event.address} (Còn ${event.maxSlot - (event.currentSlot || 0)} slot)`
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
            {hasRecentDonation && (
                <div className={styles.warningBanner} role="alert">
                    <p className={styles.warningTitle}>Thông báo:</p>
                    <p>
                        Bạn đã hiến máu gần đây. Vui lòng chờ ít nhất 12 tuần kể từ lần hiến gần nhất
                        trước khi đăng ký lại. Hãy quay lại sau để tiếp tục hành trình hiến máu của bạn!
                    </p>
                </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label htmlFor="event" className={styles.label}>Chọn Sự kiện Hiến Máu:</label>
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
                    {eventOptions.length === 0 && (
                        <p className={styles.noScheduleMessage}>Hiện không có sự kiện hiến máu nào khả dụng.</p>
                    )}
                </div>

                <div>
                    <label htmlFor="bloodType" className={styles.label}>Nhóm Máu Của Bạn:</label>
                    <Select
                        id="bloodType"
                        options={bloodTypeOptions}
                        value={userBloodType}
                        placeholder={userBloodType?.label || "Đang tải nhóm máu..."}
                        isClearable={false}
                        required
                        className={styles.reactSelectContainer}
                        classNamePrefix="react-select"
                        isDisabled
                        components={{ DropdownIndicator: null }}
                    />
                </div>

                <div>
                    <label htmlFor="reason" className={styles.label}>Lý Do Đăng Ký Hiến Máu:</label>
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

                <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    Quay lại
                </button>
            </form>
        </div>
    );
};

export default RegisterDonation;
