package com.gtwo.bdss_system.entity.transfusion;
import com.gtwo.bdss_system.enums.RhFactor;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "Transfusion_History")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransfusionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long recipientId;

    @Column(name = "full_name_snapshot")
    private String fullNameSnapshot;

    @Column(name = "birthdate_snapshot")
    private LocalDate birthdateSnapshot;

    @Column(name = "blood_type_snapshot")
    private String bloodTypeSnapshot;

    @Enumerated(EnumType.STRING)
    @Column(name = "rh_factor_snapshot")
    private RhFactor rhFactorSnapshot;

    @Column(name = "transfusion_date")
    private LocalDate transfusionDate;

    @Column(name = "facility_name")
    private String facilityName;

    private String componentReceived;

    private Integer quantity;

    private String resultNotes;

    @OneToOne
    @JoinColumn(name = "process_id", referencedColumnName = "transfusion_request_id")
    private TransfusionProcess process;
}
