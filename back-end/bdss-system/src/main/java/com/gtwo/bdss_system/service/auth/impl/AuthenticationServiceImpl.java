package com.gtwo.bdss_system.service.auth.impl;

import com.gtwo.bdss_system.dto.auth.AccountResponse;
import com.gtwo.bdss_system.dto.auth.ForgotPasswordRequest;
import com.gtwo.bdss_system.dto.auth.LoginRequest;
import com.gtwo.bdss_system.dto.auth.RegisterRequest;
import com.gtwo.bdss_system.dto.commons.EmailDetailForForgotPassword;
import com.gtwo.bdss_system.dto.commons.EmailDetailForRegister;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusDonation;
import com.gtwo.bdss_system.exception.exceptions.AuthenticationException;
import com.gtwo.bdss_system.repository.auth.AuthenticationRepository;
import com.gtwo.bdss_system.service.auth.AuthenticationService;
import com.gtwo.bdss_system.service.auth.TokenService;
import com.gtwo.bdss_system.service.commons.BloodTypeService;
import com.gtwo.bdss_system.service.commons.EmailService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    @Autowired
    AuthenticationRepository authenticationRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    TokenService tokenService;

    @Autowired
    BloodTypeService bloodTypeService;

    @Autowired
    private EmailService emailService;

    @Override
    public Account register(RegisterRequest dto) {
        if (authenticationRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (authenticationRepository.existsByPhone(dto.getPhone())) {
            throw new IllegalArgumentException("Phone number already in use");
        }
        if (authenticationRepository.existsByCCCD(dto.getCccd())) {
            throw new IllegalArgumentException("CCCD already in use");
        }
        if (!dto.getCccd().matches("\\d{12}")) {
            throw new IllegalArgumentException("CCCD must be exactly 12 digits");
        }
        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setPassword(passwordEncoder.encode(dto.getPassword()));
        account.setFullName(dto.getFullName());
        account.setGender(dto.getGender());
        account.setDateOfBirth(dto.getDateOfBirth());
        account.setPhone(dto.getPhone());
        account.setAddress(dto.getAddress());
        account.setCCCD(dto.getCccd());
        account.setRole(Role.MEMBER);
        account.setStatus(Status.ACTIVE);
        account.setStatusDonation(StatusDonation.INACTIVE);
        if (dto.getBloodTypeId() != null) {
            BloodType bloodType = bloodTypeService.findById(dto.getBloodTypeId());
            account.setBloodType(bloodType);
        }
        EmailDetailForRegister emailDetailForRegister = new EmailDetailForRegister();
        emailDetailForRegister.setToEmail(dto.getEmail());
        emailDetailForRegister.setSubject("Welcome to BDS System");
        emailService.sendRegisterSuccessEmail(emailDetailForRegister);
        return authenticationRepository.save(account);
    }

    public AccountResponse login(LoginRequest loginRequest){
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            ));
        } catch (Exception e) {
            System.out.println("Error");
            throw new AuthenticationException("Invalid username or password");
        }
        Account account = authenticationRepository.findAccountByEmail(loginRequest.getEmail());
        AccountResponse accountResponse = modelMapper.map(account, AccountResponse.class);
        String token = tokenService.generateToken(account);
        accountResponse.setToken(token);
        return accountResponse;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return (UserDetails) authenticationRepository.findAccountByEmail(email);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        Account account = authenticationRepository.findAccountByEmail(request.getEmail());
        if (account == null) {
            throw new IllegalArgumentException("Tài khoản không tồn tại");
        } else {
            EmailDetailForForgotPassword emailDetailForForgotPassword = new EmailDetailForForgotPassword();
            emailDetailForForgotPassword.setAccount(account);
            emailDetailForForgotPassword.setSubject("Reset Password");
            emailDetailForForgotPassword.setLink("https://hocalhost:5173/reset-password?token=" + tokenService.generateToken(account));
            emailService.sendResetPasswordEmail(emailDetailForForgotPassword);
        }
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        Account account = tokenService.extractAccount(token);
        if (account == null) {
            throw new IllegalArgumentException("Invalid or expired token");
        }
        account.setPassword(passwordEncoder.encode(newPassword));
        authenticationRepository.save(account);
    }
}
