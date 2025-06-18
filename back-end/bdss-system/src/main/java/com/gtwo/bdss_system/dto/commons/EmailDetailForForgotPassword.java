package com.gtwo.bdss_system.dto.commons;

import com.gtwo.bdss_system.entity.auth.Account;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailDetailForForgotPassword {
    private Account account;
    private String subject;
    private String link;
}
