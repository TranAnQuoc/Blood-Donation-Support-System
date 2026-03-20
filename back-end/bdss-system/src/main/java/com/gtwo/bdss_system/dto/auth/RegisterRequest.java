package com.gtwo.bdss_system.dto.auth;

import com.gtwo.bdss_system.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.sql.Date;

@Data
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "CCCD is required")
    private String cccd;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Blood type is required")
    private Long bloodTypeId;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private Date dateOfBirth;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(0[0-9]{9})$", message = "Phone number must start with 0 and have 10 digits")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;
}
