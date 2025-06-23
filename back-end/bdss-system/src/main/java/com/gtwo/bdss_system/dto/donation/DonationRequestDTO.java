package com.gtwo.bdss_system.dto.donation;

import com.gtwo.bdss_system.entity.commons.BloodType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DonationRequestDTO {
    private Long id;
    private String donorFullName;
    private String donorGender;
    private BloodType donorBloodType;
    private String eventName;
    private LocalDateTime requestTime;
    private String statusRequest;
    private String approverFullName;
    private LocalDateTime approvedTime;
    private String note;
}
