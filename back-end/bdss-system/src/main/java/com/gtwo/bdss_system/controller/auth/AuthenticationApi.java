package com.gtwo.bdss_system.controller.auth;

import com.gtwo.bdss_system.dto.auth.AccountResponse;
import com.gtwo.bdss_system.dto.auth.LoginRequest;
import com.gtwo.bdss_system.dto.auth.RegisterRequest;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.repository.auth.AuthenticationRepository;
import com.gtwo.bdss_system.service.auth.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthenticationApi {
    @Autowired
    AuthenticationRepository authenticationRepository;
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/api/register")
    public ResponseEntity register(@RequestBody RegisterRequest account) {
        System.out.println("Blood type ID: " + account.getBloodTypeId());
        Account newAccount = authenticationService.register(account);
        return ResponseEntity.ok(newAccount);
    }

    @PostMapping("/api/login")
    public ResponseEntity login(@RequestBody LoginRequest loginRequest) {
        AccountResponse account = authenticationService.login(loginRequest);
        return ResponseEntity.ok(account);
    }
}
