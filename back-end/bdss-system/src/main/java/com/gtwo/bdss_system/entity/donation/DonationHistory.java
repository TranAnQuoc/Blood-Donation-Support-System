package com.gtwo.bdss_system.entity.donation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.Gender;
import com.gtwo.bdss_system.enums.StatusProcess;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

import java.sql.Date;

@Entity
@Table(name = "Donation_History")
@Data
public class DonationHistory {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "Staff_ID")
    private Account staff;

    @Column(name = "Donor_Name")
    private String fullName;

    @Column(name = "Donor_Phone")
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "Donor_Gender")
    private Gender gender;

    @Column(name = "Donor_Date_of_birth")
    private Date dateOfBirth;

    @Column(name = "Blood_Type")
    private String bloodType;

    @Column(name = "Donation_Date")
    private Date donationDate;

    @Column(name = "Donation_Type")
    private String donationType;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "Facility_Name")
    private String facilityName;

    @Column(name = "Address")
    private String address;

    @Column(name = "Note")
    @Nationalized
    private String note;

    @Column(name = "Status")
    @Enumerated(EnumType.STRING)
    private StatusProcess status;
}
