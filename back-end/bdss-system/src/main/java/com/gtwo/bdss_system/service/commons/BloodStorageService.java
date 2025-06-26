package com.gtwo.bdss_system.service.commons;

import com.gtwo.bdss_system.dto.commons.BloodStorageDTO;
import com.gtwo.bdss_system.dto.commons.BloodStorageUseDTO;
import com.gtwo.bdss_system.entity.commons.BloodStorage;

import java.util.List;

public interface BloodStorageService {
    BloodStorage create(BloodStorageDTO dto);

    BloodStorage approve(Long id, Long approverId);

    BloodStorage use(Long id, BloodStorageUseDTO useDto);

    BloodStorage verify(Long id, Long verifierId);

    List<BloodStorage> getAll();

    List<BloodStorage> getAvailable(String bloodType, String component);

    List<BloodStorage> getHistory();
}
