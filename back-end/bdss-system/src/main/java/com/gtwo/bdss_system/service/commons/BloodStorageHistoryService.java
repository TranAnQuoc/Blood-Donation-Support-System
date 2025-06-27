package com.gtwo.bdss_system.service.commons;

import com.gtwo.bdss_system.entity.commons.BloodStorage;
import com.gtwo.bdss_system.entity.commons.BloodStorageHistory;
import com.gtwo.bdss_system.enums.StatusBloodStorage;

import java.util.List;

public interface BloodStorageHistoryService {
    List<BloodStorageHistory> getAll();
    BloodStorageHistory getById(Long id);
    List<BloodStorageHistory> getByStatus(StatusBloodStorage status);
    void createSnapshot(BloodStorage storage);
}
