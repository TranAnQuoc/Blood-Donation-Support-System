package com.gtwo.bdss_system.entity.commons;

import com.gtwo.bdss_system.enums.StatusBloodStorage;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Data
public class BloodStorageHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "blood_storage_history_id")
    private Long id;

    @Column(name = "original_blood_storage_id")
    private Long originalBloodStorageId;

    @Column(name = "donor_full_name")
    @Nationalized
    private String donorFullName;

    @Column(name = "donor_phone")
    private String donorPhone;

    @Column(name = "blood_type")
    private String bloodType;

    @Column(name = "blood_component")
    private String bloodComponent;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "blood_status")
    @Enumerated(EnumType.STRING)
    private StatusBloodStorage bloodStatus;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "created_by_id")
    private Long createdById;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "approved_by_id")
    private Long approvedById;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "verified_by_id")
    private Long verifiedById;

    @Column(name = "usage_reason")
    @Nationalized
    private String usageReason;

    @Column(name = "take_at")
    private LocalDateTime takeAt;

    @Column(name = "take_by_id")
    private Long takeById;

    @Column(name = "use_at")
    private LocalDateTime useAt;

    @Column(name = "archived_at")
    private LocalDateTime archivedAt;

    @Column(name = "note")
    @Nationalized
    private String note;
}
