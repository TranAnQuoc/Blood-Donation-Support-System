import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../../../../configs/axios';
import 'react-toastify/dist/ReactToastify.css';
import styles from './TransfusionRequestDetail.module.css';

const formatDateTime = (value) => {
  if (!value) return 'Chua cap nhat';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Ngay khong hop le';
  }

  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const statusLabelMap = {
  ACTIVE: 'Hoat dong',
  INACTIVE: 'Da vo hieu hoa',
};

const TransfusionRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequestDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/transfusion-requests/${id}`);
      setRequest(response.data);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Khong the tai chi tiet yeu cau nhan mau.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setError('Khong tim thay ma yeu cau.');
      setLoading(false);
      return;
    }

    fetchRequestDetail();
  }, [id, fetchRequestDetail]);

  if (loading) {
    return <div className={styles.container}>Dang tai chi tiet yeu cau...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p>{error}</p>
        <div className={styles.actions}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            Quay lai
          </button>
        </div>
        <ToastContainer />
      </div>
    );
  }

  if (!request) {
    return <div className={styles.container}>Khong co du lieu yeu cau.</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Chi tiet yeu cau nhan mau #{request.id}</h2>

      <div className={styles.detailGrid}>
        <div className={styles.detailItem}>
          <strong>Nguoi tao:</strong> <span>{request.createrName || 'Chua cap nhat'}</span>
        </div>
        <div className={styles.detailItem}>
          <strong>Nguoi nhan:</strong> <span>{request.recipientName || 'Chua cap nhat'}</span>
        </div>
        <div className={styles.detailItem}>
          <strong>So dien thoai:</strong> <span>{request.recipientPhone || 'Chua cap nhat'}</span>
        </div>
        <div className={styles.detailItem}>
          <strong>Dia chi:</strong> <span>{request.address || 'Chua cap nhat'}</span>
        </div>
        <div className={styles.detailItem}>
          <strong>Mo ta:</strong> <span>{request.description || 'Chua cap nhat'}</span>
        </div>
        <div className={styles.detailItem}>
          <strong>Thoi gian tao:</strong> <span>{formatDateTime(request.requestedAt)}</span>
        </div>
        <div className={styles.detailItem}>
          <strong>Trang thai:</strong>
          <span className={`${styles.statusBadge} ${styles[request.status?.toLowerCase()]}`}>
            {statusLabelMap[request.status] || request.status || 'N/A'}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          Quay lai
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default TransfusionRequestDetail;
