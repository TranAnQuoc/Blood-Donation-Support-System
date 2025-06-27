package com.gtwo.bdss_system.dto.emergency;

import com.gtwo.bdss_system.enums.StatusProcess;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EmergencyProcessDTO {
    private Long id;
    private Long requestId;
    private String healthCheckSummary;
    private Boolean confirmed;
    private Long assignedStaffId;
    private String staffName;
    private String facilityName;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private StatusProcess status;
    private String symptoms;
    private String vitalSigns;
    private Double hemoglobinLevel;
    private Boolean bloodGroupConfirmed;
    private String crossmatchResult;
    private String needComponent;
    private String reasonForTransfusion;

}
