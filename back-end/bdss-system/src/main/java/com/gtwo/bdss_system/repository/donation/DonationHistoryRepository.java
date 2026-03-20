package com.gtwo.bdss_system.repository.donation;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.donation.DonationHistory;
import com.gtwo.bdss_system.enums.StatusProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DonationHistoryRepository extends JpaRepository<DonationHistory, Long> {
    List<DonationHistory> findAllByDonor_IdOrderByDonationDateDesc(Long donorId);
    List<DonationHistory> findByStatus(StatusProcess status);;
    List<DonationHistory> findByDonorAndStatus(Account donor, StatusProcess status);
    @Query("SELECT COUNT(h) FROM DonationHistory h " +
            "WHERE h.donor.id = :accountId " +
            "AND h.status = :status")
    Long countCompletedByAccount(@Param("accountId") Long accountId,
                                 @Param("status") StatusProcess status);
}
