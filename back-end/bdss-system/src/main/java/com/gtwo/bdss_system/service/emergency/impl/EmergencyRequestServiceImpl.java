package com.gtwo.bdss_system.service.emergency.impl;

import com.gtwo.bdss_system.dto.emergency.EmergencyRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.repository.commons.BloodComponentRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyRequestRepository;
import com.gtwo.bdss_system.service.emergency.EmergencyProcessService;
import com.gtwo.bdss_system.service.emergency.EmergencyRequestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmergencyRequestServiceImpl implements EmergencyRequestService {

    @Autowired
    private EmergencyRequestRepository emergencyRequestRepository;

    @Autowired
    private BloodTypeRepository bloodTypeRepository;

    @Autowired
    private BloodComponentRepository bloodComponentRepository;

    @Autowired
    private EmergencyProcessService emergencyProcessService;



    @Override
    public void createEmergencyRequest(EmergencyRequestDTO dto, Account account) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime limitTime = now.minusHours(24); // chống spam trong 24h

        if (emergencyRequestRepository.existsByPhoneAndSubmittedAtAfter(dto.getPhone(), limitTime)) {
            throw new RuntimeException("Số điện thoại đã gửi yêu cầu trong vòng 24 giờ.");
        }

        if (emergencyRequestRepository.existsByCccdAndSubmittedAtAfter(dto.getCccd(), limitTime)) {
            throw new RuntimeException("CCCD đã gửi yêu cầu trong vòng 24 giờ.");
        }

        if (emergencyRequestRepository.existsByPhone(dto.getPhone())) {
            throw new RuntimeException("Số điện thoại đã tồn tại.");
        }

        if (emergencyRequestRepository.existsByCccd(dto.getCccd())) {
            throw new RuntimeException("CCCD đã tồn tại.");
        }

        BloodType bloodType = bloodTypeRepository.findById(dto.getBloodTypeId())
                .orElseThrow(() -> new RuntimeException("Invalid blood type ID"));

        BloodComponent bloodComponent = bloodComponentRepository.findById(dto.getBloodComponentId())
                .orElseThrow(() -> new RuntimeException("Invalid blood component ID"));

        EmergencyRequest request = new EmergencyRequest();
        request.setFullName(dto.getFullName());
        request.setPhone(dto.getPhone());
        request.setCccd(dto.getCccd());
        request.setSubmittedAt(now);
        request.setBloodType(bloodType);
        request.setBloodComponent(bloodComponent);
        request.setQuantity(dto.getQuantity());
        request.setLocation(dto.getLocation());
        request.setCreatedBy(account);
        request.setStatusRequest(StatusRequest.PENDING);
        request.setVerifiedBy(null);
        request.setVerifiedAt(null);
        request.setStatus(Status.ACTIVE);

        emergencyRequestRepository.save(request);
    }


    @Override
    public List<EmergencyRequestDTO> getAllRequests() {
        List<EmergencyRequest> requests = emergencyRequestRepository.findByStatus(Status.ACTIVE);
        return requests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmergencyRequestDTO getRequestById(Long id) {
        EmergencyRequest request = emergencyRequestRepository.findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu khả dụng với ID: " + id));
        return convertToDTO(request);
    }

    @Override
    public void updateEmergencyRequest(Long id, EmergencyRequestDTO dto, Account account) {
        EmergencyRequest request = emergencyRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu"));

        if (dto.getPhone() != null) {
            if (emergencyRequestRepository.existsByPhone(dto.getPhone()) &&
                    !request.getPhone().equals(dto.getPhone())) {
                throw new RuntimeException("Số điện thoại đã tồn tại.");
            }
            request.setPhone(dto.getPhone());
        }

        if (dto.getCccd() != null) {
            if (emergencyRequestRepository.existsByCccd(dto.getCccd()) &&
                    !request.getCccd().equals(dto.getCccd())) {
                throw new RuntimeException("CCCD đã tồn tại.");
            }
            request.setCccd(dto.getCccd());
        }

        if (dto.getBloodTypeId() != null) {
            BloodType bloodType = bloodTypeRepository.findById(dto.getBloodTypeId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy bloodTypeId"));
            request.setBloodType(bloodType);
        }

        if (dto.getBloodComponentId() != null) {
            BloodComponent component = bloodComponentRepository.findById(dto.getBloodComponentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy bloodComponentId"));
            request.setBloodComponent(component);
        }

        if (dto.getQuantity() != null) {
            request.setQuantity(dto.getQuantity());
        }

        if (dto.getLocation() != null) {
            request.setLocation(dto.getLocation());
        }

        // XỬ LÝ THAY ĐỔI STATUS_REQUEST
        if (dto.getStatusRequest() != null) {
            StatusRequest newStatus = dto.getStatusRequest();
            StatusRequest currentStatus = request.getStatusRequest();

            // Nếu trạng thái thay đổi
            if (currentStatus == null || !currentStatus.equals(newStatus)) {
                request.setStatusRequest(newStatus);

                if (newStatus != StatusRequest.PENDING) {
                    request.setVerifiedBy(account);
                    request.setVerifiedAt(LocalDateTime.now());

                    // Nếu là APPROVED thì tạo mới emergency_process
                    if (newStatus == StatusRequest.APPROVED) {
                        try {
                            emergencyProcessService.autoCreateByRequest(request);
                        } catch (Exception e) {
                            throw new RuntimeException("Không thể tạo quy trình xử lý: " + e.getMessage());
                        }
                    }
                }
            }
        }

        emergencyRequestRepository.save(request);
    }



    @Override
    public void deleteEmergencyRequest(Long id) {
        EmergencyRequest request = emergencyRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu"));
        request.setStatus(Status.INACTIVE); // soft delete
        emergencyRequestRepository.save(request);
    }

    @Override
    public void restoreEmergencyRequest(Long id) {
        EmergencyRequest request = emergencyRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu"));
        request.setStatus(Status.ACTIVE); // restore
        emergencyRequestRepository.save(request);
    }

    private EmergencyRequestDTO convertToDTO(EmergencyRequest request) {
        EmergencyRequestDTO dto = new EmergencyRequestDTO();
        dto.setId(request.getId());
        dto.setFullName(request.getFullName());
        dto.setPhone(request.getPhone());
        dto.setCccd(request.getCccd());
        dto.setSubmittedAt(request.getSubmittedAt());
        dto.setBloodTypeId(request.getBloodType().getId());
        dto.setBloodComponentId(request.getBloodComponent().getId());
        dto.setQuantity(request.getQuantity());
        dto.setLocation(request.getLocation());
        dto.setStatusRequest(request.getStatusRequest());
        return dto;
    }
}
