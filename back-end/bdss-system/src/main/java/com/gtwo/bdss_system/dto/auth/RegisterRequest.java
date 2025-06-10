package com.gtwo.bdss_system.dto.auth;

import lombok.Data;

import java.sql.Date;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String gender;
    private Long bloodTypeId;
    private Date dateOfBirth;
    private String phone;
    private String address;
}
