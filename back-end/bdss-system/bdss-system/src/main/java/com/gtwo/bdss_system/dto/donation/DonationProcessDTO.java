package com.gtwo.bdss_system.dto.donation;

import com.gtwo.bdss_system.enums.DonationType;
import com.gtwo.bdss_system.enums.StatusProcess;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DonationProcessDTO {
    private Long performerId;
    private String date;
    private String startTime;
    private Long bloodTypeId;
    private boolean healthCheck;
    private Double hemoglobin;
    private String bloodPressure;
    private int quantity;
    private DonationType type;
    private String notes;
    private StatusProcess process;
    private String endTime;
}
