package com.gtwo.bdss_system.service.commons.impl;

import com.gtwo.bdss_system.dto.commons.BloodStorageDTO;
import com.gtwo.bdss_system.dto.commons.BloodStorageUseDTO;
import com.gtwo.bdss_system.entity.commons.BloodStorage;
import com.gtwo.bdss_system.enums.StatusBloodStorage;
import com.gtwo.bdss_system.repository.auth.AccountRepository;
import com.gtwo.bdss_system.repository.commons.BloodComponentRepository;
import com.gtwo.bdss_system.repository.commons.BloodStorageRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
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

    @Override
    public BloodStorage create(BloodStorageDTO dto) {
        BloodStorage entity = new BloodStorage();
        entity.setDonor(accountRepository.findById(dto.getDonorId()).orElseThrow());
        entity.setBloodType(bloodTypeRepository.findById(dto.getBloodTypeId()).orElseThrow());
        entity.setBloodComponent(bloodComponentRepository.findById(dto.getComponentId()).orElseThrow());
        entity.setQuantity(dto.getQuantity());
        entity.setCreateAt(LocalDateTime.now());
        entity.setCreatedBy(accountRepository.findById(dto.getCreatedBy()).orElseThrow());
        entity.setBloodStatus(StatusBloodStorage.PENDING);
        return repository.save(entity);
    }

    @Override
    public BloodStorage approve(Long id, Long approverId) {
        BloodStorage storage = repository.findById(id).orElseThrow();
        storage.setBloodStatus(StatusBloodStorage.STORED);
        storage.setApprovedAt(LocalDateTime.now());
        storage.setApprovedBy(accountRepository.findById(approverId).orElseThrow());
        return repository.save(storage);
    }

    @Override
    public BloodStorage use(Long id, BloodStorageUseDTO useDto) {
        BloodStorage storage = repository.findById(id).orElseThrow();
        if (storage.getBloodStatus() != StatusBloodStorage.STORED)
            throw new IllegalStateException("Túi máu không sẵn sàng để sử dụng.");

        storage.setBloodStatus(StatusBloodStorage.IN_USED);
        storage.setUsageReason(useDto.getReason());
        storage.setTakeBy(accountRepository.findById(useDto.getTakeBy()).orElseThrow());
        storage.setTakeAt(LocalDateTime.now());
        storage.setUseAt(LocalDateTime.now());
        return repository.save(storage);
    }

    @Override
    public BloodStorage verify(Long id, Long verifierId) {
        BloodStorage storage = repository.findById(id).orElseThrow();
        storage.setVerifiedAt(LocalDateTime.now());
        storage.setVerifiedBy(accountRepository.findById(verifierId).orElseThrow());
        return repository.save(storage);
    }

    @Override
    public List<BloodStorage> getAll() {
        return repository.findAll();
    }

    @Override
    public List<BloodStorage> getAvailable(String bloodType, String component) {
        return repository.findByBloodType_NameAndBloodComponent_NameAndBloodStatus(
                bloodType, component, StatusBloodStorage.STORED);
    }

    @Override
    public List<BloodStorage> getHistory() {
        return repository.findByBloodStatusIn(List.of(StatusBloodStorage.IN_USED, StatusBloodStorage.REJECTED, StatusBloodStorage.EXPIRED));
    }
}
