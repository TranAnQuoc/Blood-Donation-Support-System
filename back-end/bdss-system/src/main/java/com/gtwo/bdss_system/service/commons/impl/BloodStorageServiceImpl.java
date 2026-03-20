package com.gtwo.bdss_system.service.commons.impl;

import com.gtwo.bdss_system.dto.commons.*;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodStorage;
import com.gtwo.bdss_system.enums.StatusBloodStorage;
import com.gtwo.bdss_system.enums.StatusVerified;
import com.gtwo.bdss_system.repository.auth.AccountRepository;
import com.gtwo.bdss_system.repository.commons.BloodComponentRepository;
import com.gtwo.bdss_system.repository.commons.BloodStorageRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
import com.gtwo.bdss_system.service.commons.BloodStorageHistoryService;
import com.gtwo.bdss_system.service.commons.BloodStorageService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
    public BloodStorage approve(Long id, ApproveRequestDTO dto, Account approver) {
        if (dto.getStatus() != StatusBloodStorage.STORED && dto.getStatus() != StatusBloodStorage.REJECTED) {
            throw new IllegalArgumentException("Chỉ được chọn STORED hoặc REJECTED.");
        }
        BloodStorage storage = repository.findById(id).orElseThrow();
        storage.setBloodStatus(dto.getStatus());
        storage.setApprovedAt(LocalDateTime.now());
        storage.setApprovedBy(approver);
        if (dto.getStatus() == StatusBloodStorage.REJECTED) {
            storage.setVerifiedNote(dto.getNote());
        }
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
    public List<BloodStorageResponseDTO> getAll() {
        List<BloodStorage> storages = repository.findAll();
        return storages.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BloodStorageResponseDTO> getByStatus(StatusBloodStorage status) {
        List<BloodStorage> storages = repository.findByBloodStatus(status);
        return storages.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BloodStorageResponseDTO> searchByTypeRhComponent(Long bloodTypeId, Long bloodComponentId) {
        List<BloodStorage> results = repository.searchByTypeAndComponent(bloodTypeId, bloodComponentId);
        return results.stream()
                .map(this::mapToDto)
                .toList();
    }

    private BloodStorageResponseDTO mapToDto(BloodStorage entity) {
        BloodStorageResponseDTO dto = new BloodStorageResponseDTO();
        dto.setId(entity.getId());

        // Donor
        if (entity.getDonor() != null) {
            dto.setDonorId(entity.getDonor().getId());
            dto.setDonorName(entity.getDonor().getFullName());
            dto.setDonorPhone(entity.getDonor().getPhone());
            dto.setDonorRole(entity.getDonor().getRole().name());
        }

        // BloodType, BloodComponent
        if (entity.getBloodType() != null) {
            dto.setBloodTypeId(entity.getBloodType().getId());
            dto.setBloodTypeName(entity.getBloodType().getType());
            dto.setBloodTypeRh(entity.getBloodType().getRhFactor());
        }

        // Blood component
        if (entity.getBloodComponent() != null) {
            dto.setBloodComponentId(entity.getBloodComponent().getId());
            dto.setBloodComponentName(entity.getBloodComponent().getName());
        }
        dto.setQuantity(entity.getQuantity());
        dto.setBloodStatus(entity.getBloodStatus());
        dto.setCreateAt(entity.getCreateAt());

        // CreatedBy
        if (entity.getCreatedBy() != null) {
            dto.setCreatedById(entity.getCreatedBy().getId());
            dto.setCreatedByName(entity.getCreatedBy().getFullName());
            dto.setCreatedByPhone(entity.getCreatedBy().getPhone());
            dto.setCreatedByRole(entity.getCreatedBy().getRole().name());
        }

        dto.setApprovedAt(entity.getApprovedAt());
        if (entity.getApprovedBy() != null) {
            dto.setApprovedById(entity.getApprovedBy().getId());
            dto.setApprovedByName(entity.getApprovedBy().getFullName());
            dto.setApprovedByPhone(entity.getApprovedBy().getPhone());
            dto.setApprovedByRole(entity.getApprovedBy().getRole().name());
        }

        dto.setUsageReason(entity.getUsageReason());
        dto.setTakeAt(entity.getTakeAt());
        if (entity.getTakeBy() != null) {
            dto.setTakeById(entity.getTakeBy().getId());
            dto.setTakeByName(entity.getTakeBy().getFullName());
            dto.setTakeByPhone(entity.getTakeBy().getPhone());
            dto.setTakeByRole(entity.getTakeBy().getRole().name());
        }

        dto.setVerifiedAt(entity.getVerifiedAt());
        if (entity.getVerifiedBy() != null) {
            dto.setVerifiedById(entity.getVerifiedBy().getId());
            dto.setVerifiedByName(entity.getVerifiedBy().getFullName());
            dto.setVerifiedByPhone(entity.getVerifiedBy().getPhone());
            dto.setVerifiedByRole(entity.getVerifiedBy().getRole().name());
        }

        dto.setVerifiedStatus(entity.getVerifiedStatus());
        dto.setVerifiedNote(entity.getVerifiedNote());
        return dto;
    }

    @Transactional
    public void checkAndExpireStoredBags() {
        List<BloodStorage> storedBags = repository.findByBloodStatus(StatusBloodStorage.STORED);

        LocalDateTime now = LocalDateTime.now();

        for (BloodStorage bag : storedBags) {
            BloodComponent component = bag.getBloodComponent();
            String componentName = component.getName();

            long expireDays = 0;

            switch (componentName) {
                case "Toàn phần":
                    expireDays = 35;
                    break;
                case "Hồng cầu":
                    expireDays = 35;
                    break;
                case "Huyết tương":
                    expireDays = 365;
                    break;
                case "Tiểu cầu":
                    expireDays = 5;
                    break;
                case "Bạch cầu":
                    expireDays = 1;
                    break;
                default:
                    // Nếu "Unknow" hoặc không xác định, giả sử 1 ngày để an toàn
                    expireDays = 1;
                    break;
            }

            if (bag.getCreateAt() != null && bag.getCreateAt().plusDays(expireDays).isBefore(now)) {
                bag.setBloodStatus(StatusBloodStorage.EXPIRED);
                // Bạn có thể log thêm nếu muốn
                System.out.println("✅ Túi máu ID " + bag.getId() + " đã hết hạn và được set EXPIRED.");
            }
        }

        repository.saveAll(storedBags);
    }

    @Override
    public List<BloodStorageStatusDTO> findAllByDonor(Long donorId) {
        List<BloodStorage> bags = repository.findByDonorId(donorId);

        return bags.stream()
                .map(this::convertToStatusDTO)
                .collect(Collectors.toList());
    }

    private BloodStorageStatusDTO convertToStatusDTO(BloodStorage bag) {
        BloodStorageStatusDTO dto = new BloodStorageStatusDTO();
        dto.setId(bag.getId());
        dto.setBloodType(bag.getBloodType() != null ? bag.getBloodType().getType() : null);
        dto.setBloodComponent(bag.getBloodComponent() != null ? bag.getBloodComponent().getName() : null);
        dto.setQuantity(bag.getQuantity());
        dto.setBloodStatus(bag.getBloodStatus());
        dto.setCreateAt(bag.getCreateAt());
        dto.setApprovedAt(bag.getApprovedAt());
        dto.setTakeAt(bag.getTakeAt());
        dto.setUsageReason(bag.getUsageReason());
        dto.setVerifiedStatus(bag.getVerifiedStatus());
        dto.setVerifiedNote(bag.getVerifiedNote());
        return dto;
    }
}
