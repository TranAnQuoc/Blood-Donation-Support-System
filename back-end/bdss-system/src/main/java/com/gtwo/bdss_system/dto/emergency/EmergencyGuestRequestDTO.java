package com.gtwo.bdss_system.dto.emergency;

import lombok.Data;

import java.util.Date;

@Data
public class EmergencyGuestRequestDTO {
    private String fullName;
    private String phone;
    private Date dateOfBirth;
    private String CCCD;
    private Long bloodTypeId;
    private Long bloodComponentId;
    private Integer quantity;
    private String location;
}

