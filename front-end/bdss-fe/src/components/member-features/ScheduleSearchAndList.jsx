import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../configs/axios';
import DataTable from './DataTable'; // Component DataTable bạn đã tạo ở bước trước (Option 1)
import styles from './ScheduleSearchAndList.module.css';

const ScheduleSearchAndList = () => {
    const [schedules, setSchedules] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hasSearched, setHasSearched] = useState(false); // Theo dõi xem đã tìm kiếm lần nào chưa

    // Hàm fetchSchedules được cập nhật để nhận tham số ngày
    const fetchSchedulesByDate = useCallback(async (start, end) => {
        try {
            let url = 'schedules/by-date';
            const params = {};

            if (start) {
                params.startDate = start;
            }
            if (end) {
                params.endDate = end;
            }

            // Chỉ thêm params vào URL nếu có ít nhất một ngày được chọn
            const response = await axiosInstance.get(url, { params });
            setSchedules(response.data);
            setHasSearched(true); // Đánh dấu là đã tìm kiếm
            console.log('Lịch hiến máu theo ngày:', response.data);
        } catch (error) {
            console.error('Lỗi khi tải lịch hiến máu theo ngày:', error);
            setSchedules([]); // Xóa dữ liệu cũ nếu có lỗi
            setHasSearched(true); // Vẫn đánh dấu đã tìm kiếm để hiển thị thông báo "Không có lịch"
            alert('Không thể tải lịch hiến máu. Vui lòng thử lại.');
        }
    }, []);

    // Load tất cả lịch khi component mount lần đầu (nếu muốn hiển thị tất cả trước khi lọc)
    // Hoặc chỉ load khi có ngày được chọn. Ở đây, tôi sẽ không gọi mặc định để tránh load quá nhiều
    // Nếu bạn muốn hiển thị tất cả khi load, hãy dùng endpoint GET /api/schedules/staff-view
    // và đổi tên thành fetchAllSchedules và gọi nó trong useEffect đầu tiên
    useEffect(() => {
        // Tùy chọn: Gọi API với ngày hiện tại đến tương lai làm mặc định
        const today = new Date().toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
        setStartDate(today); // Đặt ngày bắt đầu mặc định là hôm nay
        // fetchSchedulesByDate(today, ''); // Có thể tự động gọi tìm kiếm khi tải trang
    }, [fetchSchedulesByDate]);


    const handleSearch = (e) => {
        e.preventDefault();
        // Kiểm tra nếu cả hai ngày đều trống
        if (!startDate && !endDate) {
            alert('Vui lòng chọn ít nhất một ngày để tìm kiếm.');
            setSchedules([]); // Xóa dữ liệu cũ nếu người dùng xóa cả hai ngày
            setHasSearched(false); // Reset trạng thái tìm kiếm
            return;
        }

        // Đảm bảo startDate <= endDate
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            alert('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
            return;
        }
        
        fetchSchedulesByDate(startDate, endDate);
    };

    // Định nghĩa các cột cho DataTable, tương tự như ScheduleManagement nhưng có thể điều chỉnh
    const scheduleColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Tên Sự kiện', accessor: 'name' },
        { header: 'Ngày', accessor: 'date' },
        {
            header: 'Thời gian',
            accessor: 'timeRange',
            render: (row) => {
                const formatTimeToAMPM = (timeString) => {
                    if (!timeString) return '';
                    const [hours, minutes] = timeString.split(':');
                    const hour = parseInt(hours, 10);
                    const ampm = hour >= 12 ? 'PM' : 'AM'; // Hoặc 'CH' và 'SA'
                    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
                    return `${formattedHour}:${minutes} ${ampm}`;
                };
                const start = formatTimeToAMPM(row.startTime);
                const end = formatTimeToAMPM(row.endTime);
                return `${start} - ${end}`;
            }
        },
        { header: 'Địa điểm', accessor: 'address' },
        {
            header: 'Cơ sở', // Đổi header cho thân thiện hơn
            accessor: 'facilityName',
            render: (row) => row.facility ? row.facility.name : 'N/A' // Hiển thị tên cơ sở
        },
        {
            header: 'SL Hiện tại/Tối đa',
            accessor: 'slots',
            render: (row) => `${row.currentSlot || 0}/${row.maxSlot}`
        },
        { header: 'Trạng thái', accessor: 'status' },
    ];

    return (
        <div className={styles.scheduleSearchAndList}>
            <h2 className={styles.pageTitle}>Tìm kiếm Lịch Hiến Máu</h2>

            <form onSubmit={handleSearch} className={styles.searchForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="startDate">Từ ngày:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="endDate">Đến ngày:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.searchButton}>Tìm kiếm</button>
            </form>

            <div className={styles.resultsSection}>
                <h3>Kết quả tìm kiếm</h3>
                {hasSearched ? ( // Chỉ hiển thị kết quả nếu đã có tìm kiếm
                    schedules.length > 0 ? (
                        <DataTable data={schedules} columns={scheduleColumns} />
                    ) : (
                        <p>Không tìm thấy lịch hiến máu nào trong khoảng thời gian đã chọn.</p>
                    )
                ) : (
                    <p>Sử dụng bộ lọc trên để tìm kiếm lịch hiến máu.</p> // Thông báo ban đầu
                )}
            </div>
        </div>
    );
};

export default ScheduleSearchAndList;