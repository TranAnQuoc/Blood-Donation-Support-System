package com.gtwo.bdss_system.dto.commons;

import com.gtwo.bdss_system.enums.StatusBloodStorage;
import com.gtwo.bdss_system.enums.StatusVerified;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BloodStorageStatusDTO {
    private Long id;
    private String bloodType;
    private String bloodComponent;
    private Integer quantity;
    private StatusBloodStorage bloodStatus;
    private LocalDateTime createAt;
    private LocalDateTime approvedAt;
    private LocalDateTime takeAt;
    private String usageReason;
    private StatusVerified verifiedStatus;
    private String verifiedNote;
}
