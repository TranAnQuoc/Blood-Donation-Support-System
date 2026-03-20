import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../../configs/axios'; // Đảm bảo đường dẫn đúng
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './index.module.css';
import moment from 'moment'; // Để định dạng ngày tháng

// Giả định các Enum từ backend của bạn (vẫn giữ nguyên vì cần để hiển thị)
const StatusBloodStorage = {
    IN_STORAGE: "IN_STORAGE",
    APPROVED: "APPROVED",
    TAKEN: "TAKEN",
    REJECTED: "REJECTED",
    // Thêm các trạng thái khác nếu có
};

const StatusVerified = {
    PENDING: "PENDING",
    VERIFIED: "VERIFIED",
    REJECTED: "REJECTED",
};

const BloodStorageStatusList = () => {
    const [allBloodBags, setAllBloodBags] = useState([]); // Lưu trữ tất cả túi máu gốc
    const [filteredBloodBags, setFilteredBloodBags] = useState([]); // Lưu trữ túi máu đã lọc để hiển thị
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States cho các bộ lọc (bây giờ xử lý ở frontend)
    const [availableBloodTypes, setAvailableBloodTypes] = useState([]); // Các loại máu duy nhất từ dữ liệu
    const [availableBloodComponents, setAvailableBloodComponents] = useState([]); // Các thành phần máu duy nhất từ dữ liệu

    const [selectedBloodType, setSelectedBloodType] = useState(''); // Lưu trữ string loại máu
    const [selectedBloodComponent, setSelectedBloodComponent] = useState(''); // Lưu trữ string thành phần máu
    const [selectedBloodStatus, setSelectedBloodStatus] = useState(''); // "" cho tất cả

    // Hàm lấy TẤT CẢ trạng thái túi máu của người dùng
    const fetchAllMyBloodBags = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/blood-storage/my-bags'); // Endpoint đã sửa
            setAllBloodBags(response.data); // Lưu trữ tất cả dữ liệu
            console.log("Tất cả túi máu của tôi:", response.data);
        } catch (err) {
            console.error('Lỗi khi lấy tất cả túi máu của tôi:', err);
            setError('Không thể tải trạng thái túi máu. Vui lòng thử lại sau.');
            toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm để trích xuất các giá trị duy nhất cho dropdown từ dữ liệu đã fetch
    const extractUniqueFilterOptions = useCallback((bags) => {
        const types = new Set();
        const components = new Set();
        bags.forEach(bag => {
            if (bag.bloodType) types.add(bag.bloodType);
            if (bag.bloodComponent) components.add(bag.bloodComponent);
        });
        setAvailableBloodTypes(Array.from(types).sort());
        setAvailableBloodComponents(Array.from(components).sort());
    }, []);

    // Hàm lọc dữ liệu ở frontend
    const applyFilters = useCallback(() => {
        let tempBags = [...allBloodBags]; // Bắt đầu với tất cả túi máu

        if (selectedBloodType) {
            tempBags = tempBags.filter(bag => bag.bloodType === selectedBloodType);
        }

        if (selectedBloodComponent) {
            tempBags = tempBags.filter(bag => bag.bloodComponent === selectedBloodComponent);
        }

        if (selectedBloodStatus) {
            tempBags = tempBags.filter(bag => bag.bloodStatus === selectedBloodStatus);
        }

        setFilteredBloodBags(tempBags);
    }, [allBloodBags, selectedBloodType, selectedBloodComponent, selectedBloodStatus]);


    // Gọi hàm fetchAllMyBloodBags khi component mount
    useEffect(() => {
        fetchAllMyBloodBags();
    }, [fetchAllMyBloodBags]);

    // Khi allBloodBags thay đổi, cập nhật các tùy chọn lọc và áp dụng lại bộ lọc
    useEffect(() => {
        extractUniqueFilterOptions(allBloodBags);
        applyFilters(); // Áp dụng bộ lọc ban đầu hoặc sau khi dữ liệu mới được tải
    }, [allBloodBags, extractUniqueFilterOptions, applyFilters]);

    // Khi các bộ lọc thay đổi, áp dụng lại bộ lọc
    useEffect(() => {
        applyFilters();
    }, [selectedBloodType, selectedBloodComponent, selectedBloodStatus, applyFilters]);


    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải trạng thái túi máu...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className="text-3xl font-bold mb-8 text-center text-green-700">
                Trạng Thái Túi Máu Của Bạn
            </h2>

            {/* Filter Section */}
            <div className={styles.filterSection}>
                <div className={styles.filterGroup}>
                    <label htmlFor="bloodTypeFilter">Loại máu:</label>
                    <select
                        id="bloodTypeFilter"
                        value={selectedBloodType}
                        onChange={(e) => setSelectedBloodType(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="">Tất cả</option>
                        {availableBloodTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="bloodComponentFilter">Thành phần máu:</label>
                    <select
                        id="bloodComponentFilter"
                        value={selectedBloodComponent}
                        onChange={(e) => setSelectedBloodComponent(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="">Tất cả</option>
                        {availableBloodComponents.map(component => (
                            <option key={component} value={component}>{component}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="bloodStatusFilter">Trạng thái túi máu:</label>
                    <select
                        id="bloodStatusFilter"
                        value={selectedBloodStatus}
                        onChange={(e) => setSelectedBloodStatus(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="">Tất cả</option>
                        {Object.values(StatusBloodStorage).map(status => (
                            <option key={status} value={status}>{
                                status === StatusBloodStorage.IN_STORAGE ? 'Trong kho' :
                                status === StatusBloodStorage.APPROVED ? 'Đã duyệt' :
                                status === StatusBloodStorage.TAKEN ? 'Đã nhận' :
                                status === StatusBloodStorage.REJECTED ? 'Đã từ chối' :
                                status
                            }</option>
                        ))}
                    </select>
                </div>

                <button onClick={() => {
                    setSelectedBloodType('');
                    setSelectedBloodComponent('');
                    setSelectedBloodStatus('');
                    // applyFilters sẽ được gọi lại thông qua useEffect
                }} className={styles.clearFilterButton}>Xóa bộ lọc</button>
            </div>

            {filteredBloodBags.length === 0 ? (
                <div className={styles.noDataMessage}>Không tìm thấy túi máu nào theo tiêu chí lọc.</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Loại máu</th>
                                <th>Thành phần</th>
                                <th>Số lượng (ml/đơn vị)</th>
                                <th>Trạng thái túi máu</th>
                                <th>Ngày tạo</th>
                                <th>Ngày duyệt</th>
                                <th>Ngày nhận</th>
                                <th>Lý do sử dụng</th>
                                <th>Trạng thái xác minh</th>
                                <th>Ghi chú xác minh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBloodBags.map((bag) => ( // Sử dụng filteredBloodBags
                                <tr key={bag.id}>
                                    <td data-label="ID">{bag.id}</td>
                                    <td data-label="Loại máu">{bag.bloodType || 'N/A'}</td>
                                    <td data-label="Thành phần">{bag.bloodComponent || 'N/A'}</td>
                                    <td data-label="Số lượng">{bag.quantity}</td>
                                    <td data-label="Trạng thái túi máu">
                                        <span className={`${styles.statusBadge} ${styles[bag.bloodStatus?.toLowerCase()]}`}>
                                            {bag.bloodStatus === StatusBloodStorage.IN_STORAGE ? 'Trong kho' :
                                             bag.bloodStatus === StatusBloodStorage.APPROVED ? 'Đã duyệt' :
                                             bag.bloodStatus === StatusBloodStorage.TAKEN ? 'Đã nhận' :
                                             bag.bloodStatus === StatusBloodStorage.REJECTED ? 'Đã từ chối' :
                                             bag.bloodStatus || 'N/A'}
                                        </span>
                                    </td>
                                    <td data-label="Ngày tạo">
                                        {bag.createAt ? moment(bag.createAt).format('DD/MM/YYYY HH:mm') : 'N/A'}
                                    </td>
                                    <td data-label="Ngày duyệt">
                                        {bag.approvedAt ? moment(bag.approvedAt).format('DD/MM/YYYY HH:mm') : 'N/A'}
                                    </td>
                                    <td data-label="Ngày nhận">
                                        {bag.takeAt ? moment(bag.takeAt).format('DD/MM/YYYY HH:mm') : 'N/A'}
                                    </td>
                                    <td data-label="Lý do sử dụng">{bag.usageReason || 'N/A'}</td>
                                    <td data-label="Trạng thái xác minh">
                                        <span className={`${styles.verifiedStatusBadge} ${styles[bag.verifiedStatus?.toLowerCase()]}`}>
                                            {bag.verifiedStatus === StatusVerified.PENDING ? 'Chờ xử lý' :
                                             bag.verifiedStatus === StatusVerified.VERIFIED ? 'Đã xác minh' :
                                             bag.verifiedStatus === StatusVerified.REJECTED ? 'Từ chối' :
                                             bag.verifiedStatus || 'N/A'}
                                        </span>
                                    </td>
                                    <td data-label="Ghi chú xác minh">{bag.verifiedNote || 'Không có'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default BloodStorageStatusList;