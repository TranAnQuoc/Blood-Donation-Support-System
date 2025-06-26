package com.gtwo.bdss_system.repository.commons;

import com.gtwo.bdss_system.entity.commons.BloodStorage;
import com.gtwo.bdss_system.enums.StatusBloodStorage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodStorageRepository extends JpaRepository<BloodStorage,Long> {
    List<BloodStorage> findByBloodType_NameAndBloodComponent_NameAndBloodStatus(String bloodType, String component, StatusBloodStorage status);
    List<BloodStorage> findByBloodStatusIn(List<StatusBloodStorage> statuses);
}
