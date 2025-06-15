package com.gtwo.bdss_system.repository.auth;

import com.gtwo.bdss_system.entity.auth.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthenticationRepository extends JpaRepository<Account, Long> {
    Account findAccountByEmail(String email);
}
