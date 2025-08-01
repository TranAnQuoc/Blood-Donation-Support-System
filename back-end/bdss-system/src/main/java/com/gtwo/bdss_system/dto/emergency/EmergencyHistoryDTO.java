package com.gtwo.bdss_system.dto.emergency;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gtwo.bdss_system.enums.CrossmatchResult;
import com.gtwo.bdss_system.enums.EmergencyPlace;
import com.gtwo.bdss_system.enums.EmergencyResult;
import jakarta.mail.Multipart;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
@Data
public class EmergencyHistoryDTO {
    private Long id;
    private Long requestId;
    private LocalDateTime resolvedAt;
    private String fullNameSnapshot;
    private String phoneSnapshot;
    private Long bloodTypeId;
    private Long componentId;
    private Integer quantity;
    private EmergencyResult result;
    private String notes;

    private String reasonForTransfusion;
    private String needComponent;
    private CrossmatchResult crossmatchResult;
    private Double hemoglobinLevel;
    private Boolean bloodGroupConfirmed;
    private Integer pulse;
    private Double temperature;
    private Integer respiratoryRate;
    private String bloodPressure;
    private String symptoms;
    private String healthFile;
    private EmergencyPlace emergencyPlace;
    @JsonIgnore
    private Boolean deleted;
}
