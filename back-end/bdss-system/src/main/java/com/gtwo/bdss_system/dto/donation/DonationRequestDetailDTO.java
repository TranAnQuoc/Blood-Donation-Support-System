package com.gtwo.bdss_system.dto.donation;

import com.gtwo.bdss_system.entity.commons.BloodType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DonationRequestDetailDTO {
    private Long id;
    private String donorFullName;
    private String donorGender;
    private BloodType donorBloodType;
    private String eventName;
    private LocalDateTime requestTime;
    private String statusRequest;
    private LocalDateTime approvedTime;
    private String note;
    //Survey
    private Boolean isHealthyToday;
    private Boolean hasSymptoms;
    private Boolean hasInfectiousDiseases;
    private Boolean unsafeSex;
    private Boolean recentSurgeryTattoo;
    private Boolean recentVaccination;
    private Boolean onMedication;
    private Boolean hasChronicDisease;
    private String chronicDiseaseNote;
    private Integer lastDonationDays;
    private Boolean hadReactionPreviousDonation;
    private String previousReactionNote;
}
