package com.gtwo.bdss_system.entity.emergency;

import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.CrossmatchResult;
import com.gtwo.bdss_system.enums.EmergencyPlace;
import com.gtwo.bdss_system.enums.EmergencyResult;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;
@Entity
@Table(name = "emergency_history")
@Data
public class EmergencyHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    private EmergencyRequest emergencyRequest;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "full_name_snapshot")
    @Nationalized
    private String fullNameSnapshot;

    @Column(name= "phone_snapshot")
    private String phoneSnapshot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id")
    private BloodType bloodType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id")
    private BloodComponent component;

    @Column(name = "quantity")
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "result")
    private EmergencyResult result;

    @Column(name = "notes")
    @Nationalized
    private String notes;

    @Column(name = "reason_for_transfusion")
    @Nationalized
    private String reasonForTransfusion;

    @Column(name = "need_component")
    private String needComponent;

    @Enumerated(EnumType.STRING)
    @Column(name = "crossmatch_result")
    private CrossmatchResult crossmatchResult;

    @Column(name = "hemoglobin_level")
    private Double hemoglobinLevel;

    @Column(name = "blood_group_confirmed")
    private Boolean bloodGroupConfirmed;

    @Column(name = "pulse")
    private Integer pulse;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "respiratory_rate")
    private Integer respiratoryRate;

    @Column(name = "blood_pressure")
    private String bloodPressure;

    @Column(name = "symptoms")
    @Nationalized
    private String symptoms;

    @Column(name = "deleted")
    private Boolean delete = false;

    @Column(name = "health_file_url", columnDefinition = "NVARCHAR(MAX)")
    private String healthFileUrl;

    @Column(name= "emergency_place")
    @Enumerated(EnumType.STRING)
    private EmergencyPlace emergencyPlace;
}
