package com.gtwo.bdss_system.dto.transfusion;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TransfusionProcessDTO {

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