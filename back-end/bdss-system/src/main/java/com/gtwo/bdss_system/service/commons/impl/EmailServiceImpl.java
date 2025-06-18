package com.gtwo.bdss_system.service.commons.impl;

import com.gtwo.bdss_system.dto.commons.EmailDetailForForgotPassword;
import com.gtwo.bdss_system.dto.commons.EmailDetailForRegister;
import com.gtwo.bdss_system.service.commons.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendRegisterSuccessEmail(EmailDetailForRegister emailDetail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("demofortest999@gmail.com");
        message.setTo(emailDetail.getToEmail());
        message.setSubject(emailDetail.getSubject());

        String body = String.format("""
            Xin chào %s,

            Tài khoản của bạn đã được đăng ký thành công với địa chỉ email: %s

            Chúng tôi rất vui khi được đồng hành cùng bạn. Hãy đăng nhập vào hệ thống để bắt đầu sử dụng dịch vụ.

            %s

            Trân trọng,
            Hệ thống hỗ trợ
            """,
                emailDetail.getFullName(),
                emailDetail.getToEmail(),
                emailDetail.getLink() != null ? "Trang đăng nhập: " + emailDetail.getLink() : "");

        message.setText(body);
        mailSender.send(message);
    }

    @Override
    public void sendResetPasswordEmail(EmailDetailForForgotPassword emailDetailForForgotPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("demofortest999@gmail.com"); // hoặc để Spring tự lấy từ config
        message.setTo(emailDetailForForgotPassword.getAccount().getEmail());
        message.setSubject(emailDetailForForgotPassword.getSubject());

        String body = String.format("""
                Xin chào %s,

                Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào liên kết bên dưới để tiếp tục:

                %s

                Nếu bạn không yêu cầu, vui lòng bỏ qua email này.

                Trân trọng,
                Hệ thống hỗ trợ
                """, emailDetailForForgotPassword.getAccount().getFullName(), emailDetailForForgotPassword.getLink());

        message.setText(body);
        mailSender.send(message);
    }
}
