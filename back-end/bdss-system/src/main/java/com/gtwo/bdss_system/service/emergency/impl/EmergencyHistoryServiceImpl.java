package com.gtwo.bdss_system.service.emergency.impl;

import com.gtwo.bdss_system.dto.emergency.EmergencyHistoryDTO;
import com.gtwo.bdss_system.entity.emergency.EmergencyHistory;
import com.gtwo.bdss_system.entity.emergency.EmergencyProcess;
import com.gtwo.bdss_system.enums.EmergencyResult;
import com.gtwo.bdss_system.enums.EmergencyStatus;
import com.gtwo.bdss_system.enums.StatusProcess;
import com.gtwo.bdss_system.repository.emergency.EmergencyHistoryRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyProcessRepository;
import com.gtwo.bdss_system.service.emergency.EmergencyHistoryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
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
    public void autoCreateFromProcess(EmergencyProcess process) {
        if (process.getStatus() != EmergencyStatus.COMPLETED) {
            throw new IllegalStateException("Không thể tạo lịch sử nếu quy trình chưa hoàn tất");
        }

        if (historyRepo.findByEmergencyRequest_IdAndDeleteFalse(process.getEmergencyRequest().getId()).isPresent()) {
            throw new IllegalStateException("Lịch sử đã tồn tại cho yêu cầu này");
        }

        EmergencyHistory history = new EmergencyHistory();
        history.setEmergencyRequest(process.getEmergencyRequest());
        history.setResolvedAt(LocalDateTime.now());

        // 🟢 Lấy snapshot từ process thay vì request
        history.setFullNameSnapshot(process.getEmergencyRequest().getFullName()); // Vẫn từ request (nếu không thay đổi)
        history.setPhoneSnapshot(process.getEmergencyRequest().getPhone());
        history.setQuantity(process.getQuantity());                               // 🟢 Cập nhật quantity từ process
        history.setResult(
                process.getStatus() == EmergencyStatus.COMPLETED
                        ? EmergencyResult.FULLFILLED
                        : EmergencyResult.UNFULLFILLED
        );
        history.setNotes(process.getHealthCheckSummary());

        // 🟢 Các trường lấy từ process

        history.setCrossmatchResult(process.getCrossmatchResult());
        history.setHemoglobinLevel(process.getHemoglobinLevel());
        history.setBloodGroupConfirmed(process.getBloodGroupConfirmed());
        history.setPulse(process.getPulse());
        history.setTemperature(process.getTemperature());
        history.setRespiratoryRate(process.getRespiratoryRate());
        history.setBloodPressure(process.getBloodPressure());
        history.setSymptoms(process.getSymptoms());
        history.setBloodType(process.getBloodType());
        history.setComponent(process.getBloodComponent());
        history.setDelete(false);
        history.setHealthFileUrl(process.getHealthFileUrl());
        history.setEmergencyPlace(process.getEmergencyPlace());
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
        dto.setPhoneSnapshot(entity.getPhoneSnapshot());
        dto.setBloodTypeId(entity.getBloodType() != null ? entity.getBloodType().getId() : null);
        dto.setComponentId(entity.getComponent() != null ? entity.getComponent().getId() : null);
        dto.setQuantity(entity.getQuantity());
        dto.setResult(entity.getResult());
        dto.setNotes(entity.getNotes());
        dto.setReasonForTransfusion(entity.getReasonForTransfusion());
        dto.setNeedComponent(entity.getNeedComponent());
        dto.setCrossmatchResult(entity.getCrossmatchResult());
        dto.setHemoglobinLevel(entity.getHemoglobinLevel());
        dto.setBloodGroupConfirmed(entity.getBloodGroupConfirmed());
        dto.setPulse(entity.getPulse());
        dto.setTemperature(entity.getTemperature());
        dto.setRespiratoryRate(entity.getRespiratoryRate());
        dto.setBloodPressure(entity.getBloodPressure());
        dto.setSymptoms(entity.getSymptoms());
        dto.setHealthFile(entity.getHealthFileUrl());
        dto.setDeleted(entity.getDelete());
        dto.setEmergencyPlace(entity.getEmergencyPlace());
        return dto;
    }

}
