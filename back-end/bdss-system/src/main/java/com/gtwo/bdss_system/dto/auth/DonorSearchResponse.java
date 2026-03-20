package com.gtwo.bdss_system.dto.auth;

import lombok.Data;

@Data
public class DonorSearchResponse {
    private String fullName;
    private String location;
    private String phone;
    private String note;
    private String bloodType;
    private String rhFactor;
}