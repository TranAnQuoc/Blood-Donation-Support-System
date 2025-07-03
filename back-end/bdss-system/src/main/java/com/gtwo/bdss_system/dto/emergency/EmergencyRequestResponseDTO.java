package com.gtwo.bdss_system.dto.emergency;

import com.gtwo.bdss_system.enums.StatusRequest;
import lombok.Data;

@Data
public class EmergencyRequestResponseDTO {

    private Long id;
    private String fullName;
    private String phone;
    private String cccd;
    private Long bloodTypeId;
    private Long bloodComponentId;
    private Integer quantity;
    private String location;
    private StatusRequest statusRequest;

    private String emergencyProofPreview; // Cắt base64 cho ngắn (VD: 100 ký tự đầu)
}
