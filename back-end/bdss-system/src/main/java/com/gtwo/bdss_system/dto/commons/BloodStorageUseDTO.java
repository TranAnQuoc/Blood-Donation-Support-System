package com.gtwo.bdss_system.dto.commons;

import com.gtwo.bdss_system.entity.auth.Account;
import lombok.Data;

@Data
public class BloodStorageUseDTO {
    private String reason;
    private Account takeBy;
}