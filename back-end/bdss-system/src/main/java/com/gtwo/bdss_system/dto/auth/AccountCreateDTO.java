package com.gtwo.bdss_system.dto.auth;

import com.gtwo.bdss_system.enums.Gender;
import com.gtwo.bdss_system.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.sql.Date;

@Data
public class AccountCreateDTO {

    private String subject;

    @NotBlank(message = "Email người tạo là bắt buộc")
    @Email(message = "Email người tạo không đúng định dạng")
    private String emailOwner;

    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Mật khẩu là bắt buộc")
    private String password;

    @NotBlank(message = "CCCD là bắt buộc")
    @Pattern(regexp = "^\\d{12}$", message = "CCCD phải có đúng 12 chữ số")
    private String CCCD;

    @NotBlank(message = "Họ và tên là bắt buộc")
    private String fullName;

    @NotNull(message = "Giới tính là bắt buộc")
    private Gender gender;

    @NotNull(message = "Vai trò là bắt buộc")
    private Role role;

    @NotNull(message = "Nhóm máu là bắt buộc")
    private Long bloodTypeId;

    @NotNull(message = "Ngày sinh là bắt buộc")
    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    private Date dateOfBirth;

    @NotBlank(message = "Số điện thoại là bắt buộc")
    @Pattern(regexp = "^(0[0-9]{9})$", message = "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số")
    private String phone;

    @NotBlank(message = "Địa chỉ là bắt buộc")
    private String address;
}
