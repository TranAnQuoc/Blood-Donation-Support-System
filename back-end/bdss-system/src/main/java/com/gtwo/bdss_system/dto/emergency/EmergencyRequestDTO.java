package com.gtwo.bdss_system.dto.emergency;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.StatusRequest;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EmergencyRequestDTO {
    private Long requesterId;
    private Long bloodTypeId;
    private Long bloodComponentId;
    private Integer quantity;
    private String location;
}
