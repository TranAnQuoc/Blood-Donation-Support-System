package com.gtwo.bdss_system.dto.emergency;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gtwo.bdss_system.enums.EmergencyResult;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EmergencyHistoryDTO {
    private Long id;
    private Long requestId;
    private LocalDateTime resolvedAt;
    private String fullNameSnapshot;
    private Long bloodTypeId;
    private Long componentId;
    private Integer quantity;
    private EmergencyResult result;
    private String notes;
    @JsonIgnore
    private Boolean deleted;
}