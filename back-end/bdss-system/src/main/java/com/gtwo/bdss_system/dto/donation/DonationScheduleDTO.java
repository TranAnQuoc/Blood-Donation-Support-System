package com.gtwo.bdss_system.dto.donation;

import com.gtwo.bdss_system.enums.Status;
import lombok.Data;


import java.sql.Date;
import java.sql.Time;

@Data
public class DonationScheduleDTO {
    private String name;
    private Long facilityId;
    private Date date;
    private Time startTime;
    private Time endTime;
    private int maxSlot;
    private String address;
    private Status status;
}
