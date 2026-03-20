package com.gtwo.bdss_system.repository.emergency;

import com.gtwo.bdss_system.entity.emergency.EmergencyHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmergencyHistoryRepository extends JpaRepository<EmergencyHistory, Long> {
    List<EmergencyHistory> findByDeleteFalse();
    List<EmergencyHistory> findByDeleteTrue();
    Optional<EmergencyHistory> findByEmergencyRequest_IdAndDeleteFalse(Long requestId);

}