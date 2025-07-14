package com.gtwo.bdss_system.dto.emergency;

import com.gtwo.bdss_system.enums.CrossmatchResult;
import com.gtwo.bdss_system.enums.EmergencyStatus;
import lombok.Data;

import jakarta.validation.constraints.*;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EmergencyProcessDTO {

    private Long id;

    private Long idRequest;

    @NotNull(message = "Status is required.")
    private EmergencyStatus status;

    @NotBlank(message = "Symptoms must not be blank.")
    private String symptoms;

    @NotNull(message = "Hemoglobin level is required.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Hemoglobin level must be positive.")
    private Double hemoglobinLevel;

    @NotNull(message = "Blood group confirmation status is required.")
    private Boolean bloodGroupConfirmed;

    @NotNull(message ="blood quantity is required")
    private Integer quantity;

    @NotBlank(message = "Crossmatch result is required.")
    private CrossmatchResult crossmatchResult;

    @NotBlank(message = "Component need must be specified.")
    private String needComponent;

    @NotBlank(message = "Reason for transfusion is required.")
    private String reasonForTransfusion;

    @NotBlank(message = "Blood pressure is required.")
    private String bloodPressure;

    @NotNull(message = "Pulse is required.")
    @Positive(message = "Pulse must be a positive number.")
    private Integer pulse;

    @NotNull(message = "Respiratory rate is required.")
    @Positive(message = "Respiratory rate must be a positive number.")
    private Integer respiratoryRate;

    @NotNull(message = "Temperature is required.")
    @DecimalMin(value = "25.0", message = "Temperature must be reasonable.")
    private Double temperature;



}

