package com.gtwo.bdss_system.repository.donation;

import com.gtwo.bdss_system.entity.donation.DonationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DonationRequestRepository extends JpaRepository<DonationRequest, Long> {
    @Query("SELECT COUNT(r) FROM DonationRequest r WHERE r.schedule.id = :scheduleId AND r.statusRequest = 'APPROVED'")
    int countScheduleIdInRequest(@Param("scheduleId") Long scheduleId);
    boolean existsByDonorId(Long donorId);
}
