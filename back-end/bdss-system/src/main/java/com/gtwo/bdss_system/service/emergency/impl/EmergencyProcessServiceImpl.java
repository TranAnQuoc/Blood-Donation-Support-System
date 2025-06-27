package com.gtwo.bdss_system.service.emergency.impl;

import com.gtwo.bdss_system.dto.emergency.EmergencyProcessDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.emergency.EmergencyHistory;
import com.gtwo.bdss_system.entity.emergency.EmergencyProcess;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.enums.EmergencyResult;
import com.gtwo.bdss_system.enums.StatusProcess;
import com.gtwo.bdss_system.repository.emergency.EmergencyHistoryRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyProcessRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyRequestRepository;
import com.gtwo.bdss_system.service.emergency.EmergencyProcessService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyProcessServiceImpl implements EmergencyProcessService {

    private final EmergencyProcessRepository processRepo;
    private final EmergencyRequestRepository requestRepo;
    private final EmergencyHistoryRepository historyRepo;

    @Override
    public EmergencyProcessDTO update(Long id, EmergencyProcessDTO dto, Account account) {
        EmergencyProcess process = processRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quy trình xử lý"));

        EmergencyRequest request = requestRepo.findById(dto.getRequestId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu cần cập nhật"));

        process.setHealthCheckSummary(dto.getHealthCheckSummary());
        process.setConfirmed(dto.getConfirmed());
        process.setAssignedStaff(account);
        process.setEmergencyRequest(request);
        process.setSymptoms(dto.getSymptoms());
        process.setVitalSigns(dto.getVitalSigns());
        process.setHemoglobinLevel(dto.getHemoglobinLevel());
        process.setBloodGroupConfirmed(dto.getBloodGroupConfirmed());
        process.setCrossmatchResult(dto.getCrossmatchResult());
        process.setNeedComponent(dto.getNeedComponent());
        process.setReasonForTransfusion(dto.getReasonForTransfusion());
        process.setStartedAt(dto.getStartedAt());
        process.setCompletedAt(LocalDateTime.now());
        process.setStatus(dto.getStatus());

        EmergencyProcess saved = processRepo.save(process);

        if (saved.getStatus() == StatusProcess.COMPLETED) {
            boolean alreadyExists = historyRepo.findByDeleteFalse().stream()
                    .anyMatch(h -> h.getEmergencyRequest().getId().equals(request.getId()));
            if (!alreadyExists) {
                EmergencyHistory history = new EmergencyHistory();
                history.setEmergencyRequest(saved.getEmergencyRequest());
                history.setResolvedAt(LocalDateTime.now());
                history.setFullNameSnapshot(request.getFullName());
                history.setBloodType(request.getBloodType());
                history.setComponent(request.getBloodComponent());
                history.setQuantity(request.getQuantity());
                history.setResult(saved.getConfirmed() != null && saved.getConfirmed() ? EmergencyResult.FULLFILLED : EmergencyResult.UNFULLFILLED);
                history.setNotes(saved.getHealthCheckSummary());
                history.setDelete(false);
                historyRepo.save(history);
            }
        }
        return toDTO(saved);
    }

    @Override
    public EmergencyProcessDTO getById(Long id) {
        return toDTO(processRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy")));
    }

    @Override
    public List<EmergencyProcessDTO> getByStaffId(Long staffId) {
        return processRepo.findByAssignedStaff_Id(staffId).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<EmergencyProcessDTO> getAll() {
        return processRepo.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public void autoCreateByRequest(EmergencyRequest request) {
        EmergencyProcess process = new EmergencyProcess();
        process.setEmergencyRequest(request);
        process.setStartedAt(LocalDateTime.now());
        process.setStatus(StatusProcess.IN_PROCESS);
        process.setConfirmed(false);
        process.setAssignedStaff(request.getVerifiedBy());
        processRepo.save(process);
    }

    private EmergencyProcessDTO toDTO(EmergencyProcess entity) {
        EmergencyProcessDTO dto = new EmergencyProcessDTO();
        dto.setId(entity.getId());
        dto.setRequestId(entity.getEmergencyRequest().getId());
        dto.setHealthCheckSummary(entity.getHealthCheckSummary());
        dto.setConfirmed(entity.getConfirmed());
        dto.setSymptoms(entity.getSymptoms());
        dto.setVitalSigns(entity.getVitalSigns());
        dto.setHemoglobinLevel(entity.getHemoglobinLevel());
        dto.setBloodGroupConfirmed(entity.getBloodGroupConfirmed());
        dto.setCrossmatchResult(entity.getCrossmatchResult());
        dto.setNeedComponent(entity.getNeedComponent());
        dto.setReasonForTransfusion(entity.getReasonForTransfusion());
        dto.setStartedAt(entity.getStartedAt());
        dto.setCompletedAt(entity.getCompletedAt());
        dto.setStatus(entity.getStatus());

        if (entity.getAssignedStaff() != null) {
            dto.setAssignedStaffId(entity.getAssignedStaff().getId());
            dto.setStaffName(entity.getAssignedStaff().getFullName());
        }
        return dto;
    }
}
