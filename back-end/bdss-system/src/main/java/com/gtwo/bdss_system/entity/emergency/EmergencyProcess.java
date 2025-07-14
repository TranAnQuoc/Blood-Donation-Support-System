package com.gtwo.bdss_system.entity.emergency;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.CrossmatchResult;
import com.gtwo.bdss_system.enums.EmergencyStatus;
import com.gtwo.bdss_system.enums.Status;
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

    @Column(name = "status_available")
    @Enumerated(EnumType.STRING)
    private Status statusAvailable;

    @Column(name = "symptoms")
    @Nationalized
    private String symptoms;

    @Column(name = "hemoglobin_level")
    private Double hemoglobinLevel;

    @Column(name = "blood_group_confirmed")
    private Boolean bloodGroupConfirmed;

    @Enumerated(EnumType.STRING)
    @Column(name = "crossmatch_result")
    private CrossmatchResult crossmatchResult;

    @Column(name = "need_component")
    @Nationalized
    private String needComponent;

    @Column(name ="blood_quantity")
    private Integer quantity;

    @Column(name = "reason_for_transfusion")
    @Nationalized
    private String reasonForTransfusion;

    @Column(name = "blood_pressure")
    @Nationalized
    private String bloodPressure;

    @Column(name = "pulse")
    private Integer pulse;

    @Column(name = "respiratory_rate")
    private Integer respiratoryRate;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "health_file_url", columnDefinition = "NVARCHAR(MAX)")
    private String healthFileUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id")
    private BloodType bloodType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id")
    private BloodComponent bloodComponent;


}