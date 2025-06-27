import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../../configs/axios';
import DataTable from '../../../common/Table/DataTable';
import styles from './EventSearchAndList.module.css'; // Updated CSS import
import { useNavigate } from 'react-router-dom';

const EventSearchAndList = () => {
    const [events, setEvents] = useState([]); // Changed from schedules to events
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [keyword, setKeyword] = useState(''); // New state for keyword search
    const [hasSearched, setHasSearched] = useState(false);
    const [dateError, setDateError] = useState('');
    const [searchType, setSearchType] = useState('date'); // 'date' or 'keyword'
    const navigate = useNavigate();

    // Helper to format ISO strings to 'HH:MM AM/PM'
    const formatTimeFromISO = (isoString) => {
        if (!isoString) return '';
        try {
            const date = new Date(isoString);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            return `${formattedHour}:${formattedMinutes} ${ampm}`;
        } catch (e) {
            console.error("Lỗi định dạng thời gian ISO:", isoString, e);
            return 'N/A';
        }
    };

    const fetchEvents = useCallback(async (searchParams) => {
        setEvents([]); // Clear previous results
        setDateError(''); // Clear any previous date errors
        setHasSearched(true); // Indicate that a search attempt has been made

        try {
            let url = '';
            const params = {};

            if (searchParams.type === 'keyword') {
                if (!searchParams.keyword) {
                    // Do not search if keyword is empty
                    setEvents([]);
                    setHasSearched(false); // Reset if no keyword
                    return;
                }
                url = '/event/search'; // Changed endpoint
                params.keyword = searchParams.keyword;
            } else { // searchParams.type === 'date'
                if (!searchParams.startDate && !searchParams.endDate) {
                    setDateError('Vui lòng chọn ít nhất một ngày để tìm kiếm.');
                    setEvents([]);
                    setHasSearched(false); // Reset if no date
                    return;
                }
                if (searchParams.startDate && searchParams.endDate && new Date(searchParams.startDate) > new Date(searchParams.endDate)) {
                    setDateError('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
                    setEvents([]);
                    setHasSearched(false); // Reset if invalid date range
                    return;
                }

                url = '/event/by-date';
                if (searchParams.startDate) {
                    params.from = searchParams.startDate; // Ví dụ: "2025-06-25"
                } else {
                    params.from = '2000-01-01'; // Ngày mặc định
                }
                if (searchParams.endDate) {
                    params.to = searchParams.endDate;     // Ví dụ: "2025-06-25"
                } else {
                    params.to = '2100-01-01'; // Ngày mặc định
                }
            }

            const response = await axiosInstance.get(url, { params });
            setEvents(response.data); // Changed from schedules to events
            console.log('Kết quả tìm kiếm sự kiện:', response.data);
        } catch (error) {
            console.error('Lỗi khi tải sự kiện hiến máu:', error);
            setEvents([]); // Changed from schedules to events
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Lỗi từ máy chủ: ${error.response.data.message}`);
            } else {
                alert('Không thể tải sự kiện hiến máu. Vui lòng thử lại.');
            }
        }
    }, []);

    // Initial load: Fetch events for today's date
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day
        const todayISO = today.toISOString().split('T')[0];
        setStartDate(todayISO);
        setEndDate(todayISO); // Set end date to today as well for a single day search

        // Fetch events for today immediately
        fetchEvents({
            type: 'date',
            startDate: todayISO,
            endDate: todayISO
        });
    }, [fetchEvents]);


    const handleSearch = (e) => {
        e.preventDefault();
        if (searchType === 'keyword') {
            fetchEvents({ type: 'keyword', keyword });
        } else { // date search
            fetchEvents({ type: 'date', startDate, endDate });
        }
    };

    const handleRegisterClick = (eventId) => { // Changed scheduleId to eventId
        navigate(`/member/register-donation?eventId=${eventId}`); // Changed scheduleId to eventId
    };

    const eventColumns = [ // Changed scheduleColumns to eventColumns
        { header: 'ID', accessor: 'id' },
        { header: 'Tên Sự kiện', accessor: 'name' },
        { header: 'Ngày', accessor: 'date' }, // Assuming API returns 'date' in 'YYYY-MM-DD'
        {
            header: 'Thời gian',
            accessor: 'timeRange',
            render: (row) => {
                // API provides startTime and endTime as ISO strings
                const start = formatTimeFromISO(row.startTime);
                const end = formatTimeFromISO(row.endTime);
                return `${start} - ${end}`;
            }
        },
        { header: 'Địa điểm', accessor: 'address' },
        {
            header: 'SL Hiện tại/Tối đa',
            accessor: 'slots',
            render: (row) => `${row.currentSlot || 0}/${row.maxSlot}`
        },
        {
            header: 'Trạng thái',
            accessor: 'status',
            render: (row) => {
                // Assuming status could be 'ACTIVE', 'INACTIVE', etc.
                const statusMap = {
                    'ACTIVE': 'Đang diễn ra',
                    'INACTIVE': 'Đã kết thúc',
                    'UPCOMING': 'Sắp diễn ra', // Example status if applicable
                    'CANCELLED': 'Đã hủy',     // Example status if applicable
                    // Add more as per your backend enum
                };
                return statusMap[row.status] || row.status;
            }
        },
        {
            header: 'Thao tác',
            accessor: 'actions',
            render: (row) => {
                // An event is available if it's 'ACTIVE' and has available slots
                const isAvailable = row.status === 'ACTIVE' && (row.currentSlot < row.maxSlot);
                return (
                    isAvailable ? (
                        <button
                            className={styles.registerButton}
                            onClick={() => handleRegisterClick(row.id)}
                        >
                            Đăng ký
                        </button>
                    ) : (
                        <span className={styles.unavailableText}>
                            {row.status === 'ACTIVE' && row.currentSlot >= row.maxSlot ? 'Hết chỗ' : 'Không khả dụng'}
                        </span>
                    )
                );
            }
        },
    ];

    return (
        <div className={styles.eventSearchAndList}> {/* Updated CSS class name */}
            <h2 className={styles.pageTitle}>Tìm kiếm Sự kiện Hiến Máu</h2> {/* Updated title */}

            <form onSubmit={handleSearch} className={styles.searchForm}>
                <div className={styles.radioGroup}>
                    <label>
                        <input
                            type="radio"
                            value="date"
                            checked={searchType === 'date'}
                            onChange={() => setSearchType('date')}
                        />
                        Tìm theo Ngày
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="keyword"
                            checked={searchType === 'keyword'}
                            onChange={() => setSearchType('keyword')}
                        />
                        Tìm theo Từ khóa
                    </label>
                </div>

                {searchType === 'date' ? (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="startDate">Từ ngày:</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    setDateError('');
                                    setKeyword(''); // Clear keyword when switching to date search
                                }}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="endDate">Đến ngày:</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                    setDateError('');
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <div className={styles.formGroup}>
                        <label htmlFor="keyword">Từ khóa:</label>
                        <input
                            type="text"
                            id="keyword"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setStartDate(''); // Clear dates when switching to keyword search
                                setEndDate('');
                                setDateError('');
                            }}
                            placeholder="Nhập tên sự kiện, địa điểm..."
                        />
                    </div>
                )}
                
                <button type="submit" className={styles.searchButton}>Tìm kiếm</button>
            </form>

            {dateError && (
                <p className={styles.dateErrorMessage}>{dateError}</p>
            )}

            <div className={styles.resultsSection}>
                <h3>Kết quả tìm kiếm</h3>
                {hasSearched ? (
                    events.length > 0 ? (
                        <DataTable data={events} columns={eventColumns} />
                    ) : (
                        <p>Không tìm thấy sự kiện hiến máu nào trong khoảng thời gian/từ khóa đã chọn.</p>
                    )
                ) : (
                    <p>Sử dụng bộ lọc trên để tìm kiếm sự kiện hiến máu.</p>
                )}
            </div>
        </div>
    );
};

export default EventSearchAndList;