package com.gtwo.bdss_system.dto.emergency;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class EmergencyRequestDTO {

    private Long id;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải nhỏ hơn ngày hiện tại")
    private Date dateOfBirth;

    @NotBlank(message = "CCCD không được để trống")
    @Pattern(regexp = "^[0-9]{12}$", message = "CCCD phải gồm 12 chữ số")
    private String cccd;

    private LocalDateTime submittedAt;
    private String statusRequest;

    @NotNull(message = "Phải chọn nhóm máu")
    private Long bloodTypeId;

    @NotNull(message = "Phải chọn thành phần máu")
    private Long bloodComponentId;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;

    @NotBlank(message = "Địa điểm không được để trống")
    private String location;
}

