package com.gtwo.bdss_system.dto.commons;

import com.gtwo.bdss_system.enums.FacilityStatus;
import com.gtwo.bdss_system.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class MedicalDTO {
    @NotBlank(message = "Tên cơ sở không được để trống")
    private String name;
    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^(0[3|5|7|8|9]|84[3|5|7|8|9])[0-9]{8}$",
            message = "Số điện thoại không hợp lệ"
    )
    private String phone;
    @NotBlank(message = "Khu vực không được để trống")
    private String region;
    @NotNull(message = "Trạng thái hoạt động cơ sở không được để trống")
    private FacilityStatus facilityStatus;
    @NotNull(message = "Trạng thái cơ sở không được để trống")
    private Status status;
}
