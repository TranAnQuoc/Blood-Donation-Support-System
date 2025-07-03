package com.gtwo.bdss_system.controller.emergency;

import com.gtwo.bdss_system.dto.emergency.EmergencyRequestDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.web.multipart.MultipartFile;

public class EmergencyRequestForm {

    @Schema(
            description = "Thông tin yêu cầu khẩn cấp dưới dạng JSON",
            implementation = EmergencyRequestDTO.class,
            type = "string",
            example = """
        {
          "fullName": "Nguyễn Văn A",
          "phone": "0705090903",
          "cccd": "123456789012",
          "statusRequest": "PENDING",
          "bloodTypeId": 1,
          "bloodComponentId": 2,
          "quantity": 300,
          "location": "Bệnh viện A",
          "emergencyProof": "Bị tai nạn, cần máu gấp"
        }
        """
    )
    private String request;

    @Schema(description = "Ảnh minh chứng", type = "string", format = "binary")
    private MultipartFile proofImage;

    // Getter & Setter không cần thiết vì chỉ dùng cho mô tả Swagger
}
