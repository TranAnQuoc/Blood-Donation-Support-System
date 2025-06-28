package com.gtwo.bdss_system.entity.commons;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

@Entity
@Data
@Table(name = "compatibility_rule")
public class CompatibilityRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_blood_type_id", nullable = false)
    private BloodType donorBloodType;

    @ManyToOne
    @JoinColumn(name = "recipient_blood_type_id", nullable = false)
    private BloodType recipientBloodType;

    @ManyToOne
    @JoinColumn(name = "component_id", nullable = false)
    private BloodComponent component;

    private boolean isCompatible;

    @Column(name = "Explanation")
    @Nationalized
    private String explanation;
}