import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../configs/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './TransfusionRequestDetail.module.css';

const StatusRequest = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
};

const Status = {
  ACTIVE: "ACTIVE",
  DELETED: "DELETED",
};

const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch (e) {
    return "Ngày không hợp lệ";
  }
};

const getUserRole = () => {
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      const userObj = JSON.parse(userString);
      return Array.isArray(userObj.role) ? userObj.role[0].replace('ROLE_', '') : userObj.role;
    } catch {
      return null;
    }
  }
  return null;
};

const TransfusionRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setUserRole(getUserRole());
  }, []);

  const fetchRequestDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/transfusion-requests/${id}`);
      setRequest(response.data);
    } catch (err) {
      toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
      setError("Không thể tải chi tiết yêu cầu.");
      if (err.response?.status === 403) navigate('/unauthorized');
      else if (err.response?.status === 404) navigate('/not-found');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) fetchRequestDetail();
    else {
      setError("Không tìm thấy ID yêu cầu.");
      setLoading(false);
    }
  }, [id, fetchRequestDetail]);

  const handleStatusAction = async (actionType) => {
    const apiMap = {
      approve: { message: "Duyệt", url: `/transfusion-requests/${request.id}/approve` },
      reject: { message: "Từ chối", url: `/transfusion-requests/${request.id}/reject` },
    };

    const { message, url } = apiMap[actionType] || {};
    if (!url) return;

    if (!window.confirm(`Bạn có chắc chắn muốn ${message.toUpperCase()} yêu cầu này không?`)) return;

    setLoading(true);
    try {
      await axiosInstance.put(url);
      toast.success(`${message} thành công!`);
      fetchRequestDetail();
    } catch (err) {
      toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.container}>Đang tải chi tiết yêu cầu...</div>;
  if (error) return <div className={styles.container}><p>{error}</p><button onClick={() => navigate(-1)}>Quay lại</button></div>;
  if (!request) return <div className={styles.container}><p>Không có dữ liệu.</p></div>;

  const canApproveOrReject = (userRole === 'STAFF' || userRole === 'ADMIN') && request.statusRequest === StatusRequest.PENDING;

  return (
    <div className={styles.container}>
      <h2>Chi Tiết Yêu Cầu Truyền Máu #{request.id}</h2>
      <div className={styles.detailGrid}>
        <div className={styles.detailItem}><strong>ID Người Nhận:</strong> <span>{request.recipientId}</span></div>
        <div className={styles.detailItem}><strong>Thành phần máu cần:</strong> <span>{request.bloodComponentNeeded}</span></div>
        <div className={styles.detailItem}><strong>Lượng cần (ml):</strong> <span>{request.quantityNeeded}</span></div>
        <div className={styles.detailItem}><strong>Chẩn đoán:</strong> <span>{request.doctorDiagnosis || "Chưa có"}</span></div>
        <div className={styles.detailItem}><strong>Ghi chú tiền kiểm:</strong> <span>{request.preCheckNotes || "Chưa có"}</span></div>
        <div className={styles.detailItem}><strong>Địa chỉ:</strong> <span>{request.address || "Chưa có"}</span></div>
        <div className={styles.detailItem}>
          <strong>Trạng thái yêu cầu:</strong>
          <span className={`${styles.statusBadge} ${styles[request.statusRequest?.toLowerCase()]}`}>
            {request.statusRequest === StatusRequest.PENDING ? "Đang chờ"
              : request.statusRequest === StatusRequest.APPROVED ? "Đã duyệt"
              : request.statusRequest === StatusRequest.REJECTED ? "Đã từ chối"
              : request.statusRequest === StatusRequest.CANCELLED ? "Đã hủy"
              : request.statusRequest || "N/A"}
          </span>
        </div>
        <div className={styles.detailItem}>
          <strong>Trạng thái hệ thống:</strong>
          <span className={`${styles.statusBadge} ${styles[request.status?.toLowerCase()]}`}>
            {request.status === Status.ACTIVE ? "Hoạt động" : "Đã xóa"}
          </span>
        </div>
        <div className={styles.detailItem}><strong>Yêu cầu lúc:</strong> <span>{formatDateTime(request.requestedAt)}</span></div>
        <div className={styles.detailItem}><strong>Duyệt lúc:</strong> <span>{formatDateTime(request.approvedAt)}</span></div>
      </div>

      <div className={styles.actions}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>Quay lại</button>

        {canApproveOrReject && (
          <>
            <button className={styles.approveButton} onClick={() => handleStatusAction('approve')}>Duyệt yêu cầu</button>
            <button className={styles.rejectButton} onClick={() => handleStatusAction('reject')}>Từ chối yêu cầu</button>
          </>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default TransfusionRequestDetail;
