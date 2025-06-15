package com.gtwo.bdss_system.entity.emergency;

import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
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
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id")
    private EmergencyRequest emergencyRequest;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "full_name_snapshot", length = 100)
    private String fullNameSnapshot;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "blood_type_id")
    private BloodType bloodType;

    @Column(name = "facility_name")
    private String facilityName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "component_id")
    private BloodComponent bloodComponent;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "result")
    @Enumerated(EnumType.STRING)
    private EmergencyResult result;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}