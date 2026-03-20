package com.gtwo.bdss_system.service.commons.impl;

import com.gtwo.bdss_system.entity.commons.BloodStorage;
import com.gtwo.bdss_system.entity.commons.BloodStorageHistory;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.StatusBloodStorage;
import com.gtwo.bdss_system.repository.commons.BloodStorageHistoryRepository;
import com.gtwo.bdss_system.service.commons.BloodStorageHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class BloodStorageHistoryServiceImpl implements BloodStorageHistoryService {

    @Autowired
    private BloodStorageHistoryRepository repository;

    @Override
    public List<BloodStorageHistory> getAll() {
        return repository.findAll();
    }

    @Override
    public BloodStorageHistory getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy lịch sử với id = " + id));
    }

    @Override
    public List<BloodStorageHistory> getByStatus(StatusBloodStorage status) {
        return repository.findByBloodStatus(status);
    }

    @Override
    public void createSnapshot(BloodStorage storage) {
        BloodStorageHistory history = new BloodStorageHistory();
        history.setOriginalBloodStorageId(storage.getId());
        if (storage.getDonor() != null) {
            history.setDonorFullName(storage.getDonor().getFullName());
            history.setDonorPhone(storage.getDonor().getPhone());
        }
        BloodType bt = storage.getBloodType();
        String fullBloodType = bt.getType() + bt.getRhFactor();
        history.setBloodType(fullBloodType);
        history.setBloodComponent(storage.getBloodComponent().getName());
        history.setQuantity(storage.getQuantity());
        history.setBloodStatus(storage.getBloodStatus());
        history.setCreateAt(storage.getCreateAt());
        history.setCreatedById(storage.getCreatedBy() != null ? storage.getCreatedBy().getId() : null);
        history.setApprovedAt(storage.getApprovedAt());
        history.setApprovedById(storage.getApprovedBy() != null ? storage.getApprovedBy().getId() : null);
        history.setUsageReason(storage.getUsageReason());
        history.setTakeAt(storage.getTakeAt());
        history.setTakeById(storage.getTakeBy() != null ? storage.getTakeBy().getId() : null);
        history.setVerifiedAt(storage.getVerifiedAt());
        history.setVerifiedById(storage.getVerifiedBy() != null ? storage.getVerifiedBy().getId() : null);
        history.setVerifiedStatus(storage.getVerifiedStatus());
        history.setNote(storage.getVerifiedNote());
        history.setArchivedAt(LocalDateTime.now());
        repository.save(history);
    }
}
