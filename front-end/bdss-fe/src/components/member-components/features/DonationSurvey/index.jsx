import React, { useState } from "react";
import axiosInstance from "../../../../configs/axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./index.module.css";

const DonationSurvey = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [surveyData, setSurveyData] = useState({
    isHealthyToday: null,
    hasSymptoms: null,
    hasInfectiousDiseases: null,
    unsafeSex: null,
    recentSurgeryTattoo: null,
    recentVaccination: null,
    onMedication: null,
    hasChronicDisease: null,
    chronicDiseaseNote: "",
    lastDonationDays: "",
    hadReactionPreviousDonation: null,
    previousReactionNote: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSurveyData((prevData) => {
      let newValue = value;
      if (type === "radio") {
        newValue = value === "true" ? true : value === "false" ? false : null;
      } else if (type === "checkbox") {
        newValue = checked;
      }
      return {
        ...prevData,
        [name]: newValue,
      };
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    const booleanFields = [
      "isHealthyToday",
      "hasSymptoms",
      "hasInfectiousDiseases",
      "unsafeSex",
      "recentSurgeryTattoo",
      "recentVaccination",
      "onMedication",
      "hasChronicDisease",
      "hadReactionPreviousDonation",
    ];
    booleanFields.forEach((field) => {
      if (surveyData[field] === null) {
        newErrors[field] = "Vui lòng chọn một lựa chọn.";
        isValid = false;
      }
    });

    const days = surveyData.lastDonationDays.trim();
    if (days !== "") {
      const parsedDays = parseInt(days, 10);
      if (isNaN(parsedDays) || parsedDays < 0) {
        newErrors.lastDonationDays =
          "Vui lòng nhập số ngày hợp lệ (số nguyên không âm).";
        isValid = false;
      }
    }

    if (
      surveyData.hasChronicDisease === true &&
      !surveyData.chronicDiseaseNote.trim()
    ) {
      newErrors.chronicDiseaseNote = "Vui lòng nhập ghi chú bệnh mãn tính.";
      isValid = false;
    }
    if (
      surveyData.hadReactionPreviousDonation === true &&
      !surveyData.previousReactionNote.trim()
    ) {
      newErrors.previousReactionNote =
        "Vui lòng nhập ghi chú phản ứng sau hiến.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ và chính xác tất cả các trường.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        isHealthyToday: surveyData.isHealthyToday,
        hasSymptoms: surveyData.hasSymptoms,
        hasInfectiousDiseases: surveyData.hasInfectiousDiseases,
        unsafeSex: surveyData.unsafeSex,
        recentSurgeryTattoo: surveyData.recentSurgeryTattoo,
        recentVaccination: surveyData.recentVaccination,
        onMedication: surveyData.onMedication,
        hasChronicDisease: surveyData.hasChronicDisease,
        
        chronicDiseaseNote:
          surveyData.hasChronicDisease && surveyData.chronicDiseaseNote.trim()
            ? surveyData.chronicDiseaseNote.trim()
            : null,
        
        lastDonationDays:
          surveyData.lastDonationDays.trim() !== ""
            ? parseInt(surveyData.lastDonationDays, 10)
            : null,
        hadReactionPreviousDonation: surveyData.hadReactionPreviousDonation,
        
        previousReactionNote:
          surveyData.hadReactionPreviousDonation &&
          surveyData.previousReactionNote.trim()
            ? surveyData.previousReactionNote.trim()
            : null,
      };

      await axiosInstance.post(
        `/donation-requests/register/${scheduleId}`,
        payload
      );
      toast.success("Đơn đăng ký hiến máu và khảo sát đã được gửi thành công!");
      
      navigate("/member/my-donation-request");
    } catch (err) {
      console.log("API Error:", err.response);

      let errorMsg = "Không thể gửi khảo sát. Vui lòng thử lại.";
      const backendMessage = err.response?.data;

      if (typeof backendMessage === "string") {
        if (backendMessage.includes("đã đăng ký hiến máu và đang chờ xử lý")) {
          errorMsg = "Bạn đã đăng ký hiến máu và đang chờ xử lý. Vui lòng kiểm tra lại trạng thái đăng ký của bạn.";
        } else if (backendMessage.includes("Bạn cần chờ ít nhất 12 tuần")) {
          errorMsg = "Bạn chưa đủ thời gian nghỉ giữa các lần hiến máu. Vui lòng chờ đủ 12 tuần kể từ lần hiến máu trước.";
        } else if (
          backendMessage.includes("cần chờ ít nhất") &&
          backendMessage.includes("sau khi hiến máu để đăng ký lại")
        ) {
          errorMsg = backendMessage;
        } else if (
          backendMessage.includes("không tìm thấy lịch hiến máu") ||
          backendMessage.includes("không hợp lệ")
        ) {
          errorMsg = "Lịch hiến máu không tồn tại hoặc không hợp lệ. Vui lòng kiểm tra lại URL.";
        } else {
          errorMsg = backendMessage;
        }
      }
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.surveyContainer}>
      <h2 className={styles.pageTitle}>Khảo Sát Sức Khỏe Hiến Máu</h2>
      <p className={styles.description}>
        Vui lòng trả lời trung thực các câu hỏi dưới đây để đảm bảo an toàn cho
        bạn và người nhận máu.
      </p>

      <form onSubmit={handleSubmit} className={styles.surveyForm}>
        <div className={styles.formGroup}>
          <label className={styles.questionLabel}>
            1. Hôm nay bạn có cảm thấy khỏe mạnh không?
          </label>
          <p className={styles.questionNote}>
            Đánh giá tổng thể sức khỏe của bạn vào ngày hiến máu.
          </p>
          <div className={styles.radioGroup}>
            <input
              type="radio"
              id="isHealthyTodayYes"
              name="isHealthyToday"
              value="true"
              checked={surveyData.isHealthyToday === true}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="isHealthyTodayYes" className={styles.radioLabel}>
              Có
            </label>
            <input
              type="radio"
              id="isHealthyTodayNo"
              name="isHealthyToday"
              value="false"
              checked={surveyData.isHealthyToday === false}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="isHealthyTodayNo" className={styles.radioLabel}>
              Không
            </label>
          </div>
          {errors.isHealthyToday && (
            <p className={styles.errorText}>{errors.isHealthyToday}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.questionLabel}>
            2. Bạn có đang có triệu chứng (sốt, ho, tiêu chảy...) không?
          </label>
          <p className={styles.questionNote}>
            Bao gồm các triệu chứng cảm lạnh, cúm, đau họng, buồn nôn, nôn mửa,
            tiêu chảy.
          </p>
          <div className={styles.radioGroup}>
            <input
              type="radio"
              id="hasSymptomsNo"
              name="hasSymptoms"
              value="false"
              checked={surveyData.hasSymptoms === false}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="hasSymptomsNo" className={styles.radioLabel}>
              Không
            </label>
            <input
              type="radio"
              id="hasSymptomsYes"
              name="hasSymptoms"
              value="true"
              checked={surveyData.hasSymptoms === true}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="hasSymptomsYes" className={styles.radioLabel}>
              Có
            </label>
          </div>
          {errors.hasSymptoms && (
            <p className={styles.errorText}>{errors.hasSymptoms}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.questionLabel}>
            3. Bạn có từng mắc bệnh truyền nhiễm (VD: Viêm gan B, HIV...) không?
          </label>
          <p className={styles.questionNote}>
            Tiền sử mắc các bệnh như viêm gan, HIV, sốt rét, giang mai, lao
            phổi, v.v.
          </p>
          <div className={styles.radioGroup}>
            <input
              type="radio"
              id="hasInfectiousDiseasesNo"
              name="hasInfectiousDiseases"
              value="false"
              checked={surveyData.hasInfectiousDiseases === false}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label
              htmlFor="hasInfectiousDiseasesNo"
              className={styles.radioLabel}
            >
              Không
            </label>
            <input
              type="radio"
              id="hasInfectiousDiseasesYes"
              name="hasInfectiousDiseases"
              value="true"
              checked={surveyData.hasInfectiousDiseases === true}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label
              htmlFor="hasInfectiousDiseasesYes"
              className={styles.radioLabel}
            >
              Có
            </label>
          </div>
          {errors.hasInfectiousDiseases && (
            <p className={styles.errorText}>{errors.hasInfectiousDiseases}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.questionLabel}>
            4. Bạn có quan hệ không an toàn (nhiều bạn tình, quan hệ đồng
            giới...) trong vòng 6 tháng gần đây không?
          </label>
          <p className={styles.questionNote}>
            Để đảm bảo an toàn cho máu hiến, xin hãy trung thực trả lời.
          </p>
          <div className={styles.radioGroup}>
            <input
              type="radio"
              id="unsafeSexNo"
              name="unsafeSex"
              value="false"
              checked={surveyData.unsafeSex === false}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="unsafeSexNo" className={styles.radioLabel}>
              Không
            </label>
            <input
              type="radio"
              id="unsafeSexYes"
              name="unsafeSex"
              value="true"
              checked={surveyData.unsafeSex === true}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="unsafeSexYes" className={styles.radioLabel}>
              Có
            </label>
          </div>
          {errors.unsafeSex && (
            <p className={styles.errorText}>{errors.unsafeSex}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.questionLabel}>
            5. Bạn có phẫu thuật hoặc xăm, xỏ khuyên trong vòng 6 tháng gần đây
            không?
          </label>
          <p className={styles.questionNote}>
            Bao gồm cả các thủ thuật y tế hoặc thẩm mỹ có xâm lấn.
          </p>
          <div className={styles.radioGroup}>
            <input
              type="radio"
              id="recentSurgeryTattooNo"
              name="recentSurgeryTattoo"
              value="false"
              checked={surveyData.recentSurgeryTattoo === false}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label
              htmlFor="recentSurgeryTattooNo"
              className={styles.radioLabel}
            >
              Không
            </label>
            <input
              type="radio"
              id="recentSurgeryTattooYes"
              name="recentSurgeryTattoo"
              value="true"
              checked={surveyData.recentSurgeryTattoo === true}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label
              htmlFor="recentSurgeryTattooYes"
              className={styles.radioLabel}
            >
              Có
            </label>
          </div>
          {errors.recentSurgeryTattoo && (
            <p className={styles.errorText}>{errors.recentSurgeryTattoo}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.questionLabel}>
            6. Bạn có tiêm vaccine (trừ vaccine cúm mùa) trong vòng 4 tuần gần
            đây không?
          </label>
          <p className={styles.questionNote}>
            Một số loại vaccine yêu cầu thời gian chờ nhất định trước khi hiến
            máu.
          </p>
          <div className={styles.radioGroup}>
            <input
              type="radio"
              id="recentVaccinationNo"
              name="recentVaccination"
              value="false"
              checked={surveyData.recentVaccination === false}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="recentVaccinationNo" className={styles.radioLabel}>
              Không
            </label>
            <input
              type="radio"
              id="recentVaccinationYes"
              name="recentVaccination"
              value="true"
              checked={surveyData.recentVaccination === true}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="recentVaccinationYes" className={styles.radioLabel}>
              Có
            </label>
          </div>
          {errors.recentVaccination && (
            <p className={styles.errorText}>{errors.recentVaccination}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.questionLabel}>
            7. Bạn có đang sử dụng thuốc (bao gồm cả thuốc bổ, thảo dược...)
            không?
          </label>
          <p className={styles.questionNote}>
            Một số loại thuốc có thể ảnh hưởng đến chất lượng máu hoặc an toàn
            của bạn khi hiến.
          </p>
          <div className={styles.radioGroup}>
            <input
              type="radio"
              id="onMedicationNo"
              name="onMedication"
              value="false"
              checked={surveyData.onMedication === false}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="onMedicationNo" className={styles.radioLabel}>
              Không
            </label>
            <input
              type="radio"
              id="onMedicationYes"
              name="onMedication"
              value="true"
              checked={surveyData.onMedication === true}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="onMedicationYes" className={styles.radioLabel}>
              Có
            </label>
          </div>
          {errors.onMedication && (
            <p className={styles.errorText}>{errors.onMedication}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.questionLabel}>
            8. Bạn có bệnh mãn tính (tim mạch, huyết áp, tiểu đường, hen
            suyễn...) không?
          </label>
          <p className={styles.questionNote}>
            Ví dụ: Cao huyết áp, tiểu đường, bệnh tim mạch, hen suyễn, bệnh về
            máu, v.v.
          </p>
          <div className={styles.radioGroup}>
            <input
              type="radio"
              id="hasChronicDiseaseNo"
              name="hasChronicDisease"
              value="false"
              checked={surveyData.hasChronicDisease === false}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="hasChronicDiseaseNo" className={styles.radioLabel}>
              Không
            </label>
            <input
              type="radio"
              id="hasChronicDiseaseYes"
              name="hasChronicDisease"
              value="true"
              checked={surveyData.hasChronicDisease === true}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="hasChronicDiseaseYes" className={styles.radioLabel}>
              Có
            </label>
          </div>
          {errors.hasChronicDisease && (
            <p className={styles.errorText}>{errors.hasChronicDisease}</p>
          )}
          {surveyData.hasChronicDisease === true && (
            <div className={styles.nestedFormGroup}>
              <label
                htmlFor="chronicDiseaseNote"
                className={styles.questionLabel}
              >
                Ghi chú bệnh mãn tính:
              </label>
              <textarea
                id="chronicDiseaseNote"
                name="chronicDiseaseNote"
                value={surveyData.chronicDiseaseNote}
                onChange={handleChange}
                className={styles.textArea}
                maxLength="255"
                placeholder="Vui lòng mô tả chi tiết bệnh mãn tính của bạn (tên bệnh, mức độ, đang điều trị...). Nếu không có, bạn có thể bỏ qua."
              ></textarea>
              {errors.chronicDiseaseNote && (
                <p className={styles.errorText}>{errors.chronicDiseaseNote}</p>
              )}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastDonationDays" className={styles.questionLabel}>
            9. Số ngày kể từ lần hiến máu gần nhất của bạn:
          </label>
          <p className={styles.questionNote}>
            Nếu đây là lần đầu tiên bạn hiến máu, hãy điền **0** hoặc để trống.
          </p>
          <input
            type="number"
            id="lastDonationDays"
            name="lastDonationDays"
            value={surveyData.lastDonationDays}
            onChange={handleChange}
            className={styles.textInput}
            min="0"
            placeholder="Nhập số ngày (ví dụ: 0 nếu chưa từng hiến) HOẶC để trống."
          />
          {errors.lastDonationDays && (
            <p className={styles.errorText}>{errors.lastDonationDays}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.questionLabel}>
            10. Bạn có từng bị phản ứng (choáng, ngất, sưng...) sau khi hiến máu
            không?
          </label>
          <p className={styles.questionNote}>
            Các phản ứng có thể là chóng mặt, buồn nôn, ngất xỉu, sưng hoặc đau
            tại vị trí tiêm.
          </p>
          <div className={styles.radioGroup}>
            <input
              type="radio"
              id="hadReactionPreviousDonationNo"
              name="hadReactionPreviousDonation"
              value="false"
              checked={surveyData.hadReactionPreviousDonation === false}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label
              htmlFor="hadReactionPreviousDonationNo"
              className={styles.radioLabel}
            >
              Không
            </label>
            <input
              type="radio"
              id="hadReactionPreviousDonationYes"
              name="hadReactionPreviousDonation"
              value="true"
              checked={surveyData.hadReactionPreviousDonation === true}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label
              htmlFor="hadReactionPreviousDonationYes"
              className={styles.radioLabel}
            >
              Có
            </label>
          </div>
          {errors.hadReactionPreviousDonation && (
            <p className={styles.errorText}>
              {errors.hadReactionPreviousDonation}
            </p>
          )}
          {surveyData.hadReactionPreviousDonation === true && (
            <div className={styles.nestedFormGroup}>
              <label
                htmlFor="previousReactionNote"
                className={styles.questionLabel}
              >
                Ghi chú phản ứng sau hiến:
              </label>
              <textarea
                id="previousReactionNote"
                name="previousReactionNote"
                value={surveyData.previousReactionNote}
                onChange={handleChange}
                className={styles.textArea}
                maxLength="255"
                placeholder="Vui lòng mô tả phản ứng bạn đã gặp. Nếu không có, bạn có thể bỏ qua."
              ></textarea>
              {errors.previousReactionNote && (
                <p className={styles.errorText}>
                  {errors.previousReactionNote}
                </p>
              )}
            </div>
          )}
        </div>

        <div className={styles.actionButtons}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? "Đang gửi..." : "Gửi Khảo Sát & Đăng Ký"}
          </button>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationSurvey;
