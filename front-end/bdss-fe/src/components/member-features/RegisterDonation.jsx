import React, { useState, useEffect } from 'react';
import axiosInstance from '../../configs/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import dayjs from 'dayjs';

const RegisterDonation = () => {
    const [donationSchedules, setDonationSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [selectedBloodType, setSelectedBloodType] = useState(null);
    const [quantityMl, setQuantityMl] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const staticBloodTypes = [
        { id: 1, bloodName: 'A+' },
        { id: 2, bloodName: 'A-' },
        { id: 3, bloodName: 'B+' },
        { id: 4, bloodName: 'B-' },
        { id: 5, bloodName: 'AB+' },
        { id: 6, bloodName: 'AB-' },
        { id: 7, bloodName: 'O+' },
        { id: 8, bloodName: 'O-' },
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

            setDonationSchedules(prevSchedules =>
                prevSchedules.map(s =>
                    s.id === selectedSchedule.value ? { ...s, currentSlot: s.currentSlot + 1 } : s // Tăng currentSlot lên 1
                )
            );
        } catch (err) {
            console.error('Lỗi khi đăng ký hiến máu:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-4 text-lg">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-600 text-lg">{error}</div>;
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
        <div className="container mx-auto p-4 max-w-2xl bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-8 text-center text-red-700">Đăng Ký Hiến Máu</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="schedule" className="block text-gray-800 text-base font-semibold mb-2">
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
                        className="react-select-container"
                        classNamePrefix="react-select"
                        isDisabled={isSubmitting}
                    />
                    {scheduleOptions.length === 0 && !loading && (
                        <p className="text-sm text-red-500 mt-2">Hiện không có lịch hiến máu nào khả dụng.</p>
                    )}
                </div>

                <div>
                <label htmlFor="bloodType" className="block text-gray-800 text-base font-semibold mb-2">
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
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isDisabled={isSubmitting}
                />
            </div>

                <div>
                    <label htmlFor="quantityMl" className="block text-gray-800 text-base font-semibold mb-2">
                        Số Lượng Máu (ml):
                    </label>
                    <input
                        type="number"
                        id="quantityMl"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-200"
                        value={quantityMl}
                        onChange={(e) => setQuantityMl(e.target.value)}
                        placeholder="Ví dụ: 250, 350, 450"
                        min="1"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label htmlFor="reason" className="block text-gray-800 text-base font-semibold mb-2">
                        Lý Do Đăng Ký Hiến Máu:
                    </label>
                    <textarea
                        id="reason"
                        rows="4"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-200"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Ví dụ: Tôi muốn góp phần giúp đỡ cộng đồng và những người cần máu."
                        required
                        disabled={isSubmitting}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu Đăng Ký'}
                </button>
            </form>
        </div>
    );
};

export default RegisterDonation;