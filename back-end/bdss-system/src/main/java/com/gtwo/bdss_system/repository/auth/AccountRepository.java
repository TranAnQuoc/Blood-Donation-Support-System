package com.gtwo.bdss_system.repository.auth;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findAllByRole(Role role);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByCCCD(String cccd);
}
