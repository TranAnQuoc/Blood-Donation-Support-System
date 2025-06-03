package com.gtwo.bdss_system.repository;

import com.gtwo.bdss_system.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthenticationRepository extends JpaRepository<Account, Long> {
    Account findAccountByEmail(String email);
}
