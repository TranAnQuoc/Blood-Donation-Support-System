package com.gtwo.bdss_system.entity.donation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.DonationType;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusProcess;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

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

    @Column(name = "StartTime")
    private LocalDateTime startTime;

    @Column(name = "EndTime")
    private LocalDateTime endTime;

    @Column(name = "Health_Check")
    private Boolean healthCheck;

    @Column(name = "Hemoglobin_Level")
    private Double hemoglobin;

    @Column(name = "Blood_Pressure")
    private String bloodPressure;

    @Column(name = "Quantity")
    private int quantity;

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
