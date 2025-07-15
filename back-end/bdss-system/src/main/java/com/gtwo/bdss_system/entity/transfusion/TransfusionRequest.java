package com.gtwo.bdss_system.entity.transfusion;

import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusRequest;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "transfusion_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransfusionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_request", nullable = false)
    private StatusRequest statusRequest;

    @Column(name = "approved_by")
    private Integer approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "blood_component_needed", nullable = false)
    private String bloodComponentNeeded;

    @Column(name = "quantity_needed", nullable = false)
    private Integer quantityNeeded;

    @Column(name = "doctor_diagnosis", nullable = false)
    private String doctorDiagnosis;

    @Column(name = "pre_check_notes")
    private String preCheckNotes;

    @Column(name = "address")
    @Nationalized
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;
}
