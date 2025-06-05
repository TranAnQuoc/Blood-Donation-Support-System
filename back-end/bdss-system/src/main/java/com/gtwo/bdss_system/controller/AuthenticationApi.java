package com.gtwo.bdss_system.controller;

import com.gtwo.bdss_system.dto.AccountResponse;
import com.gtwo.bdss_system.dto.LoginRequest;
import com.gtwo.bdss_system.entity.Account;
import com.gtwo.bdss_system.repository.AuthenticationRepository;
import com.gtwo.bdss_system.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationApi {
    @Autowired
    AuthenticationRepository authenticationRepository;
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/api/register")
    public ResponseEntity register(@RequestBody Account account) {
        Account newAccount = authenticationService.register(account);
        return ResponseEntity.ok(newAccount);
    }

    @PostMapping("/api/login")
    public ResponseEntity login(@RequestBody LoginRequest loginRequest) {
        AccountResponse account = authenticationService.login(loginRequest);
        return ResponseEntity.ok(account);
    }
}
