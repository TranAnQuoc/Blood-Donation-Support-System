package com.gtwo.bdss_system.dto.transfusion;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TransfusionRequestResponseDTO {

    private Long id;
    private Long recipientId;
    private LocalDateTime requestedAt;
    private String status;
    private Long approvedById;
    private LocalDateTime approvedAt;
    private Long facilityId;
    private String bloodComponentNeeded;
    private Integer quantityNeeded;
    private String doctorDiagnosis;
    private String preCheckNotes;

}