package com.gtwo.bdss_system.service.commons.impl;

import com.gtwo.bdss_system.dto.auth.AccountCreateDTO;
import com.gtwo.bdss_system.dto.commons.EmailDetailForDonationApproved;
import com.gtwo.bdss_system.dto.commons.EmailDetailForForgotPassword;
import com.gtwo.bdss_system.dto.commons.EmailDetailForRegister;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.service.commons.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${bdss.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Override
    public void sendRegisterSuccessEmail(EmailDetailForRegister emailDetail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(emailDetail.getToEmail());
        message.setSubject(emailDetail.getSubject());
        String loginLink = "http://localhost:5173/login";
        String body = String.format("""
                Xin chào!

                Tài khoản của bạn đã được đăng ký thành công với địa chỉ email: %s

                Chúng tôi rất vui khi được đồng hành cùng bạn. Hãy đăng nhập vào hệ thống để bắt đầu sử dụng dịch vụ.

                %s

                Trân trọng,
                Hệ thống hỗ trợ
                """, emailDetail.getToEmail(), loginLink);
        message.setText(body);
        sendIfEnabled(message);
    }

    @Override
    public void sendResetPasswordEmail(EmailDetailForForgotPassword emailDetailForForgotPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
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
        sendIfEnabled(message);
    }

    @Override
    public void sendLoginStaffAccount(AccountCreateDTO emailDetail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(emailDetail.getEmailOwner());
        message.setSubject("Thông tin đăng nhập tài khoản Staff");
        String loginLink = "http://localhost:5173/login";

        String body = String.format("""
                Xin chào %s,

                Tài khoản staff của bạn đã được tạo thành công.

                Vui lòng sử dụng thông tin đăng nhập sau để truy cập hệ thống:

                Email đăng nhập: %s
                Mật khẩu: %s

                Đường dẫn đăng nhập: %s

                Sau khi đăng nhập, bạn nên đổi mật khẩu để đảm bảo bảo mật.

                Trân trọng,
                Hệ thống hỗ trợ
                """, emailDetail.getFullName(), emailDetail.getEmail(), emailDetail.getPassword(), loginLink);

        message.setText(body);
        sendIfEnabled(message);
    }

    @Override
    public void sendReminderEmail(Account donor, LocalDate nextDate) {
        String body = String.format("""
                Xin chào %s,

                Bạn đã đủ điều kiện để hiến máu tiếp theo kể từ ngày: %s.
                Vui lòng đặt lịch hẹn để tiếp tục hỗ trợ cộng đồng nhé!

                Trân trọng,
                Hệ thống hỗ trợ
                """, donor.getFullName(), nextDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(donor.getEmail());
        message.setSubject("Nhắc nhở hiến máu lần tiếp theo");
        message.setText(body);

        sendIfEnabled(message);
    }

    @Override
    public void sendDonationApprovedEmail(EmailDetailForDonationApproved detail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(detail.getToEmail());
        message.setSubject(detail.getSubject());

        String formattedDate = detail.getDonationDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        String formattedStart = detail.getStartTime().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm"));
        String formattedEnd = detail.getEndTime().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm"));

        String body = String.format("""
                Xin chào %s,

                Đơn đăng ký hiến máu của bạn tại sự kiện "%s" đã được hệ thống phê duyệt thành công.

                Thời gian: %s từ %s đến %s
                Địa điểm: %s

                Vui lòng đến đúng giờ và mang theo giấy tờ tùy thân.

                Trân trọng,
                Hệ thống hỗ trợ
                """, detail.getDonorName(), detail.getEventName(), formattedDate, formattedStart, formattedEnd, detail.getLocation());

        message.setText(body);
        sendIfEnabled(message);
    }

    private void sendIfEnabled(SimpleMailMessage message) {
        if (!mailEnabled) {
            log.info("Bỏ qua gửi email vì bdss.mail.enabled=false. To={}", String.join(",", message.getTo()));
            return;
        }
        mailSender.send(message);
    }
}
