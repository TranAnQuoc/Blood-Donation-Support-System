package com.gtwo.bdss_system.service.emergency.impl;

import com.gtwo.bdss_system.dto.emergency.EmergencyRequestDTO;
import com.gtwo.bdss_system.dto.emergency.EmergencyRequestResponseDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.repository.commons.BloodComponentRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
import com.gtwo.bdss_system.repository.emergency.EmergencyRequestRepository;
import com.gtwo.bdss_system.service.emergency.EmergencyNotificationService;
import com.gtwo.bdss_system.service.emergency.EmergencyProcessService;
import com.gtwo.bdss_system.service.emergency.EmergencyRequestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
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

    @Autowired
    private EmergencyNotificationService emergencyNotificationService;

    @Override
    public void createEmergencyRequest(EmergencyRequestDTO dto, MultipartFile proofImage,Account account) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime limitTime = now.minusHours(24); // chống spam trong 24h
        String imageUrl = null;
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
        request.setEmergencyProof(dto.getEmergencyProof());
        request.setStatusRequest(StatusRequest.PENDING);
        request.setVerifiedBy(null);
        request.setVerifiedAt(null);
        request.setStatus(Status.ACTIVE);
        if (proofImage != null && !proofImage.isEmpty()) {
            try {
                byte[] imageBytes = proofImage.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                request.setEmergencyProof(base64Image);
            } catch (IOException e) {
                throw new RuntimeException("Không thể xử lý ảnh", e);
            }
        } else {
            request.setEmergencyProof(dto.getEmergencyProof()); // fallback
        }
        emergencyRequestRepository.save(request);
        emergencyNotificationService.sendEmergencyNotification("Có yêu cầu khẩn cấp mới từ: " + dto.getFullName());
    }


    @Override
    public List<EmergencyRequestDTO> getAllRequests() {
        List<EmergencyRequest> requests = emergencyRequestRepository.findByStatus(Status.ACTIVE);
        return requests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
@Override
public List<EmergencyRequestResponseDTO> getAllResponseRequests() {
    return emergencyRequestRepository.findByStatus(Status.ACTIVE).stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
}


    @Override
    public EmergencyRequestDTO getRequestById(Long id) {
        EmergencyRequest request = emergencyRequestRepository.findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu khả dụng với ID: " + id));
        return convertToDTO(request);
    }

    @Override
    public void updateEmergencyRequest(Long id, StatusRequest decision,String note, Account account) {
        EmergencyRequest request = emergencyRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        if (request.getStatusRequest() == StatusRequest.APPROVED) {
            throw new IllegalStateException("Request already approved");
        }
        request.setStatusRequest(decision);
        request.setStaffNote(note);
        request.setVerifiedAt(LocalDateTime.now());
        request.setVerifiedBy(account);
        EmergencyRequest savedRequest = emergencyRequestRepository.save(request);
        if (decision == StatusRequest.APPROVED) {
            emergencyProcessService.autoCreateByRequest(savedRequest);
        }

    }
    @Override
    public EmergencyRequestDTO findByFullNameAndPhone(String fullName, String phone) {
        EmergencyRequest request = emergencyRequestRepository
                .findByFullNameAndPhoneAndStatus(fullName, phone, Status.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu với thông tin đã nhập"));
        return convertToDTO(request);
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
        dto.setEmergencyProof(request.getEmergencyProof());
        dto.setFullName(request.getFullName());
        dto.setPhone(request.getPhone());
        dto.setCccd(request.getCccd());
        dto.setBloodTypeId(request.getBloodType().getId());
        dto.setBloodComponentId(request.getBloodComponent().getId());
        dto.setQuantity(request.getQuantity());
        dto.setLocation(request.getLocation());
        dto.setStatusRequest(request.getStatusRequest());
        return dto;
    }
    private EmergencyRequestResponseDTO convertToResponseDTO(EmergencyRequest request) {
        EmergencyRequestResponseDTO dto = new EmergencyRequestResponseDTO();
        dto.setId(request.getId());
        dto.setFullName(request.getFullName());
        dto.setPhone(request.getPhone());
        dto.setCccd(request.getCccd());
        dto.setBloodTypeId(request.getBloodType().getId());
        dto.setBloodComponentId(request.getBloodComponent().getId());
        dto.setQuantity(request.getQuantity());
        dto.setLocation(request.getLocation());
        dto.setStatusRequest(request.getStatusRequest());

        String proof = request.getEmergencyProof();
        if (proof != null && proof.length() > 100) {
            dto.setEmergencyProofPreview(proof.substring(0, 100) + "...");
        } else {
            dto.setEmergencyProofPreview(proof);
        }
        return dto;
    }

}
