package com.gtwo.bdss_system.entity.donation;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.DonationType;
import com.gtwo.bdss_system.enums.StatusProcess;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "Donation_Process")
@Data
public class DonationProcess {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RequestId")
    private DonationRequest request;

    @Column(name = "StartTime")
    private LocalDateTime startTime;

    @Column(name = "EndTime")
    private LocalDateTime endTime;

    @Column(name = "Health_Check")
    private Boolean healthCheck;

    @Column(name = "Hemoglobin_Level")
    private float hemoglobin;

    @Column(name = "Blood_Pressure")
    private String bloodPressure;

    @Column(name = "Staff_Notes")
    private String notes;

    @Column(name = "Donation_Type")
    @Enumerated(EnumType.STRING)
    private DonationType type;

    @Column(name = "Status")
    @Enumerated(EnumType.STRING)
    private StatusProcess status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Performer_ID")
    private Account performer;
}
