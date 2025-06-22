package com.gtwo.bdss_system.entity.transfusion;

import com.gtwo.bdss_system.entity.auth.Account;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "transfusion_history")
public class TransfusionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name="recipient_id")
    private Account recipient;
    private String fullNameSnapshot;
    private LocalDate birthdateSnapshot;
    private String bloodTypeSnapshot;
    private String rhFactorSnapshot;
    @Column(name="transfusion_date")
    private LocalDate transfusionDate;
    @ManyToOne @JoinColumn(name="facility_id")
    private MedicalFacility facility;
    @Column(name="component_received", length=50)
    private String componentReceived;
    private Integer quantity;
    @Column(columnDefinition="TEXT")
    private String resultNotes;

}
