package com.gtwo.bdss_system.dto.donation;

import lombok.Data;

import java.sql.Date;

@Data
public class CreateDonationHistoryRequest {
    private Long staffId;
    private String donorName;
    private String donorPhone;
    private String donorGender;
    private Date donorDateOfBirth;
    private String bloodType;
    private Date donationDate;
    private String donationType;
    private int quantity;
    private String facilityName;
    private String address;
    private String note;
}
