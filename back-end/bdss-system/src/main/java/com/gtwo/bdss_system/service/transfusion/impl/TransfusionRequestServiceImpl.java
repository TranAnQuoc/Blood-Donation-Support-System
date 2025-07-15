package com.gtwo.bdss_system.service.transfusion.impl;

import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestDTO;
import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestResponseDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.repository.transfusion.TransfusionRequestRepository;
import com.gtwo.bdss_system.repository.auth.AuthenticationRepository;
import com.gtwo.bdss_system.service.transfusion.TransfusionRequestService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransfusionRequestServiceImpl implements TransfusionRequestService {

    private final TransfusionRequestRepository requestRepository;
    private final AuthenticationRepository authenticationRepository;
    private final ModelMapper mapper;

    @Override
    public TransfusionRequest createRequest(TransfusionRequestDTO dto) {
        Long recipientId = getCurrentUserId();
        if (dto.getAddress() == null || dto.getAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Address is required when creating a transfusion request.");
        }
        TransfusionRequest entity = TransfusionRequest.builder()
                .recipientId(recipientId)
                .bloodComponentNeeded(dto.getBloodComponentNeeded())
                .quantityNeeded(dto.getQuantityNeeded())
                .doctorDiagnosis(dto.getDoctorDiagnosis())
                .preCheckNotes(dto.getPreCheckNotes())
                .address(dto.getAddress())
                .requestedAt(LocalDateTime.now())
                .statusRequest(StatusRequest.PENDING)
                .status(Status.ACTIVE)
                .build();

        return requestRepository.save(entity);
    }

    @Override
    public void softDelete(Integer requestId) {
        TransfusionRequest request = requestRepository.findById(requestId.longValue())
                .orElseThrow(() -> new RuntimeException("Transfusion request not found"));

        request.setStatus(Status.INACTIVE);
        requestRepository.save(request);
    }

    @Override
    public TransfusionRequest getById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // subject = email
        Account account = authenticationRepository.findAccountByEmail(email);
        if (account == null) {
            throw new RuntimeException("Authenticated account not found");
        }
        return account.getId();
    }

    @Override
    public void cancelRequest(Long requestId) {
        Long currentUserId = getCurrentUserId();

        TransfusionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getRecipientId().equals(currentUserId)) {
            throw new RuntimeException("You do not have permission to cancel this request");
        }

        if (request.getStatusRequest() != StatusRequest.PENDING) {
            throw new RuntimeException("Only PENDING requests can be cancelled");
        }

        request.setStatusRequest(StatusRequest.CANCELED);
        requestRepository.save(request);
    }

    @Override
    public void rejectRequest(Long requestId) {
        TransfusionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatusRequest() != StatusRequest.PENDING) {
            throw new RuntimeException("Only PENDING requests can be rejected");
        }

        Long staffId = getCurrentUserId();
        request.setStatusRequest(StatusRequest.REJECTED);
        request.setApprovedBy(staffId.intValue());
        request.setApprovedAt(LocalDateTime.now());

        requestRepository.save(request);
    }

    @Override
    public void approveRequest(Long requestId) {
        TransfusionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Transfusion request not found"));

        if (request.getStatusRequest() != StatusRequest.PENDING) {
            throw new RuntimeException("Only PENDING requests can be approved");
        }

        Long staffId = getCurrentUserId();
        request.setStatusRequest(StatusRequest.APPROVED);
        request.setApprovedBy(staffId.intValue());
        request.setApprovedAt(LocalDateTime.now());

        requestRepository.save(request);
    }

    @Override
    public List<TransfusionRequestResponseDTO> getAllRequests() {
        return requestRepository.findAll().stream()
                .map(entity -> mapper.map(entity, TransfusionRequestResponseDTO.class))
                .toList();
    }
}
