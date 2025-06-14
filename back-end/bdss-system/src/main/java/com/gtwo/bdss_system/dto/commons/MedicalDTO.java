package com.gtwo.bdss_system.dto.commons;

import com.gtwo.bdss_system.enums.Status;
import lombok.Data;

@Data
public class MedicalDTO {
    private String name;
    private String address;
    private String phone;
    private String region;
    private Status status;
}
