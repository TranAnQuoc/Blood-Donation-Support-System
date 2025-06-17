package com.gtwo.bdss_system.service.auth.impl;

import com.gtwo.bdss_system.dto.auth.AccountResponse;
import com.gtwo.bdss_system.dto.auth.LoginRequest;
import com.gtwo.bdss_system.dto.auth.RegisterRequest;
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

    @Override
    public Account register(RegisterRequest dto) {
        if (authenticationRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (authenticationRepository.existsByPhone(dto.getPhone())) {
            throw new IllegalArgumentException("Phone number already in use");
        }
        if (authenticationRepository.existsByCCCD(dto.getCCCD())) {
            throw new IllegalArgumentException("CCCD already in use");
        }
        if (!dto.getCCCD().matches("\\d{12}")) {
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
        account.setCCCD(dto.getCCCD());
        account.setRole(Role.MEMBER);
        account.setStatus(Status.ACTIVE);
        account.setStatusDonation(StatusDonation.AVAILABLE);
        if (dto.getBloodTypeId() != null) {
            BloodType bloodType = bloodTypeService.findById(dto.getBloodTypeId());
            account.setBloodType(bloodType);
        }
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
}
