import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import styles from "./SearchMatchBlood.module.css";

const BLOOD_TYPES = [
  { id: 2, groupName: "A", rhFactor: "+" },
  { id: 3, groupName: "A", rhFactor: "-" },
  { id: 4, groupName: "B", rhFactor: "+" },
  { id: 5, groupName: "B", rhFactor: "-" },
  { id: 6, groupName: "AB", rhFactor: "+" },
  { id: 7, groupName: "AB", rhFactor: "-" },
  { id: 8, groupName: "O", rhFactor: "+" },
  { id: 9, groupName: "O", rhFactor: "-" },
];

const BLOOD_COMPONENTS = [
  { id: 2, name: "Toan phan" },
  { id: 3, name: "Huyet tuong" },
  { id: 4, name: "Hong cau" },
  { id: 5, name: "Tieu cau" },
  { id: 6, name: "Bach cau" },
];

const CompatibilityChecker = () => {
  const navigate = useNavigate();
  const [selectedDonorBloodTypeId, setSelectedDonorBloodTypeId] = useState(
    BLOOD_TYPES[0]?.id.toString() ?? ""
  );
  const [selectedRecipientBloodTypeId, setSelectedRecipientBloodTypeId] = useState(
    BLOOD_TYPES[0]?.id.toString() ?? ""
  );
  const [selectedComponentId, setSelectedComponentId] = useState(
    BLOOD_COMPONENTS[0]?.id.toString() ?? ""
  );
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getBloodTypeName = (bloodType) => {
    if (!bloodType) {
      return "";
    }
    return `${bloodType.groupName}${bloodType.rhFactor}`;
  };

  const handleCheckCompatibility = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setCompatibilityResult(null);

    if (!selectedDonorBloodTypeId || !selectedRecipientBloodTypeId || !selectedComponentId) {
      toast.warn("Vui long chon day du nhom mau va thanh phan mau.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8080/compatibility-rule/check-compatibility",
        {
          params: {
            donorBloodTypeId: Number(selectedDonorBloodTypeId),
            recipientBloodTypeId: Number(selectedRecipientBloodTypeId),
            componentId: Number(selectedComponentId),
          },
        }
      );

      if (response.status === 200 && response.data) {
        setCompatibilityResult(response.data);
        toast.success("Kiem tra tuong thich thanh cong.");
      } else {
        toast.warn("Khong tim thay quy tac tuong thich cho lua chon nay.");
      }
    } catch (requestError) {
      console.error("Compatibility check error:", requestError);
      setCompatibilityResult(null);

      if (requestError.response?.status === 404) {
        setError("Khong tim thay quy tac tuong thich.");
        toast.info("Khong tim thay quy tac tuong thich cho lua chon nay.");
      } else if (requestError.response?.status === 400) {
        setError("Yeu cau khong hop le.");
        toast.error("Yeu cau khong hop le. Vui long kiem tra lai lua chon.");
      } else if (requestError.request) {
        setError("Khong the ket noi den may chu.");
        toast.error("Khong the ket noi den may chu.");
      } else {
        setError("Khong the kiem tra tuong thich. Vui long thu lai.");
        toast.error("Khong the kiem tra tuong thich. Vui long thu lai.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Kiem Tra Tuong Thich Nhom Mau</h2>
      <p className={styles.introText}>
        Chon nhom mau nguoi cho, nhom mau nguoi nhan va thanh phan mau de kiem tra.
      </p>

      <form onSubmit={handleCheckCompatibility} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="donorBloodType" className={styles.label}>
            Nhom mau nguoi cho:
          </label>
          <select
            id="donorBloodType"
            className={styles.selectField}
            value={selectedDonorBloodTypeId}
            onChange={(event) => setSelectedDonorBloodTypeId(event.target.value)}
            disabled={loading}
          >
            {BLOOD_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {getBloodTypeName(type)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="recipientBloodType" className={styles.label}>
            Nhom mau nguoi nhan:
          </label>
          <select
            id="recipientBloodType"
            className={styles.selectField}
            value={selectedRecipientBloodTypeId}
            onChange={(event) => setSelectedRecipientBloodTypeId(event.target.value)}
            disabled={loading}
          >
            {BLOOD_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {getBloodTypeName(type)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="component" className={styles.label}>
            Thanh phan mau:
          </label>
          <select
            id="component"
            className={styles.selectField}
            value={selectedComponentId}
            onChange={(event) => setSelectedComponentId(event.target.value)}
            disabled={loading}
          >
            {BLOOD_COMPONENTS.map((component) => (
              <option key={component.id} value={component.id}>
                {component.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.checkButton} disabled={loading}>
          {loading ? "Dang kiem tra..." : "Kiem tra tuong thich"}
        </button>

        <div className={styles.actionButtons}>
          <button type="button" className={styles.backButton} onClick={handleGoBack}>
            Quay lai
          </button>
        </div>
      </form>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {compatibilityResult && (
        <div
          className={`${styles.resultCard} ${
            compatibilityResult.compatible === true ? styles.compatible : styles.incompatible
          }`}
        >
          <h3>Ket qua tuong thich:</h3>
          <p>
            <strong>Trang thai:</strong>{" "}
            <span
              className={
                compatibilityResult.compatible === true
                  ? styles.compatibleText
                  : styles.incompatibleText
              }
            >
              {compatibilityResult.compatible === true ? "Tuong thich" : "Khong tuong thich"}
            </span>
          </p>
          {compatibilityResult.explanation && (
            <p>
              <strong>Giai thich:</strong> {compatibilityResult.explanation}
            </p>
          )}
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default CompatibilityChecker;
