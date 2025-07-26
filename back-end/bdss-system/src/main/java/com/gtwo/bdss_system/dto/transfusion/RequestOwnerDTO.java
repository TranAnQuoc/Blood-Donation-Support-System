package com.gtwo.bdss_system.dto.transfusion;

import com.gtwo.bdss_system.enums.Status;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RequestOwnerDTO {
    private Long id;
    private String createrName;
    private String recipientName;
    private String recipientPhone;
    private String description;
    private String address;
    private LocalDateTime requestedAt;
    private Status status;
}
