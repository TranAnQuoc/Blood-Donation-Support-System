package com.gtwo.bdss_system.dto.transfusion;

import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusRequest;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransfusionRequestResponseDTO {
    private Long id;
    private Long recipientId;
    private String bloodComponentNeeded;
    private int quantityNeeded;
    private String doctorDiagnosis;
    private String preCheckNotes;
    private String address;
    private Long staffId;
    private LocalDateTime approvedAt;
    private StatusRequest statusRequest;
    private LocalDateTime requestedAt;
    private Status status;
}
