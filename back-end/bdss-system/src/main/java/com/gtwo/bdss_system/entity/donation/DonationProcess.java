package com.gtwo.bdss_system.entity.donation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.DonationType;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusHealthCheck;
import com.gtwo.bdss_system.enums.StatusProcess;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Donation_Process")
@Data
public class DonationProcess {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Request_ID", unique = true)
    @JsonIgnore
    private DonationRequest request;

    @Column(name = "Date")
    private LocalDate date;

    @Column(name = "StartTime")
    private LocalDateTime startTime;

    @Column(name = "EndTime")
    private LocalDateTime endTime;

    // 🔎 Các thông số khám lâm sàng
    @Column(name = "Heart_Rate")
    private String heartRate; // VD: "72 bpm"

    @Column(name = "Temperature")
    private Double temperature; // VD: 36.5°C

    @Column(name = "Weight")
    private Double weight; // VD: 55.0 kg

    @Column(name = "Height")
    private Double height; // VD: 1.65 m

    // 🩸 Kết quả test nhanh
    @Column(name = "Hemoglobin_Level")
    private Double hemoglobin; // VD: 125 g/l

    @Column(name = "Blood_Pressure")
    private String bloodPressure; // VD: "120/80"

    @Column(name = "Status_Health_Check")
    @Enumerated(EnumType.STRING)
    private StatusHealthCheck statusHealthCheck;

    @Column(name = "Failure_Reason")
    @Nationalized
    private String failureReason;

    // Lượng máu hiến được (ml)
    @Column(name = "Quantity")
    private int quantity;

    // Ghi chú của nhân viên
    @Column(name = "Staff_Notes")
    @Nationalized
    private String notes;

    @Column(name = "Donation_Type")
    @Enumerated(EnumType.STRING)
    private DonationType type;

    @Column(name = "Process")
    @Enumerated(EnumType.STRING)
    private StatusProcess process;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Performer_ID")
    @JsonIgnore
    private Account performer;

    @Column(name = "Status_Activate")
    @Enumerated(EnumType.STRING)
    private Status status;
}
