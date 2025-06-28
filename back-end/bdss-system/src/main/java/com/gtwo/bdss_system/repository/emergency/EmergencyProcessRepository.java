package com.gtwo.bdss_system.repository.emergency;

import com.gtwo.bdss_system.entity.emergency.EmergencyProcess;
import com.gtwo.bdss_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmergencyProcessRepository extends JpaRepository<EmergencyProcess, Long> {
    List<EmergencyProcess> findByAssignedStaff_Id(Long staffId);
    List<EmergencyProcess> findByStatusAvailable(Status status);

}


