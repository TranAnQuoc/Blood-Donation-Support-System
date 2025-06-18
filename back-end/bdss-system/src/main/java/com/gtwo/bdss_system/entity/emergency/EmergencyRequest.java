package com.gtwo.bdss_system.entity.emergency;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.enums.StatusRequest;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_request")
@Data
public class EmergencyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "Fullname")
    private String fullName;

    @Column(name = "CCCD", nullable = false, unique = true)
    private String CCCD;

    @Column(name = "Phone", nullable = false, unique = true)
    private String phone;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "blood_type_id")
    private BloodType bloodType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "blood_component_id")
    private BloodComponent bloodComponent;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "location")
    private String location;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusRequest status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "verified_by")
    private Account verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
}