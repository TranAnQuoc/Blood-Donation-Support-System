package com.gtwo.bdss_system.dto.commons;

import lombok.Data;

@Data
public class BloodStorageDTO {
    private Long donorId;
    private Long bloodTypeId;
    private Long componentId;
    private Integer quantity;
}