package com.gtwo.bdss_system.entity.emergency;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.MedicalFacility;
import com.gtwo.bdss_system.enums.StatusProcess;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_process")
@Data
public class EmergencyProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id")
    private EmergencyRequest emergencyRequest;

    @Column(name = "health_check_summary")
    private String healthCheckSummary;

    @Column(name = "confirmed")
    private Boolean confirmed;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_facility_id")
    private MedicalFacility assignedFacility;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_staff")
    private Account assignedStaff;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusProcess status;
}