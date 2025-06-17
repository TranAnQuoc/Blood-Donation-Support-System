package com.gtwo.bdss_system.repository.donation;

import com.gtwo.bdss_system.entity.donation.DonationRequest;
import com.gtwo.bdss_system.enums.StatusRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DonationRequestRepository extends JpaRepository<DonationRequest, Long> {
    @Query("SELECT COUNT(r) FROM DonationRequest r WHERE r.schedule.id = :scheduleId AND r.statusRequest = 'APPROVED'")
    int countScheduleIdInRequest(@Param("scheduleId") Long scheduleId);
    boolean existsByDonorId(Long donorId);
    List<DonationRequest> findByStatusRequest(StatusRequest statusRequest);
}
