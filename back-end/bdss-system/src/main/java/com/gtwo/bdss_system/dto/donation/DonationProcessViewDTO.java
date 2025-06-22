package com.gtwo.bdss_system.dto.donation;

import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.DonationType;
import com.gtwo.bdss_system.enums.StatusProcess;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class DonationProcessViewDTO {
    private Long id;
    private String donorFullName;
    private LocalDate donorBirthDate;
    private String donorPhone;
    private String donorGender;
    private BloodType donorBloodType;
    private String eventName;
    private LocalDateTime startTime;
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
    private String notes;
    private DonationType typeDonation;
    private LocalDateTime endTime;
    private StatusProcess process;
    private String performerFullName;
}