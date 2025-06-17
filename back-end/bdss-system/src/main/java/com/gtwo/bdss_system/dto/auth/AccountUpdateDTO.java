package com.gtwo.bdss_system.dto.auth;

import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.Gender;
import com.gtwo.bdss_system.enums.StatusDonation;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.sql.Date;

@Data
public class AccountUpdateDTO {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private Date dateOfBirth;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(0[0-9]{9})$", message = "Phone number must start with 0 and have 10 digits")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    private Long bloodTypeId;

    @NotNull(message = "Status donation is required")
    private StatusDonation statusDonation;
}

