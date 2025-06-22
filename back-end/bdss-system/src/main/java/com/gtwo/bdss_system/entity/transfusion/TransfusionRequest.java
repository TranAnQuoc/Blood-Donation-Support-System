package com.gtwo.bdss_system.entity.transfusion;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.StatusRequest;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "transfusion_request")
public class TransfusionRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name="recipient_id", nullable=false)
    private Account recipient;

    @Column(name="requested_at", nullable=false)
    private LocalDateTime requestedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private StatusRequest status;

    @ManyToOne @JoinColumn(name="approved_by")
    private Account approvedBy;

    @Column(name="approved_at")
    private LocalDateTime approvedAt;

    @ManyToOne @JoinColumn(name="facility_id")
    private MedicalFacility facility;

    @Column(name="blood_component_needed", length=50)
    private String bloodComponentNeeded;

    @Column(name="quantity_needed")
    private Integer quantityNeeded;

    @Column(name="doctor_diagnosis", columnDefinition="TEXT")
    private String doctorDiagnosis;

    @Column(name="pre_check_notes", columnDefinition="TEXT")
    private String preCheckNotes;

}

