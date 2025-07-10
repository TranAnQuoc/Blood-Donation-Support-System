package com.gtwo.bdss_system.entity.transfusion;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.RhFactor;
import com.gtwo.bdss_system.enums.StatusProcess;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transfusion_process")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransfusionProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Yêu cầu truyền máu liên kết
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transfusion_request_id", nullable = false)
    private TransfusionRequest request;

    @ManyToOne
    @JoinColumn(name = "performed_by") // Tên cột foreign key trong bảng Transfusion_Process
    private Account performedBy;

    @Column(name = "transfusion_started_at", nullable = false)
    private LocalDateTime transfusionStartedAt = LocalDateTime.now();

    @Column(name = "transfusion_completed_at")
    private LocalDateTime transfusionCompletedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusProcess status; // enum: IN_PROGRESS, COMPLETED, FAILED

    @Column(name = "staff_notes", columnDefinition = "TEXT")
    private String staffNotes;

    @Column(name = "health_check_passed")
    private Boolean healthCheckPassed;

    @Column(name = "blood_pressure")
    private String bloodPressure;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "allergy_notes", columnDefinition = "TEXT")
    private String allergyNotes;

    @Column(name = "Full_Name_Snapshot")
    private String fullNameSnapshot;

    @Column(name = "birthdate_snapshot")
    private LocalDate birthdateSnapshot;

    @Column(name = "blood_type_snapshot")
    private String bloodTypeSnapshot;

    @Column(name = "rh_factor_snapshot")
    @Enumerated(EnumType.STRING)
    private RhFactor rhFactorSnapshot;
}


