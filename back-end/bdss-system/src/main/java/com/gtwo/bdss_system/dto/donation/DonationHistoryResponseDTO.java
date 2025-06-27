package com.gtwo.bdss_system.dto.donation;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.sql.Date;

@Data
public class DonationHistoryResponseDTO {
    private Long id;
    private String staffName;
    private String donorName;
    private String donorPhone;
    private String donorGender;
    private Date donorDateOfBirth;
    private String bloodType;
    private Date donationDate;
    private String donationType;
    private int quantity;
    private String address;
    private String note;
    private String status;
    @JsonFormat(pattern = "yyyy-MM-dd")
    public Date getDonationDate() {
        return donationDate;
    }
    @JsonFormat(pattern = "yyyy-MM-dd")
    public Date getDonorDateOfBirth() {
        return donorDateOfBirth;
    }
}
