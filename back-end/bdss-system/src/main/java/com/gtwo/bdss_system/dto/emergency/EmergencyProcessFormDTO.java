package com.gtwo.bdss_system.dto.emergency;

import com.gtwo.bdss_system.enums.CrossmatchResult;
import com.gtwo.bdss_system.enums.EmergencyStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EmergencyProcessFormDTO {

    @NotBlank(message = "Tóm tắt hồ sơ sức khỏe không được để trống")
    @Size(max = 1000, message = "Tóm tắt hồ sơ sức khỏe tối đa 1000 ký tự")
    private String healthCheckSummary;


    @NotNull(message = "Trạng thái quy trình là bắt buộc")
    private EmergencyStatus status;

    @Size(max = 500, message = "Triệu chứng tối đa 500 ký tự")
    private String symptoms;

    @Size(max = 50, message = "Huyết áp tối đa 50 ký tự")
    private String bloodPressure;

    @Min(value = 0, message = "Mạch phải lớn hơn hoặc bằng 0")
    private Integer pulse;

    @Min(value = 0, message = "Nhịp thở phải lớn hơn hoặc bằng 0")
    private Integer respiratoryRate;

    @DecimalMin(value = "30.0", message = "Nhiệt độ không hợp lệ", inclusive = true)
    @DecimalMax(value = "45.0", message = "Nhiệt độ không hợp lệ", inclusive = true)
    private Double temperature;

    @DecimalMin(value = "0.0", message = "Nồng độ Hemoglobin không hợp lệ")
    private Double hemoglobinLevel;

    private Boolean bloodGroupConfirmed;

    @Min(value = 1, message = "Số lượng máu phải lớn hơn 0")
    private Integer quantity;

    @Schema(description = "Kết quả crossmatch", example = "COMPATIBLE")
    private CrossmatchResult crossmatchResult;

    @Size(max = 200, message = "Thành phần máu cần thiết tối đa 200 ký tự")
    private String needComponent;

    @Size(max = 500, message = "Lý do truyền máu tối đa 500 ký tự")
    private String reasonForTransfusion;

    @Schema(type = "string", format = "binary", description = "File hồ sơ sức khỏe")
    private MultipartFile healthFile;
}
