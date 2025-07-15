package com.gtwo.bdss_system.repository.commons;

import com.gtwo.bdss_system.entity.commons.EmergencyHotline;
import com.gtwo.bdss_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmergencyHotlineRepository extends JpaRepository<EmergencyHotline, Long> {
    List<EmergencyHotline> findByStatus(Status status);
    List<EmergencyHotline> findByAddressAndStatus(String address, Status status);
    boolean existsByName(String name);
}
