package com.gtwo.bdss_system.dto.transfusion;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransfusionCancelDTO {
    @NotNull(message = "userId không được để trống")
    private Long userId;

}
