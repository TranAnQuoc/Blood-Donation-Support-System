package com.gtwo.bdss_system.dto.transfusion;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TransfusionRequestDTO {

    @NotNull
    private Long recipientId;

    @NotNull @Size(max = 50)
    private String bloodComponentNeeded;

    @NotNull @Min(1)
    private Integer quantityNeeded;

    @Size(max = 65535)
    private String doctorDiagnosis;

    @Size(max = 65535)
    private String preCheckNotes;

}