package com.gtwo.bdss_system.repository.auth;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.enums.StatusDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findAllByRole(Role role);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByCCCD(String cccd);
    @Query("SELECT a FROM Account a WHERE a.statusDonation = :status AND a.bloodType.type = :type AND a.bloodType.rhFactor = :rh AND a.address LIKE %:location%")
    List<Account> searchAvailableDonorsByTypeAndRh(@Param("status") StatusDonation status, @Param("type") String type, @Param("rh") String rhFactor, @Param("location") String location);
    @Query("SELECT a FROM Account a WHERE a.statusDonation = :status AND a.bloodType.type = :type AND a.address LIKE %:location%")
    List<Account> searchAvailableDonorsByType(@Param("status") StatusDonation status, @Param("type") String type, @Param("location") String location);
}
