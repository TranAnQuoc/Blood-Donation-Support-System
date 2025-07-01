import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../../configs/axios';
import DataTable from '../../../common/Table/DataTable';
import styles from './EventSearchAndList.module.css';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const EventSearchAndList = () => {
    const [events, setEvents] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [keyword, setKeyword] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [dateError, setDateError] = useState('');
    const [searchType, setSearchType] = useState('date');
    const [loading, setLoading] = useState(true); // eslint-disable-line no-unused-vars
    const navigate = useNavigate();

    const formatTimeFromISO = (isoString) => {
        if (!isoString) return '';
        try {
            let dateToParse = isoString;
            if (isoString.match(/^\d{2}:\d{2}:\d{2}(.\d{3})?$/)) {
                dateToParse = `2000-01-01T${isoString}`;
            }
            
            const date = new Date(dateToParse);

            if (isNaN(date.getTime())) {
                console.warn("Invalid date string for time formatting:", isoString);
                return 'N/A';
            }

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
        setEvents([]);
        setDateError('');
        setHasSearched(true);

        try {
            let url = '';
            const params = {};

            if (searchParams.type === 'keyword') {
                if (!searchParams.keyword) {
                    setEvents([]);
                    setHasSearched(false);
                    return;
                }
                url = '/event/search';
                params.keyword = searchParams.keyword;
            } else {
                if (!searchParams.startDate && !searchParams.endDate) {
                    setDateError('Vui lòng chọn ít nhất một ngày để tìm kiếm.');
                    setEvents([]);
                    setHasSearched(false);
                    return;
                }
                if (searchParams.startDate && searchParams.endDate && dayjs(searchParams.startDate).isAfter(dayjs(searchParams.endDate))) {
                    setDateError('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
                    setEvents([]);
                    setHasSearched(false);
                    return;
                }

                url = '/event/by-date';
                if (searchParams.startDate) {
                    params.from = searchParams.startDate;
                } else {
                    params.from = '2000-01-01';
                }
                if (searchParams.endDate) {
                    params.to = searchParams.endDate;
                } else {
                    params.to = '2100-01-01';
                }
            }

            const response = await axiosInstance.get(url, { params });
            setEvents(response.data);
            console.log('Kết quả tìm kiếm sự kiện:', response.data);
        } catch (error) {
            console.error('Lỗi khi tải sự kiện hiến máu:', error);
            setEvents([]);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Lỗi từ máy chủ: ${error.response.data.message}`);
            } else {
                alert('Không thể tải sự kiện hiến máu. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const today = dayjs().format('YYYY-MM-DD');
        setStartDate(today);
        setEndDate(today);

        fetchEvents({
            type: 'date',
            startDate: today,
            endDate: today
        });
    }, [fetchEvents]);


    const handleSearch = (e) => {
        e.preventDefault();
        if (searchType === 'keyword') {
            fetchEvents({ type: 'keyword', keyword });
        } else {
            fetchEvents({ type: 'date', startDate, endDate });
        }
    };

    const handleRegisterClick = (eventId) => {
        navigate(`/member/register-donation?eventId=${eventId}`); 
    };

    const eventColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Tên Sự kiện', accessor: 'name' },
        { header: 'Ngày', accessor: 'date' },
        {
            header: 'Thời gian',
            accessor: 'timeRange',
            render: (row) => {
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
                const statusMap = {
                    'ACTIVE': 'Đang diễn ra',
                    'INACTIVE': 'Đã kết thúc',
                    'UPCOMING': 'Sắp diễn ra',
                    'CANCELLED': 'Đã hủy',
                };
                return statusMap[row.status] || row.status;
            }
        },
        {
            header: 'Thao tác',
            accessor: 'actions',
            render: (row) => {
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
        <div className={styles.eventSearchAndList}>
            <h2 className={styles.pageTitle}>Tìm kiếm Sự kiện Hiến Máu</h2>

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
                    <div className={styles.dateSearchInputs}>
                        <div className={styles.formGroup}>
                            <label htmlFor="startDate">Từ ngày:</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    setDateError('');
                                    setKeyword('');
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
                        <button type="submit" className={styles.searchButton}>Tìm kiếm</button>
                    </div>
                ) : (
                    <div className={styles.keywordSearchInput}>
                        <div className={styles.formGroup}>
                            <label htmlFor="keyword">Từ khóa:</label>
                            <input
                                type="text"
                                id="keyword"
                                value={keyword}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                    setStartDate('');
                                    setEndDate('');
                                    setDateError('');
                                }}
                                placeholder="Nhập tên sự kiện, địa điểm..."
                            />
                        </div>
                        <button type="submit" className={styles.searchButton}>Tìm kiếm</button>
                    </div>
                )}
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
                        <p className={styles.noResultsMessage}>Không tìm thấy sự kiện hiến máu nào trong khoảng thời gian/từ khóa đã chọn.</p>
                    )
                ) : (
                    <p className={styles.initialSearchMessage}>Sử dụng bộ lọc trên để tìm kiếm sự kiện hiến máu.</p>
                )}
            </div>
        </div>
    );
};

export default EventSearchAndList;
