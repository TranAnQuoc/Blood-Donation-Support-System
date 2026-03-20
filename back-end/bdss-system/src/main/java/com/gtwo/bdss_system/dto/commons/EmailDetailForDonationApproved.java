package com.gtwo.bdss_system.dto.commons;

import lombok.Data;

import java.sql.Time;
import java.time.LocalDate;

@Data
public class EmailDetailForDonationApproved {
    private String toEmail;
    private String subject;
    private String donorName;
    private String eventName;
    private String location;
    private LocalDate donationDate;
    private Time startTime;
    private Time endTime;
}
