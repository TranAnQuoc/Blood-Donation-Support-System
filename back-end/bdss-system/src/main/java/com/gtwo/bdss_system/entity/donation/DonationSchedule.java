package com.gtwo.bdss_system.entity.donation;

import com.gtwo.bdss_system.entity.commons.MedicalFacility;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "Donation_Schedule")
@Data
public class DonationSchedule {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Schedule_Name")
    @Nationalized
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MedicalFacilityID")
    private MedicalFacility facility;

    @Column(name = "Date")
    private Date date;

    @Column(name = "Start_Time")
    private Time startTime;

    @Column(name = "End_Time")
    private Time endTime;

    @Column(name = "Max_Slot")
    private int maxSlot;

    @Column(name = "Current_Slot")
    private int currentSlot;

    @Column(name = "Address")
    @Nationalized
    private String address;
}
