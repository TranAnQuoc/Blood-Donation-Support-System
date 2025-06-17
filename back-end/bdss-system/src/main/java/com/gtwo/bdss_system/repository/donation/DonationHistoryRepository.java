package com.gtwo.bdss_system.repository.donation;

import com.gtwo.bdss_system.entity.donation.DonationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DonationHistoryRepository extends JpaRepository<DonationHistory, Long> {
    Optional<DonationHistory> findFirstByDonor_IdOrderByDonationDateDesc(Long donorId);
}
