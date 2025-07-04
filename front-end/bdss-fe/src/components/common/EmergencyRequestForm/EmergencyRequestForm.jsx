import React, { useState } from "react";
import axios from "axios";
import styles from "./EmergencyRequestForm.module.css";

const EmergencyRequestForm = () => {
  const FIXED_BLOOD_TYPES = [
    { id: 1, type: "Unknow", rhFactor: " " },
    { id: 2, type: "A", rhFactor: "+" },
    { id: 3, type: "A", rhFactor: "-" },
    { id: 4, type: "B", rhFactor: "+" },
    { id: 5, type: "B", rhFactor: "-" },
    { id: 6, type: "AB", rhFactor: "+" },
    { id: 7, type: "AB", rhFactor: "-" },
    { id: 8, type: "O", rhFactor: "+" },
    { id: 9, type: "O", rhFactor: "-" },
  ];

  const FIXED_BLOOD_COMPONENTS = [
    { id: 1, name: "Unknow" },
    { id: 2, name: "Toàn phần" },
    { id: 3, name: "Huyết tương" },
    { id: 4, name: "Hồng cầu" },
    { id: 5, name: "Tiểu cầu" },
    { id: 6, name: "Bạch cầu" },
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    cccd: "",
    bloodTypeId: FIXED_BLOOD_TYPES[0].id,
    bloodComponentId: FIXED_BLOOD_COMPONENTS[0].id,
    quantity: "",
    location: "",
    emergencyProof: "",
    proofImage: null,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    // Validate Full Name
    if (!formData.fullName.trim()) {
      tempErrors.fullName = "Họ tên không được để trống.";
      isValid = false;
    }

    // Validate Phone
    if (!formData.phone.trim()) {
      tempErrors.phone = "Số điện thoại không được để trống.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = "Số điện thoại phải có 10 chữ số.";
      isValid = false;
    }

    // Validate CCCD
    if (!formData.cccd.trim()) {
      tempErrors.cccd = "CCCD không được để trống.";
      isValid = false;
    } else if (!/^\d{12}$/.test(formData.cccd)) {
      tempErrors.cccd = "CCCD phải có 12 chữ số.";
      isValid = false;
    }

    // Validate Blood Type ID
    if (!formData.bloodTypeId) {
      // Kiểm tra nếu người dùng vô tình chọn trống
      tempErrors.bloodTypeId = "Vui lòng chọn nhóm máu.";
      isValid = false;
    }

    // Validate Blood Component ID
    if (!formData.bloodComponentId) {
      // Kiểm tra nếu người dùng vô tình chọn trống
      tempErrors.bloodComponentId = "Vui lòng chọn thành phần máu.";
      isValid = false;
    }

    // Validate Quantity
    if (formData.quantity !== "") {
      // Nếu có nhập giá trị
      const quantityValue = parseInt(formData.quantity);
      if (isNaN(quantityValue) || quantityValue < 250) {
        tempErrors.quantity = "Số lượng máu phải là số và ít nhất 250 ml.";
        isValid = false;
      }
    }

    // Validate Location
    if (!formData.location.trim()) {
      tempErrors.location = "Địa điểm cần máu không được để trống.";
      isValid = false;
    }

    // Validate Emergency Proof
    if (!formData.emergencyProof.trim()) {
      tempErrors.emergencyProof = "Lý do khẩn cấp không được để trống.";
      isValid = false;
    }

    // Validate Proof Image (assuming it's required)
    if (!formData.proofImage) {
      tempErrors.proofImage = "Vui lòng tải lên ảnh minh chứng.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: files ? files[0] : value,
      };

      
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name]; 
        return newErrors;
      });

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      // Gọi hàm validate trước khi gửi form
      console.error("Form validation failed", errors);
      alert("Vui lòng kiểm tra lại thông tin đã nhập.");
      return;
    }

    const data = new FormData();

    for (const key in formData) {
      if (key === "quantity") {
        if (formData[key] !== "") {
          data.append(key, parseInt(formData[key]));
        }
        // Nếu rỗng, không append vào FormData
      } else if (key === "bloodTypeId" || key === "bloodComponentId") {
        data.append(key, parseInt(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/emergency-requests",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Yêu cầu khẩn cấp đã được gửi:", response.data);
      alert("Yêu cầu khẩn cấp đã được gửi thành công!");
      // Reset form sau khi gửi thành công
      setFormData({
        fullName: "",
        phone: "",
        cccd: "",
        bloodTypeId: FIXED_BLOOD_TYPES[0].id,
        bloodComponentId: FIXED_BLOOD_COMPONENTS[0].id,
        quantity: "",
        location: "",
        emergencyProof: "",
        proofImage: null,
      });
      setErrors({}); 
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu khẩn cấp:", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Phiếu Yêu Cầu Máu Khẩn Cấp</h2>
      <form onSubmit={handleSubmit} className={styles.emergencyForm}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName" className={styles.label}>
            Họ tên người cần máu:
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={styles.input}
            placeholder="Ví dụ: Nguyễn Văn A"
            required
          />
          {errors.fullName && (
            <span className={styles.errorText}>{errors.fullName}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>
            Số điện thoại:
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
            pattern="[0-9]{10}"
            title="Số điện thoại phải có 10 chữ số"
            placeholder="Ví dụ: 0912345678"
            required
          />
          {errors.phone && (
            <span className={styles.errorText}>{errors.phone}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cccd" className={styles.label}>
            CCCD:
          </label>
          <input
            type="text"
            id="cccd"
            name="cccd"
            value={formData.cccd}
            onChange={handleChange}
            className={styles.input}
            pattern="[0-9]{12}"
            title="CCCD phải có 12 chữ số"
            placeholder="Ví dụ: 012345678912"
            required
          />
          {errors.cccd && (
            <span className={styles.errorText}>{errors.cccd}</span>
          )}
        </div>

        {/* Dropdown cho Loại máu (cố định) */}
        <div className={styles.formGroup}>
          <label htmlFor="bloodTypeId" className={styles.label}>
            Nhóm máu:
          </label>
          <select
            id="bloodTypeId"
            name="bloodTypeId"
            value={formData.bloodTypeId}
            onChange={handleChange}
            className={styles.input}
            required
          >
            {FIXED_BLOOD_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.type} {type.rhFactor}
              </option>
            ))}
          </select>
          {errors.bloodTypeId && (
            <span className={styles.errorText}>{errors.bloodTypeId}</span>
          )}
        </div>

        {/* Dropdown cho Thành phần máu (cố định) */}
        <div className={styles.formGroup}>
          <label htmlFor="bloodComponentId" className={styles.label}>
            Thành phần máu:
          </label>
          <select
            id="bloodComponentId"
            name="bloodComponentId"
            value={formData.bloodComponentId}
            onChange={handleChange}
            className={styles.input}
            required
          >
            {FIXED_BLOOD_COMPONENTS.map((component) => (
              <option key={component.id} value={component.id}>
                {component.name}
              </option>
            ))}
          </select>
          {errors.bloodComponentId && (
            <span className={styles.errorText}>{errors.bloodComponentId}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="quantity" className={styles.label}>
            Số lượng máu cần (ml):
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.quantity ? styles.inputError : ""
            }`}
            placeholder="Ví dụ: 350 (có thể bỏ qua nếu không )"
          />
          {errors.quantity && (
            <span className={styles.errorText}>{errors.quantity}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location" className={styles.label}>
            Địa điểm cần máu:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={styles.input}
            placeholder="Ví dụ: Bệnh viện Chợ Rẫy, Thành phố Hồ Chí Minh"
            required
          />
          {errors.location && (
            <span className={styles.errorText}>{errors.location}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="emergencyProof" className={styles.label}>
            Lý do khẩn cấp:
          </label>
          <textarea
            id="emergencyProof"
            name="emergencyProof"
            value={formData.emergencyProof}
            onChange={handleChange}
            className={styles.textarea}
            rows="4"
            placeholder="Ví dụ: Tai nạn giao thông cấp cứu, cần truyền máu gấp."
            required
          ></textarea>
          {errors.emergencyProof && (
            <span className={styles.errorText}>{errors.emergencyProof}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="proofImage" className={styles.label}>
            Ảnh minh chứng khẩn cấp:
          </label>
          <div className={styles.fileInputWrapper}>
            <input
              type="file"
              id="proofImage"
              name="proofImage"
              accept="image/*"
              onChange={handleChange}
              className={styles.fileInput}
              required
            />
          </div>
          {errors.proofImage && (
            <span className={styles.errorText}>{errors.proofImage}</span>
          )}
        </div>

        <button type="submit" className={styles.submitButton}>
          Gửi Yêu Cầu
        </button>
      </form>
    </div>
  );
};

export default EmergencyRequestForm;
