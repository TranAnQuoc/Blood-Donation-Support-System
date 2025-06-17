import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../configs/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';

const DonationRequestList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const params = filterStatus ? { status: filterStatus } : {};
            // SỬA: Thay đổi endpoint
            const res = await axiosInstance.get('/donation-requests', { params });
            setRequests(Array.isArray(res.data) ? res.data : []);
            setError(null);
        } catch (err) {
            console.error('Error fetching donation requests:', err);
            setError('Không thể tải danh sách yêu cầu hiến máu.');
        } finally {
            setLoading(false);
        }
    }, [filterStatus]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleApprove = async (requestId) => {
        const requestToProcess = requests.find(req => req.id === requestId);
        if (requestToProcess && requestToProcess.status !== 'PENDING') {
            toast.warn('Chỉ có thể duyệt các yêu cầu ở trạng thái PENDING.');
            return;
        }

        if (window.confirm('Bạn có chắc chắn muốn duyệt yêu cầu này không?')) {
            setIsApproving(true);
            try {
                const res = await axiosInstance.put(`/donation-requests/${requestId}/approved`);

                if (res.data && res.data.message) {
                    toast.success(res.data.message);
                } else {
                    toast.success('Yêu cầu đã được duyệt thành công!');
                }

                setRequests(prevRequests =>
                    prevRequests.map(req =>
                        req.id === requestId ? { ...req, status: 'APPROVED' } : req
                    )
                );

            } catch (err) {
                console.error('Lỗi khi duyệt yêu cầu:', err);
                toast.error('Có lỗi xảy ra khi duyệt yêu cầu. Vui lòng thử lại.');
            } finally {
                setIsApproving(false);
            }
        }
    };

    const handleReject = async () => {
        if (!selectedRequestId) return;

        const requestToProcess = requests.find(req => req.id === selectedRequestId);
        if (requestToProcess && requestToProcess.status !== 'PENDING') {
            toast.warn('Chỉ có thể từ chối các yêu cầu ở trạng thái PENDING.');
            setSelectedRequestId(null);
            setRejectionReason('');
            return;
        }

        if (!rejectionReason.trim()) {
            toast.error('Vui lòng nhập lý do từ chối.');
            return;
        }

        if (window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu này không?')) {
            setIsRejecting(true);
            try {
                const res = await axiosInstance.put(`/donation-requests/${selectedRequestId}/rejected`, { reason: rejectionReason.trim() });

                if (res.data && res.data.message) {
                    toast.success(res.data.message);
                } else {
                    toast.success('Yêu cầu đã được từ chối thành công!');
                }

                setRequests(prevRequests =>
                    prevRequests.map(req =>
                        req.id === selectedRequestId ? { ...req, status: 'REJECTED', note: rejectionReason.trim() } : req
                    )
                );

                setSelectedRequestId(null);
                setRejectionReason('');

            } catch (err) {
                console.error('Lỗi khi từ chối yêu cầu:', err);
                toast.error('Có lỗi xảy ra khi từ chối yêu cầu. Vui lòng thử lại.');
            } finally {
                setIsRejecting(false);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-blue-100 text-blue-800';
            case 'APPROVED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            case 'CANCELLED': return 'bg-gray-200 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="text-center py-6 text-xl font-medium text-gray-600">Đang tải danh sách yêu cầu...</div>;
    }

    if (error) {
        return <div className="text-center py-6 text-xl font-bold text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-red-700">Quản Lý Yêu Cầu Hiến Máu</h2>

            <div className="mb-6 flex justify-end items-center space-x-2">
                <label htmlFor="statusFilter" className="text-gray-700 text-base font-semibold">
                    Lọc theo trạng thái:
                </label>
                <select
                    id="statusFilter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="shadow-sm border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                >
                    <option value="">Tất cả</option>
                    <option value="PENDING">Chờ Duyệt</option>
                    <option value="APPROVED">Đã Duyệt</option>
                    <option value="REJECTED">Từ Chối</option>
                    <option value="CANCELLED">Đã Hủy</option>
                </select>
            </div>

            {requests.length === 0 ? (
                <p className="text-center text-gray-700 text-lg p-6 border rounded-lg bg-white shadow-sm">
                    Không có yêu cầu hiến máu nào phù hợp với bộ lọc hiện tại.
                </p>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead className="bg-red-600 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold">ID</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Người Yêu Cầu</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Lịch Hiến Máu</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Địa Điểm</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Nhóm Máu</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Số Lượng (ml)</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Lý Do</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Trạng Thái</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Ngày Gửi</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Ghi Chú</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-100 transition-colors duration-150">
                                    <td className="py-3 px-4 text-sm">{req.id}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className="font-medium">{req.requester?.fullName}</span><br/>
                                        <span className="text-gray-500 text-xs">{req.requester?.email}</span>
                                    </td>
                                    <td className="py-3 px-4 text-sm">{req.donationSchedule?.name || 'N/A'}</td>
                                    <td className="py-3 px-4 text-sm">{req.donationSchedule?.facility?.name || 'N/A'}</td>
                                    <td className="py-3 px-4 text-sm">{req.bloodType?.bloodName || 'N/A'}</td>
                                    <td className="py-3 px-4 text-sm">{req.quantityMl}</td>
                                    <td className="py-3 px-4 text-sm">{req.reason}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm">{dayjs(req.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                    <td className="py-3 px-4 text-sm">{req.note || 'Không có'}</td>
                                    <td className="py-3 px-4">
                                        {req.status === 'PENDING' && (
                                            <div className="flex flex-col space-y-2">
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-xs transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={isApproving || isRejecting}
                                                >
                                                    {isApproving ? 'Đang duyệt...' : 'Duyệt'}
                                                </button>
                                                <button
                                                    onClick={() => setSelectedRequestId(req.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={isApproving || isRejecting}
                                                >
                                                    Từ Chối
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedRequestId && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md animate-fade-in-up">
                        <h3 className="text-xl font-bold mb-6 text-gray-800">Từ Chối Yêu Cầu Hiến Máu</h3>
                        <p className="mb-4 text-gray-700">
                            Bạn đang từ chối yêu cầu #<span className="font-semibold">{selectedRequestId}</span>. Vui lòng nhập lý do từ chối:
                        </p>
                        <div className="mb-6">
                            <label htmlFor="rejectionReason" className="block text-gray-700 text-sm font-bold mb-2">
                                Lý do từ chối:
                            </label>
                            <textarea
                                id="rejectionReason"
                                rows="4"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-red-500 transition duration-200"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Ví dụ: Người yêu cầu không đủ điều kiện sức khỏe; Thông tin không hợp lệ..."
                                required
                                disabled={isRejecting}
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setSelectedRequestId(null);
                                    setRejectionReason('');
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isRejecting}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleReject}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isRejecting}
                            >
                                {isRejecting ? 'Đang gửi...' : 'Xác Nhận Từ Chối'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationRequestList;