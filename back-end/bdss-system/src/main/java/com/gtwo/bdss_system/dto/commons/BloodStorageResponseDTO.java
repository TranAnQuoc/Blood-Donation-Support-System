package com.gtwo.bdss_system.dto.commons;

import com.gtwo.bdss_system.enums.StatusBloodStorage;
import com.gtwo.bdss_system.enums.StatusVerified;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BloodStorageResponseDTO {
    private Long id;

    private Long donorId;
    private String donorName;
    private String donorPhone;
    private String donorRole;

    private Long bloodTypeId;
    private String bloodTypeName;
    private String bloodTypeRh;
    private Long bloodComponentId;
    private String bloodComponentName;
    private Integer quantity;
    private StatusBloodStorage bloodStatus;
    private LocalDateTime createAt;

    private Long createdById;
    private String createdByName;
    private String createdByPhone;
    private String createdByRole;

    private LocalDateTime approvedAt;
    private Long approvedById;
    private String approvedByName;
    private String approvedByPhone;
    private String approvedByRole;

    private String usageReason;
    private LocalDateTime takeAt;
    private Long takeById;
    private String takeByName;
    private String takeByPhone;
    private String takeByRole;

    private LocalDateTime verifiedAt;
    private Long verifiedById;
    private String verifiedByName;
    private String verifiedByPhone;
    private String verifiedByRole;

    private StatusVerified verifiedStatus;
    private String verifiedNote;
}
