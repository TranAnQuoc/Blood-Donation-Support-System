package com.gtwo.bdss_system.repository.commons;

import com.gtwo.bdss_system.entity.commons.MedicalFacility;
import com.gtwo.bdss_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalFacilityRepository extends JpaRepository<MedicalFacility, Long> {
    List<MedicalFacility> findByStatus(Status status);
    boolean existsByNameAndAddressAndPhone(String name, String address, String phone);
}
