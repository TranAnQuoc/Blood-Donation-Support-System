package com.gtwo.bdss_system.dto.commons;

import com.gtwo.bdss_system.enums.StatusBloodStorage;
import lombok.Data;

@Data
public class ApproveRequestDTO {
    private StatusBloodStorage status;
    private String note;
}
