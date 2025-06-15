package com.gtwo.bdss_system.dto.auth;

import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.Gender;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusDonation;
import lombok.Data;
import java.util.Date;

@Data
public class AccountResponse {
    private Long id;
    private String email;
    private Role role;
    private String fullName;
    private Gender gender;
    private BloodType bloodType;
    private Date dateOfBirth;
    private String phone;
    private String address;
    private Date createAt;
    private Status status;
    private StatusDonation statusDonation;
    private String token;
}
