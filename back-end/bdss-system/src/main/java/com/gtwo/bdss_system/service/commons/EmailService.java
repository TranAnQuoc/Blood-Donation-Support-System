package com.gtwo.bdss_system.service.commons;

import com.gtwo.bdss_system.dto.auth.AccountCreateDTO;
import com.gtwo.bdss_system.dto.commons.EmailDetailForForgotPassword;
import com.gtwo.bdss_system.dto.commons.EmailDetailForRegister;
import com.gtwo.bdss_system.entity.auth.Account;

import java.time.LocalDate;

public interface EmailService {
    void sendRegisterSuccessEmail(EmailDetailForRegister emailDetail);
    void sendResetPasswordEmail(EmailDetailForForgotPassword emailDetailForForgotPassword);
    void sendLoginStaffAccount(AccountCreateDTO emailDetail);
    void sendReminderEmail(Account donor, LocalDate nextDate);
}
