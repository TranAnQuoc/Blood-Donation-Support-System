package com.gtwo.bdss_system.repository.commons;

import com.gtwo.bdss_system.entity.commons.BloodStorage;
import com.gtwo.bdss_system.enums.StatusBloodStorage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodStorageRepository extends JpaRepository<BloodStorage,Long> {
    List<BloodStorage> findByBloodStatus(StatusBloodStorage status);
}
