package com.gtwo.bdss_system.dto.emergency;

import com.gtwo.bdss_system.enums.EmergencyStatus;
import lombok.Data;

import jakarta.validation.constraints.*;

@Data
public class EmergencyProcessDTO {

    @Size(max = 1000, message = "Health check summary must be less than 1000 characters.")
    private String healthCheckSummary;

    @NotNull(message = "Confirm is required.")
    private Boolean confirmed;

    @NotNull(message = "Status is required.")
    private EmergencyStatus status;

    @NotBlank(message = "Symptoms must not be blank.")
    private String symptoms;

    @NotBlank(message = "Vital signs must not be blank.")
    private String vitalSigns;

    @NotNull(message = "Hemoglobin level is required.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Hemoglobin level must be positive.")
    private Double hemoglobinLevel;

    @NotNull(message = "Blood group confirmation status is required.")
    private Boolean bloodGroupConfirmed;

    @NotNull(message ="blood quantity is required")
    private Integer quantity;

    @NotBlank(message = "Crossmatch result is required.")
    private String crossmatchResult;

    @NotBlank(message = "Component need must be specified.")
    private String needComponent;

    @NotBlank(message = "Reason for transfusion is required.")
    private String reasonForTransfusion;
}

