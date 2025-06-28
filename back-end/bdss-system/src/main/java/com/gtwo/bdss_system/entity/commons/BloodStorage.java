package com.gtwo.bdss_system.entity.commons;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.StatusBloodStorage;
import com.gtwo.bdss_system.enums.StatusVerified;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "blood_storage")
public class BloodStorage {
    @Id
    @Column(name = "blood_storage_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private Account donor;

    @ManyToOne
    @JoinColumn(name = "blood_type_id")
    private BloodType bloodType;

    @ManyToOne
    @JoinColumn(name = "blood_component_id")
    private BloodComponent bloodComponent;

    @Column(name = "Quantity")
    private Integer quantity;

    @Column(name = "Blood_Status")
    @Enumerated(jakarta.persistence.EnumType.STRING)
    private StatusBloodStorage bloodStatus;

    @Column(name = "Create_At")
    private LocalDateTime createAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private Account createdBy;

    @Column(name = "Approved_At")
    private LocalDateTime approvedAt;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private Account approvedBy;

    @Column(name = "Usage_Reason")
    @Nationalized
    private String usageReason;

    @Column(name = "Take_At")
    private LocalDateTime takeAt;

    @ManyToOne
    @JoinColumn(name = "take_by")
    private Account takeBy;

    @Column(name = "Verified_At")
    private LocalDateTime verifiedAt;

    @ManyToOne
    @JoinColumn(name = "verified_by")
    private Account verifiedBy;

    @Column(name = "verified_status")
    @Enumerated(EnumType.STRING)
    private StatusVerified verifiedStatus;

    @Column(name = "verified_note")
    @Nationalized
    private String verifiedNote;
}
