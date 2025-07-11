import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import styles from "./SearchMatchBlood.module.css"; // Đảm bảo file CSS của bạn có tên là index.module.css

const CompatibilityChecker = () => {
  // ==========================================================
  // Dữ liệu cứng (hardcoded data) cho Blood Types và Blood Components
  // Đảm bảo `id` ở đây khớp với `id` trong database của bạn
  // ==========================================================
  const staticBloodTypes = [
    // { id: 1, groupName: "Uknow", rhFactor: "" },
    { id: 2, groupName: "A", rhFactor: "+" },
    { id: 3, groupName: "A", rhFactor: "-" },
    { id: 4, groupName: "B", rhFactor: "+" },
    { id: 5, groupName: "B", rhFactor: "-" },
    { id: 6, groupName: "AB", rhFactor: "+" },
    { id: 7, groupName: "AB", rhFactor: "-" },
    { id: 8, groupName: "O", rhFactor: "+" },
    { id: 9, groupName: "O", rhFactor: "-" },
  ];

  const staticBloodComponents = [
    // { id: 1, name: "Unknow" },
    { id: 2, name: "Toàn phần" },
    { id: 3, name: "Huyết tương" },
    { id: 4, name: "Hồng cầu" },
    { id: 5, name: "Tiểu cầu" },
    { id: 6, name: "Bạch cầu" },
  ];
  // ==========================================================

  const [bloodTypes, setBloodTypes] = useState([]);
  const [bloodComponents, setBloodComponents] = useState([]);

  // Sử dụng chuỗi rỗng để không có giá trị nào được chọn ban đầu,
  // hoặc có thể đặt ID mặc định nếu muốn
  const [selectedDonorBloodTypeId, setSelectedDonorBloodTypeId] = useState("");
  const [selectedRecipientBloodTypeId, setSelectedRecipientBloodTypeId] = useState("");
  const [selectedComponentId, setSelectedComponentId] = useState("");
  const navigate = useNavigate();

  const [compatibilityResult, setCompatibilityResult] = useState(null); // Lưu trữ kết quả từ API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================================
  // Thiết lập dữ liệu cứng khi component mount
  // ==========================================================
  useEffect(() => {
    setBloodTypes(staticBloodTypes);
    setBloodComponents(staticBloodComponents);

    // Thiết lập giá trị mặc định cho dropdowns sau khi dữ liệu đã được set
    // Có thể bỏ qua nếu muốn người dùng phải chọn thủ công
    if (staticBloodTypes.length > 0) {
      // Chọn ID đầu tiên của nhóm máu (ví dụ: Uknow)
      setSelectedDonorBloodTypeId(staticBloodTypes[0].id.toString());
      setSelectedRecipientBloodTypeId(staticBloodTypes[0].id.toString());
    }
    if (staticBloodComponents.length > 0) {
      // Chọn ID đầu tiên của thành phần máu (ví dụ: Unknow)
      setSelectedComponentId(staticBloodComponents[0].id.toString());
    }
  }, []); // Chạy một lần khi component mount

  // ==========================================================
  // Hàm xử lý kiểm tra tương thích
  // ==========================================================
  const handleCheckCompatibility = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    setLoading(true);
    setError(null);
    setCompatibilityResult(null); // Xóa kết quả cũ trước khi kiểm tra mới

    // Kiểm tra xem người dùng đã chọn đầy đủ các giá trị chưa
    if (!selectedDonorBloodTypeId || !selectedRecipientBloodTypeId || !selectedComponentId) {
      toast.warn(
        "Vui lòng chọn đầy đủ Nhóm máu người cho, Nhóm máu người nhận và Thành phần máu."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8080/compatibility-rule/check-compatibility",
        {
          params: {
            // Chuyển đổi giá trị string từ select thành Number cho API
            donorBloodTypeId: Number(selectedDonorBloodTypeId),
            recipientBloodTypeId: Number(selectedRecipientBloodTypeId),
            componentId: Number(selectedComponentId),
          },
          // headers: { /* Endpoint này là public, nên không cần token */ }
        }
      );

      // Log kết quả nhận được từ API để debug
      console.log("Kết quả API nhận được:", response.data);
      console.log("isCompatible:", response.data.isCompatible);

      if (response.status === 200 && response.data) {
        setCompatibilityResult(response.data);
        toast.success("Kiểm tra tương thích thành công!");
      } else {
        // Trường hợp response không có data hoặc status không phải 200 nhưng không ném lỗi
        toast.warn("Không tìm thấy quy tắc tương thích cho lựa chọn này.");
        setCompatibilityResult(null);
      }
    } catch (err) {
      console.error("Lỗi khi kiểm tra tương thích:", err);
      setError("Không thể kiểm tra tương thích. Vui lòng thử lại.");
      setCompatibilityResult(null); // Đảm bảo kết quả rỗng khi có lỗi

      if (err.response) {
        // Lỗi từ server (có phản hồi HTTP status code)
        if (err.response.status === 404) {
          toast.info("Không tìm thấy quy tắc tương thích cho lựa chọn này.");
          setError("Quy tắc không tìm thấy.");
        } else if (err.response.status === 400) {
          toast.error("Yêu cầu không hợp lệ. Vui lòng kiểm tra lại lựa chọn.");
          setError("Yêu cầu không hợp lệ.");
        } else {
          toast.error(
            `Đã xảy ra lỗi server: ${err.response.data?.message || err.message}`
          );
          setError(`Lỗi server: ${err.response.status}`);
        }
      } else if (err.request) {
        // Lỗi không có phản hồi từ server (ví dụ: mất mạng, server down)
        toast.error(
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn."
        );
        setError("Lỗi kết nối.");
      } else {
        // Lỗi không xác định khác
        toast.error("Đã xảy ra lỗi không xác định.");
        setError("Lỗi không xác định.");
      }
    } finally {
      setLoading(false); // Luôn tắt trạng thái loading
    }
  };

  // Hàm tạo chuỗi hiển thị cho BloodType (ví dụ: "A+", "O-")
  const getBloodTypeName = (bloodType) => {
    if (!bloodType) return "";
    // Xử lý trường hợp "Uknow" (thay vì UNKNOWNUNKNOWN)
    if (bloodType.groupName === "Uknow" && bloodType.rhFactor === "") {
      return "Không xác định";
    }
    return `${bloodType.groupName}${bloodType.rhFactor}`;
  };

  const handleGoBack = () => {
        navigate(-1);
    };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Kiểm Tra Tương Thích Nhóm Máu</h2>
      <p className={styles.introText}>
        Chọn nhóm máu người cho, nhóm máu người nhận và thành phần máu để kiểm
        tra khả năng tương thích.
      </p>

      <form onSubmit={handleCheckCompatibility} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="donorBloodType" className={styles.label}>
            Nhóm máu người cho:
          </label>
          <select
            id="donorBloodType"
            className={styles.selectField}
            value={selectedDonorBloodTypeId}
            onChange={(e) => setSelectedDonorBloodTypeId(e.target.value)}
            disabled={loading} // Disabled khi đang loading
          >
            {/* <option value="">-- Chọn nhóm máu --</option> */}
            {bloodTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {getBloodTypeName(type)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="recipientBloodType" className={styles.label}>
            Nhóm máu người nhận:
          </label>
          <select
            id="recipientBloodType"
            className={styles.selectField}
            value={selectedRecipientBloodTypeId}
            onChange={(e) => setSelectedRecipientBloodTypeId(e.target.value)}
            disabled={loading}
          >
            {/* <option value="">-- Chọn nhóm máu --</option> */}
            {bloodTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {getBloodTypeName(type)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="component" className={styles.label}>
            Thành phần máu:
          </label>
          <select
            id="component"
            className={styles.selectField}
            value={selectedComponentId}
            onChange={(e) => setSelectedComponentId(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Chọn thành phần --</option>
            {bloodComponents.map((component) => (
              <option key={component.id} value={component.id}>
                {component.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.checkButton} disabled={loading}>
          {loading ? "Đang kiểm tra..." : "Kiểm tra tương thích"}
        </button>

        <div className={styles.actionButtons}>
                                <button className={styles.backButton} onClick={handleGoBack}>
                                    Quay lại
                                </button>
                            </div>
      </form>

      {/* Hiển thị lỗi nếu có */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Hiển thị kết quả tương thích nếu có */}
      {compatibilityResult && (
        <div
          className={`${styles.resultCard} ${
            // SỬA ĐỔI: Sử dụng so sánh nghiêm ngặt `=== true` để khắc phục lỗi hiển thị
            // dù API trả về `true` vẫn hiển thị "Không tương thích".
            compatibilityResult.compatible === true
              ? styles.compatible
              : styles.incompatible
          }`}
        >
          <h3>Kết quả tương thích:</h3>
          <p>
            <strong>Khả năng tương thích:</strong>{" "}
            <span
              className={
                // SỬA ĐỔI: Tương tự, sử dụng so sánh nghiêm ngặt `=== true`
                compatibilityResult.compatible === true
                  ? styles.compatibleText
                  : styles.incompatibleText
              }
            >
              {compatibilityResult.compatible === true
                ? "Tương thích"
                : "Không tương thích"}
            </span>
          </p>
          {compatibilityResult.explanation && (
            <p>
              <strong>Giải thích:</strong> {compatibilityResult.explanation}
            </p>
          )}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default CompatibilityChecker;