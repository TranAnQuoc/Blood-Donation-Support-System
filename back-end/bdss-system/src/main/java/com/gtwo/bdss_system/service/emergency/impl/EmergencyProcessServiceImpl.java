package com.gtwo.bdss_system.service.emergency.impl;

import com.gtwo.bdss_system.dto.emergency.EmergencyProcessDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.emergency.EmergencyProcess;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.enums.EmergencyStatus;
import com.gtwo.bdss_system.repository.auth.AuthenticationRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyProcessRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyRequestRepository;
import com.gtwo.bdss_system.service.emergency.EmergencyProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmergencyProcessServiceImpl implements EmergencyProcessService {

    @Autowired private EmergencyProcessRepository repository;
    @Autowired private EmergencyRequestRepository requestRepository;
    @Autowired private AuthenticationRepository accountRepository;

    @Override
    public EmergencyProcessDTO create(EmergencyProcessDTO dto) {
        EmergencyProcess process = mapToEntity(dto);
        return mapToDTO(repository.save(process));
    }

    @Override
    public EmergencyProcessDTO getById(Long id) {
        return repository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    @Override
    public List<EmergencyProcessDTO> getAll() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public EmergencyProcessDTO update(Long id, EmergencyProcessDTO dto) {
        EmergencyProcess existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        dto.setId(id);
        EmergencyProcess updated = mapToEntity(dto);
        updated.setStartedAt(existing.getStartedAt()); // Optional: preserve started time
        return mapToDTO(repository.save(updated));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private EmergencyProcess mapToEntity(EmergencyProcessDTO dto) {
        EmergencyRequest request = requestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new RuntimeException("Invalid request ID"));
        //MedicalFacility facility = facilityRepository.findById(dto.getAssignedFacilityId())
                //.orElseThrow(() -> new RuntimeException("Invalid facility ID"));
        Account staff = accountRepository.findById(dto.getAssignedStaffId())
                .orElseThrow(() -> new RuntimeException("Invalid staff ID"));

        EmergencyProcess entity = new EmergencyProcess();
        entity.setId(dto.getId());
        entity.setEmergencyRequest(request);
        //entity.setAssignedFacility(facility);
        entity.setAssignedStaff(staff);
        entity.setConfirmed(dto.getConfirmed());
        entity.setHealthCheckSummary(dto.getHealthCheckSummary());
        entity.setStartedAt(dto.getStartedAt());
        entity.setCompletedAt(dto.getCompletedAt());
        entity.setStatus(EmergencyStatus.valueOf(String.valueOf(dto.getStatus())));
        return entity;
    }

    private EmergencyProcessDTO mapToDTO(EmergencyProcess entity) {
        EmergencyProcessDTO dto = new EmergencyProcessDTO();
        dto.setId(entity.getId());
        dto.setRequestId(entity.getEmergencyRequest().getId());
        //dto.setAssignedFacilityId(entity.getAssignedFacility().getId());
        dto.setAssignedStaffId(entity.getAssignedStaff().getId());
        dto.setHealthCheckSummary(entity.getHealthCheckSummary());
        dto.setConfirmed(entity.getConfirmed());
        dto.setStartedAt(entity.getStartedAt());
        dto.setCompletedAt(entity.getCompletedAt());
        dto.setStatus(EmergencyStatus.valueOf(entity.getStatus().name()));
        return dto;
    }
}
