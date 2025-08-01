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
import com.gtwo.bdss_system.repository.commons.BloodComponentRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyHistoryRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyProcessRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyRequestRepository;
import com.gtwo.bdss_system.service.emergency.EmergencyHistoryService;
import com.gtwo.bdss_system.service.emergency.EmergencyProcessService;
import jakarta.transaction.Transactional;
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
@Transactional
public class EmergencyProcessServiceImpl implements EmergencyProcessService {

    private final EmergencyProcessRepository processRepo;
    private final EmergencyRequestRepository requestRepo;
    private final BloodTypeRepository bloodTypeRepo;
    private final BloodComponentRepository  componentRepo;
    private final EmergencyHistoryService  historyService;
    private final BloodComponentRepository bloodComponentRepository;

    @Override
    public void updateWithFile(Long id, EmergencyProcessFormDTO form, Account staff) {
        EmergencyProcess process = processRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quy trình xử lý"));

        Optional<EmergencyRequest> request = requestRepo.findById(process.getEmergencyRequest().getId());
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
        process.setQuantity(form.getQuantity());
        process.setStatus(form.getStatus());
        process.setCompletedAt(LocalDateTime.now());
        process.setBloodType(bloodTypeRepo.findById(form.getBloodtypeId()).orElse(null));
        process.setBloodComponent(componentRepo.findById(form.getComponentId()).orElse(null));
        process.setHealthFileUrl(request.get().getEmergencyProof());
        if (form.getStatus() == EmergencyStatus.COMPLETED || form.getStatus() == EmergencyStatus.CANCELED) {
            process.setStatusAvailable(Status.INACTIVE);
        }
        System.out.println("HealthFileUrl length = " + process.getHealthFileUrl().length());

        EmergencyProcess saved = processRepo.save(process);
        historyService.autoCreateFromProcess(saved);
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
        process.setEmergencyPlace(request.getEmergencyPlace());
        process.setAssignedStaff(request.getVerifiedBy());
        process.setStatusAvailable(Status.ACTIVE);
        process.setBloodComponent(request.getBloodComponent());
        process.setBloodType(request.getBloodType());
        process.setQuantity(request.getQuantity());

        processRepo.save(process);
    }

    private EmergencyProcessDTO toDTO(EmergencyProcess entity) {
        EmergencyProcessDTO dto = new EmergencyProcessDTO();
        dto.setId(entity.getId());
        dto.setIdRequest(entity.getEmergencyRequest().getId());
        dto.setSymptoms(entity.getSymptoms());
        dto.setQuantity(entity.getQuantity());
        dto.setHemoglobinLevel(entity.getHemoglobinLevel());
        dto.setBloodGroupConfirmed(entity.getBloodGroupConfirmed());
        dto.setCrossmatchResult(entity.getCrossmatchResult());
        dto.setStatus(entity.getStatus());
        dto.setBloodPressure(entity.getBloodPressure());
        dto.setPulse(entity.getPulse());
        dto.setRespiratoryRate(entity.getRespiratoryRate());
        dto.setTemperature(entity.getTemperature());
        dto.setBloodComponent(entity.getBloodComponent().getName());
        dto.setBloodType(entity.getBloodType().getType() + entity.getBloodType().getRhFactor());
        return dto;
    }
}
