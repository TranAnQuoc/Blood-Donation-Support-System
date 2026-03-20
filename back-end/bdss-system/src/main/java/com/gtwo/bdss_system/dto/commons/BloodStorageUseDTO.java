package com.gtwo.bdss_system.dto.commons;

import com.gtwo.bdss_system.enums.StatusBloodStorage;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BloodStorageUseDTO {
    @NotNull(message = "Bắt buộc phải điền lí do!!!")
    private String reason;

    @NotNull(message = "Bắt buộc phải chọn trạng thái.")
    private StatusBloodStorage status;
}