package com.gtwo.bdss_system.entity.donation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.StatusRequest;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "Donation_Request")
@Data
public class DonationRequest {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Donor_ID")
    private Account donor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Event_ID")
    private DonationEvent event;

    @Column(name = "Request_Time")
    private LocalDateTime requestTime;

    @Column(name = "Status_Request")
    @Enumerated(EnumType.STRING)
    private StatusRequest statusRequest;

    // ========== Các trường khảo sát sức khỏe ==========

    // a. Lịch sử sức khỏe
    @Column(name = "Is_Healthy_Today")
    private Boolean isHealthyToday;

    @Column(name = "Has_Symptoms")
    private Boolean hasSymptoms; // sốt, ho, tiêu chảy,...

    // b. Bệnh truyền nhiễm
    @Column(name = "Has_Infectious_Diseases")
    private Boolean hasInfectiousDiseases;

    @Column(name = "Unsafe_Sex")
    private Boolean unsafeSex;

    // c. Phẫu thuật / xăm / vaccine
    @Column(name = "Recent_Surgery_Tattoo")
    private Boolean recentSurgeryTattoo;

    @Column(name = "Recent_Vaccination")
    private Boolean recentVaccination;

    // d. Thuốc và điều trị
    @Column(name = "On_Medication")
    private Boolean onMedication;

    @Column(name = "Has_Chronic_Disease")
    private Boolean hasChronicDisease;

    @Column(name = "Chronic_Disease_Note")
    @Nationalized
    private String chronicDiseaseNote;

    // e. Tiền sử hiến máu
    @Column(name = "Last_Donation_Days")
    private Integer lastDonationDays;

    @Column(name = "Had_Reaction_Previous_Donation")
    private Boolean hadReactionPreviousDonation;

    @Column(name = "Previous_Reaction_Note")
    @Nationalized
    private String previousReactionNote;

    @Column(name = "Approved_Time")
    private LocalDateTime approvedTime;

    @Column(name = "Pre_Check_Note")
    @Nationalized
    private String note;

    @OneToOne(mappedBy = "request", fetch = FetchType.EAGER)
    @JsonIgnore
    private DonationProcess process;
}
