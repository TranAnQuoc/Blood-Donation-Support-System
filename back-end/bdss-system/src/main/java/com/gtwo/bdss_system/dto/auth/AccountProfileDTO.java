package com.gtwo.bdss_system.dto.auth;

import com.gtwo.bdss_system.entity.commons.BloodType;
import jakarta.validation.constraints.*;
import com.gtwo.bdss_system.enums.Gender;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusDonation;
import lombok.Data;

import java.sql.Date;

@Data
public class AccountProfileDTO {
    @NotBlank(message = "Full name is required")
    private String fullName;

    private String email;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private Date dateOfBirth;

    @NotBlank(message = "CCCD is required")
    private String cccd;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(0[0-9]{9})$", message = "Phone number must start with 0 and have 10 digits")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    private BloodType bloodType;

    private Status status;

    @NotNull(message = "Status donation is required")
    private StatusDonation statusDonation;
}
