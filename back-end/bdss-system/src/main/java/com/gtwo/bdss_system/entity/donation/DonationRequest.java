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

    @OneToOne(fetch = FetchType.EAGER)
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Approver_ID")
    private Account approver;

    @Column(name = "Approved_Time")
    private LocalDateTime approvedTime;

    @Column(name = "Pre_Check_Note")
    @Nationalized
    private String note;

    @OneToOne(mappedBy = "request", fetch = FetchType.EAGER)
    @JsonIgnore
    private DonationProcess process;
}
