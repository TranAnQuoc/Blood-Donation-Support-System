package com.gtwo.bdss_system.service.commons;

import com.gtwo.bdss_system.dto.commons.BloodStorageDTO;
import com.gtwo.bdss_system.dto.commons.BloodStorageUseDTO;
import com.gtwo.bdss_system.dto.commons.VerifiedNote;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodStorage;
import com.gtwo.bdss_system.enums.StatusBloodStorage;

import java.util.List;

public interface BloodStorageService {
    BloodStorage create(BloodStorageDTO dto, Account creater);

    BloodStorage approve(Long id, Account approver);

    BloodStorage use(Long id, BloodStorageUseDTO useDto);

    BloodStorage verify(Long id, VerifiedNote verifiedNote,Account verifier);

    List<BloodStorage> getAll();

    List<BloodStorage> getByStatus(StatusBloodStorage status);
}
