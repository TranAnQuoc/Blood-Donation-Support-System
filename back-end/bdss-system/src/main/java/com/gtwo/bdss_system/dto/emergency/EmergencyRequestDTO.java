package com.gtwo.bdss_system.dto.emergency;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.EmergencyPlace;
import com.gtwo.bdss_system.enums.StatusRequest;
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

    @NotBlank(message = "CCCD không được để trống")
    @Pattern(regexp = "^[0-9]{12}$", message = "CCCD phải gồm 12 chữ số")
    private String cccd;

    private StatusRequest statusRequest;

    @NotNull(message = "Phải chọn nhóm máu")
    private Long bloodTypeId;

    @NotNull(message = "Phải chọn thành phần máu")
    private Long bloodComponentId;


    @Positive(message = "Số lượng máu phải từ 250 ml trở lên")
    @Min(value = 250, message = "Số lượng máu tối thiểu là 250 ml")
    private Integer quantity;


    @NotBlank(message = "Địa điểm không được để trống")
    private String location;

    @NotBlank(message = "Lý do khẩn cấp không được để trống")
    private String emergencyProof;

    private BloodType bloodType;
    private BloodComponent bloodComponent;
    private String bloodT;
    private String bloodC;
    private EmergencyPlace emergencyPlace;
}


