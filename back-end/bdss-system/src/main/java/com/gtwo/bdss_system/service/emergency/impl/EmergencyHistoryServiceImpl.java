package com.gtwo.bdss_system.service.emergency.impl;

import com.gtwo.bdss_system.dto.emergency.EmergencyHistoryDTO;
import com.gtwo.bdss_system.entity.emergency.EmergencyHistory;
import com.gtwo.bdss_system.entity.emergency.EmergencyProcess;
import com.gtwo.bdss_system.enums.EmergencyResult;
import com.gtwo.bdss_system.enums.StatusProcess;
import com.gtwo.bdss_system.repository.emergency.EmergencyHistoryRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyProcessRepository;
import com.gtwo.bdss_system.service.emergency.EmergencyHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyHistoryServiceImpl implements EmergencyHistoryService {

    private final EmergencyHistoryRepository historyRepo;
    private final EmergencyProcessRepository processRepo;

    @Override
    public EmergencyHistoryDTO getById(Long id) {
        return toDTO(historyRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy lịch sử")));
    }

    @Override
    public List<EmergencyHistoryDTO> getAll() {
        return historyRepo.findByDeleteFalse().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmergencyHistoryDTO> getAllDeleted() {
        return historyRepo.findByDeleteTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void autoCreateFromProcess(EmergencyProcess process) {
        if (process.getStatus() != StatusProcess.COMPLETED) {
            throw new IllegalStateException("Không thể tạo lịch sử nếu quy trình chưa hoàn tất");
        }

        // ✅ Sử dụng truy vấn trực tiếp để kiểm tra trùng
        if (historyRepo.findByEmergencyRequest_IdAndDeleteFalse(process.getEmergencyRequest().getId()).isPresent()) {
            throw new IllegalStateException("Lịch sử đã tồn tại cho yêu cầu này");
        }

        EmergencyHistory history = new EmergencyHistory();
        history.setEmergencyRequest(process.getEmergencyRequest());
        history.setResolvedAt(LocalDateTime.now());
        history.setFullNameSnapshot(process.getEmergencyRequest().getFullName());
        history.setBloodType(process.getEmergencyRequest().getBloodType());
        history.setFacilityName(
                process.getEmergencyRequest().getMedicalFacility() != null ?
                        process.getEmergencyRequest().getMedicalFacility().getName() : null
        );
        history.setComponent(process.getEmergencyRequest().getBloodComponent());
        history.setQuantity(process.getEmergencyRequest().getQuantity());
        history.setResult(
                Boolean.TRUE.equals(process.getConfirmed())
                        ? EmergencyResult.FULLFILLED
                        : EmergencyResult.UNFULLFILLED
        );
        history.setNotes(process.getHealthCheckSummary());
        history.setDelete(false);

        historyRepo.save(history);
    }


    @Override
    public void softDelete(Long id) {
        EmergencyHistory history = historyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch sử cần xóa"));
        history.setDelete(true);
        historyRepo.save(history);
    }

    @Override
    public void restore(Long id) {
        EmergencyHistory history = historyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch sử cần khôi phục"));
        history.setDelete(false);
        historyRepo.save(history);
    }

    private EmergencyHistoryDTO toDTO(EmergencyHistory entity) {
        EmergencyHistoryDTO dto = new EmergencyHistoryDTO();
        dto.setId(entity.getId());
        dto.setRequestId(entity.getEmergencyRequest().getId());
        dto.setResolvedAt(entity.getResolvedAt());
        dto.setFullNameSnapshot(entity.getFullNameSnapshot());
        dto.setBloodTypeId(entity.getBloodType() != null ? entity.getBloodType().getId() : null);
        dto.setFacilityName(entity.getFacilityName());
        dto.setComponentId(entity.getComponent() != null ? entity.getComponent().getId() : null);
        dto.setQuantity(entity.getQuantity());
        dto.setResult(entity.getResult());
        dto.setNotes(entity.getNotes());
        dto.setDeleted(entity.getDelete());
        return dto;
    }
}
