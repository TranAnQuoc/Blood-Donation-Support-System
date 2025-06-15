package com.gtwo.bdss_system.dto.auth;

import com.gtwo.bdss_system.enums.Gender;
import lombok.Data;

import java.sql.Date;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private Gender gender;
    private Long bloodTypeId;
    private Date dateOfBirth;
    private String phone;
    private String address;
}
