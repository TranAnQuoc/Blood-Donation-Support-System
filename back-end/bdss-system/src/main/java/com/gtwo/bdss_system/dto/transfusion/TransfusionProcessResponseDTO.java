package com.gtwo.bdss_system.dto.transfusion;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransfusionProcessResponseDTO {

    private Long requestId;
    private LocalDateTime transfusionStartedAt;
    private LocalDateTime transfusionCompletedAt;
    private String status;
    private String staffNotes;
    private Boolean healthCheckPassed;
    private String bloodPressure;
    private Integer heartRate;
    private BigDecimal temperature;
    private String allergyNotes;

}
