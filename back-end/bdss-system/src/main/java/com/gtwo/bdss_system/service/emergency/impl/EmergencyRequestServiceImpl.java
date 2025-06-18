package com.gtwo.bdss_system.service.emergency.impl;

import com.gtwo.bdss_system.dto.emergency.EmergencyRequestDTO;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.repository.commons.BloodComponentRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyRequestRepository;
import com.gtwo.bdss_system.service.emergency.EmergencyRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmergencyRequestServiceImpl implements EmergencyRequestService {

    @Autowired
    private EmergencyRequestRepository emergencyRequestRepository;

    @Autowired
    private BloodTypeRepository bloodTypeRepository;

    @Autowired
    private BloodComponentRepository bloodComponentRepository;

    @Override
    public void createEmergencyRequest(EmergencyRequestDTO dto) {
        if (emergencyRequestRepository.existsByPhone(dto.getPhone())) {
            throw new RuntimeException("Phone number already used in another request.");
        }
        if (emergencyRequestRepository.existsByCCCD(dto.getCCCD())) {
            throw new RuntimeException("CCCD already used in another request.");
        }

        BloodType bloodType = bloodTypeRepository.findById(dto.getBloodTypeId())
                .orElseThrow(() -> new RuntimeException("Invalid blood type ID"));
        BloodComponent bloodComponent = bloodComponentRepository.findById(dto.getBloodComponentId())
                .orElseThrow(() -> new RuntimeException("Invalid blood component ID"));

        EmergencyRequest request = new EmergencyRequest();
        request.setFullName(dto.getFullName());
        request.setPhone(dto.getPhone());
        request.setCCCD(dto.getCCCD());
        request.setSubmittedAt(LocalDateTime.now());
        request.setBloodType(bloodType);
        request.setBloodComponent(bloodComponent);
        request.setQuantity(dto.getQuantity());
        request.setLocation(dto.getLocation());
        request.setStatus(StatusRequest.PENDING);
        request.setVerifiedBy(null);
        request.setVerifiedAt(null);

        emergencyRequestRepository.save(request);
    }
}