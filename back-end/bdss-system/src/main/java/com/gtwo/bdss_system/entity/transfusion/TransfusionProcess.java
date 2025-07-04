package com.gtwo.bdss_system.entity.transfusion;

import com.gtwo.bdss_system.enums.RhFactor;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.gtwo.bdss_system.enums.StatusProcess;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

@Data
@Entity
@Table(name = "transfusion_process")
public class TransfusionProcess {

    @Id
    @Column(name = "transfusion_request_id")
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "transfusion_request_id")
    private TransfusionRequest request;

    @Column(name = "transfusion_started_at")
    private LocalDateTime transfusionStartedAt;

    @Column(name = "transfusion_completed_at")
    private LocalDateTime transfusionCompletedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusProcess status;

    @Column(name = "staff_notes", columnDefinition = "TEXT")
    private String staffNotes;

    @Column(name = "used_blood_unit_id")
    private Long usedBloodUnitId;

    @Column(name = "health_check_passed")
    private Boolean healthCheckPassed;

    @Column(name = "blood_pressure", length = 20)
    private String bloodPressure;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "temperature", precision = 4, scale = 1)
    private BigDecimal temperature;

    @Column(name = "allergy_notes", columnDefinition = "TEXT")
    private String allergyNotes;

    @Nationalized
    @Column(name = "full_name_snapshot")
    private String fullNameSnapshot;

    @Column(name = "birthdate_snapshot")
    private LocalDate birthdateSnapshot;

    @Column(name = "blood_type_snapshot")
    private String bloodTypeSnapshot;

    @Enumerated(EnumType.STRING)
    @Column(name = "rh_factor_snapshot")
    private RhFactor rhFactorSnapshot;

    @Column(name = "facility_name")
    private String facilityName;

}
