package com.gtwo.bdss_system.dto.auth;

import lombok.Data;

@Data
public class LoginRequest {
    String email;
    String password;
}
