package com.gtwo.bdss_system.entity.emergency;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.EmergencyStatus;
import com.gtwo.bdss_system.enums.StatusProcess;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_process")
@Data
public class EmergencyProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id")
    private EmergencyRequest emergencyRequest;

    @Column(name = "health_check_summary")
    @Nationalized
    private String healthCheckSummary;

    @Column(name = "confirmed")
    private Boolean confirmed;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_staff")
    private Account assignedStaff;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private EmergencyStatus status;

    @Column(name = "symptoms")
    @Nationalized
    private String symptoms;

    @Column(name = "vital_signs")
    private String vitalSigns;

    @Column(name = "hemoglobin_level")
    private Double hemoglobinLevel;

    @Column(name = "blood_group_confirmed")
    private Boolean bloodGroupConfirmed;

    @Column(name = "crossmatch_result")
    @Nationalized
    private String crossmatchResult;

    @Column(name = "need_component")
    @Nationalized
    private String needComponent;

    @Column(name = "reason_for_transfusion")
    @Nationalized
    private String reasonForTransfusion;
}