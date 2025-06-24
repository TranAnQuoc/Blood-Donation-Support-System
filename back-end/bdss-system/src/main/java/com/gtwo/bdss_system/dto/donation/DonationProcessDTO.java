package com.gtwo.bdss_system.dto.donation;

import com.gtwo.bdss_system.enums.DonationType;
import com.gtwo.bdss_system.enums.StatusProcess;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DonationProcessDTO {
    private Long bloodTypeId;
    private LocalDate date;
    private boolean healthCheck;
    private String heartRate;
    private Double temperature;
    private Double weight;
    private Double height;
    private Double hemoglobin;
    private String bloodPressure;
    private Boolean hasChronicDisease;
    private Boolean hasRecentTattoo;
    private Boolean hasUsedDrugs;
    private String screeningNote;
    private int quantity;
    private DonationType type;
    private String notes;
    private StatusProcess process;
}
