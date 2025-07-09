package com.gtwo.bdss_system.service.commons;

import com.gtwo.bdss_system.dto.commons.*;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodStorage;
import com.gtwo.bdss_system.enums.StatusBloodStorage;

import java.util.List;

public interface BloodStorageService {
    BloodStorage create(BloodStorageDTO dto, Account creater);

    BloodStorage approve(Long id, ApproveRequestDTO dto, Account approver);

    BloodStorage use(Long id, BloodStorageUseDTO useDto, Account user);

    BloodStorage verify(Long id, VerifiedNote verifiedNote,Account verifier);

    List<BloodStorageResponseDTO> getAll();

    List<BloodStorageResponseDTO> getByStatus(StatusBloodStorage status);

    List<BloodStorageResponseDTO> searchByTypeRhComponent(Long bloodTypeId, Long bloodComponentId);
}
