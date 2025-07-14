package com.gtwo.bdss_system.service.emergency.impl;

import com.gtwo.bdss_system.dto.emergency.EmergencyHistoryDTO;
import com.gtwo.bdss_system.dto.emergency.EmergencyProcessDTO;
import com.gtwo.bdss_system.dto.emergency.EmergencyProcessFormDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.emergency.EmergencyHistory;
import com.gtwo.bdss_system.entity.emergency.EmergencyProcess;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.enums.EmergencyResult;
import com.gtwo.bdss_system.enums.EmergencyStatus;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.repository.emergency.EmergencyHistoryRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyProcessRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyRequestRepository;
import com.gtwo.bdss_system.service.emergency.EmergencyProcessService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyProcessServiceImpl implements EmergencyProcessService {

    private final EmergencyProcessRepository processRepo;
    private final EmergencyRequestRepository requestRepo;
    private final EmergencyHistoryRepository historyRepo;
    @Override
    public void updateWithFile(Long id, EmergencyProcessFormDTO form, Account staff) {
        EmergencyProcess process = processRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quy trình xử lý"));

        Optional<EmergencyRequest> request = requestRepo.findById(process.getEmergencyRequest().getId());

        // Lưu file nếu có
        if (form.getHealthFile() != null && !form.getHealthFile().isEmpty()) {
            String originalFileName = form.getHealthFile().getOriginalFilename();
            String savedName = System.currentTimeMillis() + "_" + originalFileName;
            Path path = Paths.get("uploads", savedName);

            try {
                Files.createDirectories(path.getParent());
                Files.write(path, form.getHealthFile().getBytes());
                process.setHealthFileUrl("/uploads/" + savedName);
            } catch (IOException e) {
                throw new RuntimeException("Không thể lưu file hồ sơ sức khỏe", e);
            }
        }

        // Gán thông tin form vào entity
        process.setHealthCheckSummary(form.getHealthCheckSummary());
        process.setAssignedStaff(staff);
        process.setSymptoms(form.getSymptoms());
        process.setBloodPressure(form.getBloodPressure());
        process.setPulse(form.getPulse());
        process.setRespiratoryRate(form.getRespiratoryRate());
        process.setTemperature(form.getTemperature());
        process.setHemoglobinLevel(form.getHemoglobinLevel());
        process.setBloodGroupConfirmed(form.getBloodGroupConfirmed());
        process.setCrossmatchResult(form.getCrossmatchResult());
        process.setNeedComponent(form.getNeedComponent());
        process.setReasonForTransfusion(form.getReasonForTransfusion());
        process.setQuantity(form.getQuantity());
        process.setStatus(form.getStatus());
        process.setCompletedAt(LocalDateTime.now());

        if (form.getStatus() == EmergencyStatus.COMPLETED || form.getStatus() == EmergencyStatus.CANCELED) {
            process.setStatusAvailable(Status.INACTIVE);
        }

        EmergencyProcess saved = processRepo.save(process);

        // Chuyển vào history nếu hoàn tất
        if (saved.getStatus() == EmergencyStatus.COMPLETED || saved.getStatus() == EmergencyStatus.CANCELED) {
            boolean alreadyExists = historyRepo.findByDeleteFalse().stream()
                    .anyMatch(h -> h.getEmergencyRequest().getId().equals(request.get().getId()));
            if (!alreadyExists) {
                EmergencyHistory history = new EmergencyHistory();
                history.setEmergencyRequest(saved.getEmergencyRequest());
                history.setResolvedAt(LocalDateTime.now());
                history.setFullNameSnapshot(request.get().getFullName());
                history.setBloodType(request.get().getBloodType());
                history.setComponent(request.get().getBloodComponent());
                history.setQuantity(request.get().getQuantity());
                if (process.getStatus() == EmergencyStatus.COMPLETED) {
                    history.setResult(EmergencyResult.FULLFILLED);
                } else {
                    history.setResult(EmergencyResult.UNFULLFILLED);
                }

                history.setNotes(saved.getHealthCheckSummary());
                history.setDelete(false);
                historyRepo.save(history);
            }
        }
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
        return processRepo.findByStatusAvailable(Status.ACTIVE).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }
    @Override
    public List<EmergencyProcessDTO> lookupByNameAndPhone(String fullName, String phone) {
        return processRepo
                .findByEmergencyRequest_FullNameAndEmergencyRequest_Phone(fullName, phone).stream()
                .filter(p -> p.getStatusAvailable() == Status.ACTIVE)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }



    @Override
    public void autoCreateByRequest(EmergencyRequest request) {
        EmergencyProcess process = new EmergencyProcess();
        process.setEmergencyRequest(request);
        process.setStartedAt(LocalDateTime.now());
        process.setStatus(EmergencyStatus.IN_PROCESS);
        process.setAssignedStaff(request.getVerifiedBy());
        process.setStatusAvailable(Status.ACTIVE);
        processRepo.save(process);
    }

    private EmergencyProcessDTO toDTO(EmergencyProcess entity) {
        EmergencyProcessDTO dto = new EmergencyProcessDTO();
        dto.setId(entity.getId());
        dto.setIdRequest(entity.getEmergencyRequest().getId());
        dto.setHealthCheckSummary(entity.getHealthCheckSummary());
        dto.setSymptoms(entity.getSymptoms());
        dto.setQuantity(entity.getQuantity());
        dto.setHemoglobinLevel(entity.getHemoglobinLevel());
        dto.setBloodGroupConfirmed(entity.getBloodGroupConfirmed());
        dto.setCrossmatchResult(entity.getCrossmatchResult());
        dto.setNeedComponent(entity.getNeedComponent());
        dto.setReasonForTransfusion(entity.getReasonForTransfusion());
        dto.setStatus(entity.getStatus());
        dto.setBloodPressure(entity.getBloodPressure());
        dto.setPulse(entity.getPulse());
        dto.setRespiratoryRate(entity.getRespiratoryRate());
        dto.setTemperature(entity.getTemperature());
        return dto;
    }
}
