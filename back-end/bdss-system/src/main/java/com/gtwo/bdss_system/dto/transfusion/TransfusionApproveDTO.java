package com.gtwo.bdss_system.dto.transfusion;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransfusionApproveDTO {
    @NotNull(message = "approverId không được để trống")
    private Long approverId;

    @NotNull(message = "facilityId không được để trống")
    private Long facilityId;

    @NotNull(message = "approve không được để trống")
    private Boolean approve;

}
