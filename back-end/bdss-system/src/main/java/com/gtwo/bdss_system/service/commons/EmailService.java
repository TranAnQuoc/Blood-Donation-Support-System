package com.gtwo.bdss_system.service.commons;

import com.gtwo.bdss_system.dto.commons.EmailDetailForForgotPassword;
import com.gtwo.bdss_system.dto.commons.EmailDetailForRegister;

public interface EmailService {
    void sendRegisterSuccessEmail(EmailDetailForRegister emailDetail);
    void sendResetPasswordEmail(EmailDetailForForgotPassword emailDetailForForgotPassword);
}
