import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../configs/axios";
import styles from "./DonationRequestList.module.css";

const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleString("vi-VN", options);
  } catch (e) {
    console.error("Chuỗi ngày không hợp lệ:", isoString, e);
    return "Ngày không hợp lệ";
  }
};

const DonationRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDonationRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/donation-requests/pending");
      setRequests(response.data);
      console.log("Đã lấy yêu cầu hiến máu ĐANG CHỜ:", response.data);
    } catch (err) {
      console.error("Lỗi khi lấy yêu cầu hiến máu:", err);
      setError(
        "Không thể tải danh sách yêu cầu hiến máu. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn DUYỆT yêu cầu ID ${requestId} này không?`
      )
    ) {
      try {
        const response = await axiosInstance.put(
          `/donation-requests/approved/${requestId}`,
          null,
          {
            params: {
              accept: true,
            },
          }
        );
        console.log("Yêu cầu đã được duyệt:", response.data);

        fetchDonationRequests();
        alert(`Yêu cầu ID ${requestId} đã được duyệt thành công!`);
      } catch (err) {
        console.error("Lỗi khi duyệt yêu cầu:", err);
        const errorMessage =
          err.response?.data?.message ||
          "Có lỗi xảy ra khi duyệt yêu cầu. Vui lòng thử lại.";
        alert(errorMessage);
      }
    }
  };

  const handleRejectRequest = async (requestId) => {
    const note = prompt(
      `Bạn có muốn thêm ghi chú cho việc từ chối yêu cầu ID ${requestId} này không?`
    );
    if (note !== null) {
      if (
        window.confirm(
          `Bạn có chắc chắn muốn TỪ CHỐI yêu cầu ID ${requestId} này không?`
        )
      ) {
        try {
          const response = await axiosInstance.put(
            `/donation-requests/approved/${requestId}`,
            null,
            {
              params: {
                accept: false,
                note: note || "Không có ghi chú",
              },
            }
          );
          console.log("Yêu cầu đã được từ chối:", response.data);

          fetchDonationRequests();
          alert(`Yêu cầu ID ${requestId} đã được từ chối.`);
        } catch (err) {
          console.error("Lỗi khi từ chối yêu cầu:", err);
          const errorMessage =
            err.response?.data?.message ||
            "Có lỗi xảy ra khi từ chối yêu cầu. Vui lòng thử lại.";
          alert(errorMessage);
        }
      }
    }
  };

  useEffect(() => {
    fetchDonationRequests();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingMessage}>Đang tải yêu cầu hiến máu...</div>
    );
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.donationRequestListContainer}>
      <h2 className="text-3xl font-bold mb-8 text-center text-red-700">
        Yêu Cầu Hiến Máu Đang Chờ Duyệt
      </h2>
      <div className={styles.tableWrapper}>
        {requests.length === 0 ? (
          <p className={styles.noRequestsMessage}>
            Không tìm thấy yêu cầu hiến máu nào đang chờ duyệt.
          </p>
        ) : (
          <table className={styles.donationRequestTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Người hiến</th>
                <th>Giới tính</th>
                <th>Nhóm máu</th>
                <th>Tên Sự kiện</th>
                <th>Thời gian yêu cầu</th>
                <th>Trạng thái</th>
                <th>Người duyệt</th>
                <th>Thời gian duyệt</th>
                <th>Ghi chú của người duyệt</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.donorFullName}</td>
                  <td>
                    {request.donorGender === "MALE"
                      ? "Nam"
                      : request.donorGender === "FEMALE"
                      ? "Nữ"
                      : "Khác"}
                  </td>
                  <td>
                    {request.donorBloodType
                      ? `${request.donorBloodType.type}${request.donorBloodType.rhFactor}`
                      : "Chưa rõ"}
                  </td>
                  <td>{request.eventName}</td>
                  <td>{formatDateTime(request.requestTime)}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        styles[request.statusRequest.toLowerCase()]
                      }`}
                    >
                      {request.statusRequest === "PENDING"
                        ? "Đang chờ"
                        : request.statusRequest === "APPROVED"
                        ? "Đã duyệt"
                        : request.statusRequest === "REJECTED"
                        ? "Đã từ chối"
                        : request.statusRequest === "CANCELED"
                        ? "Đã hủy"
                        : request.statusRequest}
                    </span>
                  </td>
                  <td>{request.approverFullName || "Chưa duyệt"}</td>
                  <td>{formatDateTime(request.approvedTime)}</td>
                  <td>{request.note || "Không có"}</td>
                  <td>
                    {request.statusRequest === "PENDING" && (
                      <>
                        <button
                          className={styles.approveButton}
                          onClick={() => handleApproveRequest(request.id)}
                        >
                          Duyệt
                        </button>
                        <button
                          className={styles.cancelButton}
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DonationRequestList;
