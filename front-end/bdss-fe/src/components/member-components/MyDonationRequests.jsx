import React, { useState, useEffect } from 'react';
import axiosInstance from '../../configs/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';

const MyDonationRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/blood-requests/my-requests');
            setRequests(res.data);
        } catch (err) {
            console.error('Error fetching my donation requests:', err);
            setError('Không thể tải danh sách yêu cầu của bạn.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRequest = async (requestId) => {
        const requestToCancel = requests.find(req => req.id === requestId);

        if (!requestToCancel || requestToCancel.status !== 'PENDING') {
            toast.warn('Bạn chỉ có thể hủy yêu cầu khi đang ở trạng thái PENDING.');
            return;
        }
        
        if (window.confirm('Bạn có chắc chắn muốn hủy yêu cầu này không? Yêu cầu chỉ có thể hủy khi đang ở trạng thái PENDING.')) {
            try {
                const res = await axiosInstance.put(`/blood-requests/${requestId}/cancel`);
                if (res.data && res.data.message) {
                    toast.success(res.data.message);
                } else {
                    toast.success('Yêu cầu hiến máu đã được hủy thành công!');
                }
                setRequests(prevRequests =>
                    prevRequests.map(req =>
                        req.id === requestId ? { ...req, status: 'CANCELLED' } : req
                    )
                );
            } catch (err) {
                console.error('Lỗi khi hủy yêu cầu:', err);
            }
        }
    };

    if (loading) {
        return <div className="text-center py-4">Đang tải yêu cầu của bạn...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Yêu Cầu Hiến Máu Của Tôi</h2>

            {requests.length === 0 ? (
                <p className="text-center text-gray-600">Bạn chưa có yêu cầu hiến máu nào.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-red-500 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">Lịch Hiến Máu</th>
                                <th className="py-3 px-4 text-left">Địa Điểm</th>
                                <th className="py-3 px-4 text-left">Nhóm Máu</th>
                                <th className="py-3 px-4 text-left">Số Lượng (ml)</th>
                                <th className="py-3 px-4 text-left">Lý Do</th>
                                <th className="py-3 px-4 text-left">Trạng Thái</th>
                                <th className="py-3 px-4 text-left">Ngày Gửi</th>
                                <th className="py-3 px-4 text-left">Ghi Chú</th>
                                <th className="py-3 px-4 text-left">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="py-3 px-4">{req.id}</td>
                                    <td className="py-3 px-4">{req.donationSchedule?.name || 'N/A'}</td>
                                    <td className="py-3 px-4">{req.donationSchedule?.facility?.name || 'N/A'}</td>
                                    <td className="py-3 px-4">{req.bloodType?.bloodName || 'N/A'}</td>
                                    <td className="py-3 px-4">{req.quantityMl}</td>
                                    <td className="py-3 px-4">{req.reason}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            req.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                                            req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{dayjs(req.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                    <td className="py-3 px-4">{req.note || 'Không có'}</td>
                                    <td className="py-3 px-4">
                                        {req.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleCancelRequest(req.id)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm"
                                            >
                                                Hủy
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyDonationRequests;