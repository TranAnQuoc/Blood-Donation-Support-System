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
    @Query("""
                SELECT a 
                FROM Account a 
                WHERE a.statusDonation = :statusDonation
                  AND a.bloodType.type = :bloodTypeName
                  AND LOWER(a.address) LIKE LOWER(CONCAT('%', :location, '%'))
            """)
    List<Account> searchAvailableDonors(
            @Param("statusDonation") StatusDonation statusDonation,
            @Param("bloodTypeName") String bloodTypeName,
            @Param("location") String location
    );
}
