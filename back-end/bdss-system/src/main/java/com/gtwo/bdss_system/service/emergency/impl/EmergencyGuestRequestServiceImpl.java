package com.gtwo.bdss_system.service.emergency.impl;

import com.gtwo.bdss_system.dto.emergency.EmergencyGuestRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.repository.auth.AccountRepository;
import com.gtwo.bdss_system.repository.commons.BloodComponentRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyRequestRepository;
import com.gtwo.bdss_system.service.emergency.EmergencyGuestRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmergencyGuestRequestServiceImpl implements EmergencyGuestRequestService {

    private final EmergencyRequestRepository emergencyRequestRepository;
    private final BloodTypeRepository bloodTypeRepository;
    private final BloodComponentRepository bloodComponentRepository;
    private final AccountRepository accountRepository;

    @Override
    public EmergencyRequest create(EmergencyGuestRequestDTO dto) {
        // Tạo account khách
        Account guest = new Account();
        guest.setFullName(dto.getFullName());
        guest.setPhone(dto.getPhone());
        guest.setCCCD(dto.getCCCD());
        guest.setDateOfBirth((Date) dto.getDateOfBirth());

        guest = accountRepository.save(guest); // lưu vào DB

        // Tạo request khẩn cấp
        EmergencyRequest request = new EmergencyRequest();
        request.setRequester(guest);
        request.setSubmittedAt(LocalDateTime.now());
        request.setQuantity(dto.getQuantity());
        request.setLocation(dto.getLocation());
        request.setStatus(StatusRequest.PENDING);

        // Lấy bloodType
        BloodType bloodType = bloodTypeRepository.findById(dto.getBloodTypeId())
                .orElseThrow(() -> new RuntimeException("Blood type not found"));
        request.setBloodType(bloodType);

        // Lấy bloodComponent
        BloodComponent bloodComponent = bloodComponentRepository.findById(dto.getBloodComponentId())
                .orElseThrow(() -> new RuntimeException("Blood component not found"));
        request.setBloodComponent(bloodComponent);

        return emergencyRequestRepository.save(request);
    }
}