package com.gtwo.bdss_system.dto.transfusion;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransfusionRequestDTO {

    private String bloodComponentNeeded;

    private Integer quantityNeeded;

    private String doctorDiagnosis;

    private String preCheckNotes;

}
