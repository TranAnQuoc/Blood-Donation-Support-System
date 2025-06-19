package com.gtwo.bdss_system.dto.emergency;

import com.gtwo.bdss_system.enums.EmergencyStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EmergencyProcessDTO {
    private Long id;
    private Long requestId;
    private String requestFullName;
    private String healthCheckSummary;
    private Boolean confirmed;
    private Long assignedFacilityId;
    private String facilityName;
    private Long assignedStaffId;
    private String staffName;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private EmergencyStatus status;
}
