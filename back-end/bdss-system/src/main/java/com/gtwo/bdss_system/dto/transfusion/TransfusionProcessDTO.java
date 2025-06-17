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

    @Size(max = 65535)
    private String staffNotes;

    private Long usedBloodUnitId;
    private Boolean healthCheckPassed;
    private String bloodPressure;
    private Integer heartRate;
    private BigDecimal temperature;

    @Size(max = 65535)
    private String allergyNotes;

}