package com.gtwo.bdss_system.dto.emergency;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EmergencyRequestFormDTO {

    @Schema(description = "Họ tên người cần máu", example = "Nguyễn Văn A")
    private String fullName;

    @Schema(description = "Số điện thoại", example = "0701234567")
    private String phone;

    @Schema(description = "CCCD", example = "012345678901")
    private String cccd;

    @Schema(description = "ID nhóm máu", example = "1")
    private Long bloodTypeId;

    @Schema(description = "ID thành phần máu", example = "2")
    private Long bloodComponentId;

    @Schema(description = "Số lượng máu cần (ml)", example = "350")
    private Integer quantity;

    @Schema(description = "Địa điểm cần máu", example = "Bệnh viện Chợ Rẫy")
    private String location;

    @Schema(description = "Lý do khẩn cấp", example = "Bị tai nạn xe máy, cần máu gấp")
    private String emergencyProof;

    @Schema(type = "string", format = "binary", description = "Ảnh minh chứng khẩn cấp")
    private MultipartFile proofImage;
}
