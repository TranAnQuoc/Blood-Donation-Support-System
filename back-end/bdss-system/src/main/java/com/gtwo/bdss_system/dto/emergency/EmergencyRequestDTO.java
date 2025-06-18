package com.gtwo.bdss_system.dto.emergency;

import lombok.Data;

import java.sql.Date;


@Data
public class EmergencyRequestDTO {
    private String fullName;
    private String phone;
    private Date dateOfBirth;
    private String CCCD;
    private Long bloodTypeId;
    private Long bloodComponentId;
    private Integer quantity;
    private String location;
}

