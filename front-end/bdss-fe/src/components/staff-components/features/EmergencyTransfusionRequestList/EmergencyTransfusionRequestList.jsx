import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import styles from "./EmergencyTransfusionRequestList.module.css";

const EmergencyRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // State cho Modal hiển thị ảnh
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [currentRequestDetails, setCurrentRequestDetails] = useState(null);

  // State cho Modal Duyệt/Từ chối
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false); // true = Duyệt, false = Từ chối
  const [staffNote, setStaffNote] = useState('');
  const [decisionError, setDecisionError] = useState(null); // Lỗi khi gửi quyết định

  useEffect(() => {
    const fetchEmergencyRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/emergency-requests", {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        setRequests(response.data);
      } catch (err) {
        console.error("Error fetching emergency requests:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            setError("Phiên đăng nhập hết hạn hoặc không có quyền. Vui lòng đăng nhập lại.");
            toast.error("Phiên đăng nhập hết hạn hoặc không có quyền. Vui lòng đăng nhập lại."); // Toast notification
            // window.location.href = '/login'; // Có thể uncomment để chuyển hướng
        } else {
            setError("Không thể tải danh sách yêu cầu khẩn cấp. Vui lòng thử lại.");
            toast.error("Không thể tải danh sách yêu cầu khẩn cấp. Vui lòng thử lại."); // Toast notification
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyRequests();
  }, [token]);

  const handleViewProof = (imageUrl, requestDetails) => {
    setCurrentImageUrl(imageUrl);
    setCurrentRequestDetails(requestDetails);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setCurrentImageUrl('');
    setCurrentRequestDetails(null);
  };

  // Mở modal quyết định
  const openDecisionModal = (requestId, accept) => {
    setCurrentRequestId(requestId);
    setIsAccepting(accept);
    setStaffNote(''); // Reset note khi mở modal
    setDecisionError(null); // Reset lỗi
    setShowDecisionModal(true);
  };

  // Đóng modal quyết định
  const closeDecisionModal = () => {
    setShowDecisionModal(false);
    setCurrentRequestId(null);
    setIsAccepting(false);
    setStaffNote('');
    setDecisionError(null);
  };

  // Gửi yêu cầu cập nhật trạng thái
  const handleUpdateStatus = async () => {
    setDecisionError(null);
    // Logic kiểm tra ghi chú:
    // Nếu là từ chối VÀ ghi chú rỗng -> lỗi
    // Nếu là duyệt VÀ ghi chú rỗng -> không lỗi (ghi chú là tùy chọn cho duyệt)
    // Nếu là duyệt VÀ ghi chú có nội dung -> không lỗi
    if (!isAccepting && !staffNote.trim()) { // Nếu từ chối mà không có ghi chú
        setDecisionError("Vui lòng nhập lý do từ chối.");
        return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/emergency-requests/${currentRequestId}`,
        null, // PUT với @RequestParam không cần body
        {
          params: {
            accept: isAccepting,
            note: staffNote // Luôn gửi note, dù rỗng hay có giá trị
          },
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }
      );
      toast.success(`Yêu cầu đã được ${isAccepting ? 'duyệt' : 'từ chối'} thành công!`); // Toast notification
      closeDecisionModal();
      // Sau khi cập nhật thành công, fetch lại danh sách để cập nhật UI
      setLoading(true); // Đặt lại loading để hiển thị trạng thái tải
      const response = await axios.get("http://localhost:8080/api/emergency-requests", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRequests(response.data);
      setLoading(false);

    } catch (err) {
      console.error("Lỗi khi cập nhật yêu cầu:", err);
      if (err.response && err.response.data && err.response.data.message) {
          setDecisionError(err.response.data.message); // Hiển thị lỗi từ BE
          toast.error(err.response.data.message); // Toast notification for BE errors
      } else {
          setDecisionError("Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.");
          toast.error("Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại."); // Generic toast for other errors
      }
    }
  };


  if (loading) {
    return <div className={styles.loading}>Đang tải danh sách yêu cầu...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.listContainer}>
      <h2 className={styles.listTitle}>Danh Sách Yêu Cầu Máu Khẩn Cấp</h2>
      {requests.length === 0 ? (
        <p className={styles.noRequests}>Không có yêu cầu khẩn cấp nào.</p>
      ) : (
        <table className={styles.requestTable}>
          <thead>
            <tr>
              <th>Họ Tên</th>
              <th>SĐT</th>
              <th>CCCD</th>
              <th>Nhóm Máu </th>
              <th>Thành Phần Máu </th>
              <th>Số Lượng (ml)</th>
              <th>Địa Điểm</th>
              <th>Minh Chứng</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.cccd + request.location + request.bloodTypeId}>
                <td>{request.fullName}</td>
                <td>{request.phone}</td>
                <td>{request.cccd}</td>
                <td>{request.bloodT}</td>
                <td>{request.bloodC}</td>
                <td>{request.quantity || "N/A"}</td>
                <td>{request.location}</td>
                <td>
                  {request.emergencyProof ? (
                    <button
                      className={styles.viewProofButton}
                      onClick={() => handleViewProof(request.emergencyProof, request)}
                    >
                      Xem Ảnh
                    </button>
                  ) : (
                    "Không có"
                  )}
                </td>
                <td>
                  {request.statusRequest === "PENDING" ? (
                    <>
                      <button
                        className={`${styles.actionButton} ${styles.approveButton}`}
                        onClick={() => openDecisionModal(request.id, true)}
                      >
                        Duyệt
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.rejectButton}`}
                        onClick={() => openDecisionModal(request.id, false)}
                      >
                        Từ chối
                      </button>
                    </>
                  ) : (
                    <span className={styles.statusText}>
                        {request.statusRequest === "APPROVED" ? "Đã duyệt" : "Đã từ chối"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal hiển thị ảnh */}
      {showImageModal && (
        <div className={styles.modalOverlay} onClick={handleCloseImageModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalButton} onClick={handleCloseImageModal}>
              &times;
            </button>
            {currentRequestDetails && (
                <div className={styles.modalHeader}>
                    <h3>Minh chứng của: {currentRequestDetails.fullName}</h3>
                    {currentRequestDetails.emergencyProofText && <p>Lý do: {currentRequestDetails.emergencyProofText}</p>}
                </div>
            )}
            {currentImageUrl ? (
                <img src={`data:image/jpeg;base64,${currentImageUrl}`} alt="Minh chứng khẩn cấp" className={styles.modalImage} />
            ) : (
                <p>Không tìm thấy ảnh.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal Duyệt/Từ chối */}
      {showDecisionModal && (
        <div className={styles.modalOverlay} onClick={closeDecisionModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalButton} onClick={closeDecisionModal}>
              &times;
            </button>
            <h3>{isAccepting ? "Xác nhận duyệt yêu cầu" : "Xác nhận từ chối yêu cầu"}</h3>
            {/* Trường ghi chú hiển thị cho cả duyệt và từ chối */}
            <div className={styles.formGroup}>
                <label htmlFor="staffNote" className={styles.label}>
                    Ghi chú của nhân viên: {isAccepting ? "(tùy chọn)" : "(bắt buộc khi từ chối)"}
                </label>
                <textarea
                    id="staffNote"
                    className={styles.textarea}
                    rows="4"
                    value={staffNote}
                    onChange={(e) => setStaffNote(e.target.value)}
                    placeholder={isAccepting ? "Nhập ghi chú (nếu có)" : "Nhập lý do từ chối (bắt buộc)"}
                ></textarea>
                {decisionError && <p className={styles.errorText}>{decisionError}</p>}
            </div>

            <div className={styles.modalActions}>
              <button
                className={`${styles.actionButton} ${styles.confirmButton}`}
                onClick={handleUpdateStatus}
              >
                {isAccepting ? "Xác nhận Duyệt" : "Xác nhận Từ chối"}
              </button>
              <button
                className={`${styles.actionButton} ${styles.cancelButton}`}
                onClick={closeDecisionModal}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer /> {/* Add ToastContainer here */}
    </div>
  );
};

export default EmergencyRequestList;