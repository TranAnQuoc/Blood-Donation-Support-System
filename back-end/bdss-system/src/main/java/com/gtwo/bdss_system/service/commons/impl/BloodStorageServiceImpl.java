package com.gtwo.bdss_system.service.commons.impl;

import com.gtwo.bdss_system.dto.commons.BloodStorageDTO;
import com.gtwo.bdss_system.dto.commons.BloodStorageUseDTO;
import com.gtwo.bdss_system.dto.commons.VerifiedNote;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodStorage;
import com.gtwo.bdss_system.entity.commons.BloodStorageHistory;
import com.gtwo.bdss_system.enums.StatusBloodStorage;
import com.gtwo.bdss_system.enums.StatusVerified;
import com.gtwo.bdss_system.repository.auth.AccountRepository;
import com.gtwo.bdss_system.repository.commons.BloodComponentRepository;
import com.gtwo.bdss_system.repository.commons.BloodStorageRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
import com.gtwo.bdss_system.service.commons.BloodStorageHistoryService;
import com.gtwo.bdss_system.service.commons.BloodStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BloodStorageServiceImpl implements BloodStorageService {

    @Autowired
    private BloodStorageRepository repository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BloodTypeRepository bloodTypeRepository;

    @Autowired
    private BloodComponentRepository bloodComponentRepository;

    @Autowired
    private BloodStorageHistoryService historyService;

    @Override
    public BloodStorage create(BloodStorageDTO dto, Account creater) {
        BloodStorage entity = new BloodStorage();
        entity.setDonor(accountRepository.findById(dto.getDonorId()).orElseThrow());
        entity.setBloodType(bloodTypeRepository.findById(dto.getBloodTypeId()).orElseThrow());
        entity.setBloodComponent(bloodComponentRepository.findById(dto.getComponentId()).orElseThrow());
        entity.setQuantity(dto.getQuantity());
        entity.setCreateAt(LocalDateTime.now());
        entity.setCreatedBy(creater);
        entity.setBloodStatus(StatusBloodStorage.PENDING);
        return repository.save(entity);
    }

    @Override
    public BloodStorage approve(Long id, Account approver) {
        BloodStorage storage = repository.findById(id).orElseThrow();
        storage.setBloodStatus(StatusBloodStorage.STORED);
        storage.setApprovedAt(LocalDateTime.now());
        storage.setApprovedBy(approver);
        return repository.save(storage);
    }

    @Override
    public BloodStorage use(Long id, BloodStorageUseDTO useDto, Account user) {
        BloodStorage storage = repository.findById(id).orElseThrow();
        if (storage.getBloodStatus() != StatusBloodStorage.STORED)
            throw new IllegalStateException("Túi máu không sẵn sàng để sử dụng.");
        StatusBloodStorage status = useDto.getStatus();
        if (status != StatusBloodStorage.IN_USED && status != StatusBloodStorage.TRANSFERRED) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ. Chỉ được chọn IN_USED hoặc TRANSFERRED.");
        }
        storage.setBloodStatus(status);
        storage.setUsageReason(useDto.getReason());
        storage.setTakeBy(user);
        storage.setTakeAt(LocalDateTime.now());
        return repository.save(storage);
    }

    @Override
    public BloodStorage verify(Long id, VerifiedNote verifiedNote,Account verifier) {
        BloodStorage storage = repository.findById(id).orElseThrow();
        storage.setVerifiedAt(LocalDateTime.now());
        storage.setVerifiedBy(verifier);
        storage.setVerifiedStatus(verifiedNote.getStatus());
        storage.setVerifiedNote(verifiedNote.getVerifiedNote());
        if (storage.getVerifiedStatus() == StatusVerified.CONFIRMED
                || storage.getVerifiedStatus() == StatusVerified.UNCONFIRMED) {
            historyService.createSnapshot(storage);
        }
        return repository.save(storage);
    }

    @Override
    public List<BloodStorage> getAll() {
        return repository.findAll();
    }

    @Override
    public List<BloodStorage> getByStatus(StatusBloodStorage status) {
        return repository.findByBloodStatus(status);
    }
}
