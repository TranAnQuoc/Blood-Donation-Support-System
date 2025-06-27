package com.gtwo.bdss_system.repository.commons;

import com.gtwo.bdss_system.entity.commons.BloodStorageHistory;
import com.gtwo.bdss_system.enums.StatusBloodStorage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodStorageHistoryRepository extends JpaRepository<BloodStorageHistory, Long> {
    List<BloodStorageHistory> findByBloodStatus(StatusBloodStorage status);
}
