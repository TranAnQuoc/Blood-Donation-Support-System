package com.gtwo.bdss_system.entity.donation;

import com.gtwo.bdss_system.enums.Status;
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

    @Column(name = "Date")
    private Date date;

    @Column(name = "Start_Time")
    private Time startTime;

    @Column(name = "End_Time")
    private Time endTime;

    @Transient
    private int currentSlot;

    public void setCurrentSlot(int currentSlot) {
        this.currentSlot = currentSlot;
    }

    @Column(name = "Max_Slot")
    private int maxSlot;

    @Column(name = "Address")
    @Nationalized
    private String address;

    @Column(name = "Status_Schedule")
    @Enumerated(EnumType.STRING)
    private Status status;
}
