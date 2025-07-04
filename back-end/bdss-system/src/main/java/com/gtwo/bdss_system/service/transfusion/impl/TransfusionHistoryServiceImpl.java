package com.gtwo.bdss_system.service.transfusion.impl;

import com.gtwo.bdss_system.dto.transfusion.TransfusionHistoryResponseDTO;
import com.gtwo.bdss_system.repository.transfusion.TransfusionProcessRepository;
import com.gtwo.bdss_system.service.transfusion.TransfusionHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransfusionHistoryServiceImpl implements TransfusionHistoryService {

    private final TransfusionProcessRepository procRepo;

    @Override
    public List<TransfusionHistoryResponseDTO> getAllHistory() {
        return procRepo.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private TransfusionHistoryResponseDTO mapToDTO(com.gtwo.bdss_system.entity.transfusion.TransfusionProcess proc) {
        TransfusionHistoryResponseDTO dto = new TransfusionHistoryResponseDTO();


        if (proc.getRequest() != null) {
            dto.setRecipientId(proc.getRequest().getRecipientId());
            dto.setTransfusionDate(proc.getTransfusionCompletedAt() != null
                    ? proc.getTransfusionCompletedAt().toLocalDate()
                    : null);
            dto.setComponentReceived(proc.getRequest().getBloodComponentNeeded());
            dto.setQuantity(proc.getRequest().getQuantityNeeded());
        }

        dto.setFullNameSnapshot(proc.getFullNameSnapshot());
        dto.setBirthdateSnapshot(proc.getBirthdateSnapshot());
        dto.setBloodTypeSnapshot(proc.getBloodTypeSnapshot());
        dto.setRhFactorSnapshot(proc.getRhFactorSnapshot() != null ? proc.getRhFactorSnapshot().name() : null);
        dto.setFacilityName(proc.getFacilityName());
        dto.setResultNotes(proc.getStaffNotes());

        return dto;
    }
}
