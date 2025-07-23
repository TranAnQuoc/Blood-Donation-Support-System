import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../configs/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false
    });
};

const TransfusionProcessDetail = () => {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [process, setProcess] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        transfusionStartedAt: '',
        transfusionCompletedAt: '',
        status: 'IN_PROGRESS',
        healthCheckPassed: false,
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        staffNotes: '',
        allergyNotes: ''
    });

    useEffect(() => {
        const fetchProcess = async () => {
            try {
                const res = await axiosInstance.get(`/transfusion-process/${requestId}/process`);
                if (res.data) {
                    setProcess(res.data);
                    setFormData({ ...formData, ...res.data });
                }
            } catch (err) {
                toast.warn("Không có quá trình nào cho yêu cầu này. Bạn có thể tạo mới.");
            } finally {
                setLoading(false);
            }
        };
        fetchProcess();
    }, [requestId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        try {
            await axiosInstance.post(`/api/transfusion-process/${requestId}/process`, formData);
            toast.success("Lưu quá trình truyền máu thành công");

            if (formData.status === 'COMPLETED' || formData.status === 'INTERRUPTED') {
                toast.info("Trạng thái đã hoàn tất hoặc gián đoạn – dữ liệu sẽ được chuyển vào Lịch sử.");
            }

            navigate('/staff-dashboard/transfusion-processes');
        } catch (err) {
            toast.error("Lỗi khi lưu quá trình");
        }
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Chi tiết quá trình truyền máu - Yêu cầu ID: {requestId}</h2>

            <div className="space-y-4">
                <div>
                    <label className="block font-medium">Thời gian bắt đầu:</label>
                    <input type="datetime-local" name="transfusionStartedAt" value={formData.transfusionStartedAt || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block font-medium">Thời gian kết thúc:</label>
                    <input type="datetime-local" name="transfusionCompletedAt" value={formData.transfusionCompletedAt || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block font-medium">Trạng thái:</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="IN_PROGRESS">Đang tiến hành</option>
                        <option value="COMPLETED">Hoàn thành</option>
                        <option value="INTERRUPTED">Gián đoạn</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="font-medium">Kiểm tra sức khỏe đạt:</label>
                    <input type="checkbox" name="healthCheckPassed" checked={formData.healthCheckPassed} onChange={handleChange} />
                </div>

                <div>
                    <label className="block font-medium">Huyết áp:</label>
                    <input type="text" name="bloodPressure" value={formData.bloodPressure || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block font-medium">Nhịp tim:</label>
                    <input type="text" name="heartRate" value={formData.heartRate || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block font-medium">Nhiệt độ (°C):</label>
                    <input type="number" name="temperature" value={formData.temperature || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block font-medium">Ghi chú nhân viên:</label>
                    <textarea name="staffNotes" value={formData.staffNotes || ''} onChange={handleChange} className="w-full p-2 border rounded" rows={3} />
                </div>

                <div>
                    <label className="block font-medium">Ghi chú dị ứng:</label>
                    <textarea name="allergyNotes" value={formData.allergyNotes || ''} onChange={handleChange} className="w-full p-2 border rounded" rows={3} />
                </div>

                <div className="mt-4">
                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
                        Lưu quá trình
                    </button>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default TransfusionProcessDetail;
