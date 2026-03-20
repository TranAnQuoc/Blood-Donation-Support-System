package com.gtwo.bdss_system.dto.commons;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BloodStorageDTO {

    @NotNull(message = "Người hiến máu không được để trống")
    private Long donorId;

    @NotNull(message = "Nhóm máu không được để trống")
    private Long bloodTypeId;

    @NotNull(message = "Thành phần máu không được để trống")
    private Long componentId;

    @NotNull(message = "Lượng máu không được để trống")
    @Min(value = 200, message = "Lượng máu tối thiểu là 200ml")
    @Max(value = 500, message = "Lượng máu tối đa là 500ml")
    private Integer quantity;

    @AssertTrue(message = "Nhóm máu không được là 'Không xác định'")
    public boolean isValidBloodType() {
        return bloodTypeId != null && bloodTypeId != 1;
    }

    @AssertTrue(message = "Thành phần máu không được là 'Không xác định'")
    public boolean isValidComponent() {
        return componentId != null && componentId != 1;
    }
}