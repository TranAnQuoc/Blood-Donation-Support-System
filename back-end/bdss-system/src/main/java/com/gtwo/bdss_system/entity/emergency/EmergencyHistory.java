package com.gtwo.bdss_system.entity.emergency;

import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.EmergencyResult;
import jakarta.persistence.*;
import lombok.Data;

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
    private String fullNameSnapshot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id")
    private BloodType bloodType;

    @Column(name = "facility_name")
    private String facilityName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id")
    private BloodComponent component;

    @Column(name = "quantity")
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "result")
    private EmergencyResult result;

    @Column(name = "notes")
    private String notes;

    @Column(name = "deleted")
    private Boolean delete = false;
}
