package com.gtwo.bdss_system.repository.emergency;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> {
    boolean existsByPhone(String phone);
    boolean existsByCccd(String cccd);
    boolean existsByCccdAndSubmittedAtAfter(String cccd, LocalDateTime dateTime);
    boolean existsByPhoneAndSubmittedAtAfter(String phone, LocalDateTime dateTime);
    List<EmergencyRequest> findByStatus(Status status);
    Optional<EmergencyRequest> findByIdAndStatus(Long id, Status status);
    Optional<EmergencyRequest> findByFullNameAndPhoneAndStatus(String fullName, String phone, Status status);

}

