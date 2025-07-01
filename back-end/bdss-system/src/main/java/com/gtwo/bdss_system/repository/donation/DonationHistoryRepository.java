package com.gtwo.bdss_system.repository.donation;

import com.gtwo.bdss_system.entity.donation.DonationHistory;
import com.gtwo.bdss_system.enums.StatusProcess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationHistoryRepository extends JpaRepository<DonationHistory, Long> {
    List<DonationHistory> findAllByDonor_IdOrderByDonationDateDesc(Long donorId);
    List<DonationHistory> findByStatus(StatusProcess status);;
}
