package com.gtwo.bdss_system.dto.commons;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailDetailForRegister {
    String toEmail;
    String fullName;
    String subject;
    String link;
}
