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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const eventIdFromUrl = searchParams.get('eventId');

    useEffect(() => {
        const fetchEvents = async () => {
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
            } catch (err) {
                console.error('Error fetching donation events:', err);
                setError('Không thể tải danh sách sự kiện hiến máu. Vui lòng thử lại sau.');
                toast.error(`Lỗi tải dữ liệu: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [eventIdFromUrl]);

    const handleProceedToSurvey = async (e) => {
        e.preventDefault();

        if (!selectedEvent) {
            toast.error('Vui lòng chọn một sự kiện hiến máu.');
            return;
        }

        setIsSubmitting(true);

        try {
            navigate(`/member/donate/survey/${selectedEvent.value}`);
        } catch (err) {
            console.error('Lỗi khi chuyển hướng đến trang khảo sát:', err);
            toast.error('Không thể chuyển hướng đến trang khảo sát. Vui lòng thử lại.');
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

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Đăng Ký Hiến Máu</h2>
            <form onSubmit={handleProceedToSurvey} className={styles.form}>
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

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting || eventOptions.length === 0 || !selectedEvent}
                >
                    {isSubmitting ? 'Đang chuyển hướng...' : 'Tiếp tục đến Khảo sát Sức khỏe'}
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