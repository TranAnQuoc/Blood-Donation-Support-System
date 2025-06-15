package com.gtwo.bdss_system.service.donation.impl;

import com.gtwo.bdss_system.dto.donation.DonationRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.donation.DonationRequest;
import com.gtwo.bdss_system.entity.donation.DonationSchedule;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.repository.donation.DonationRequestRepository;
import com.gtwo.bdss_system.repository.donation.DonationScheduleRepository;
import com.gtwo.bdss_system.service.donation.DonationProcessService;
import com.gtwo.bdss_system.service.donation.DonationRequestService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonationRequestServiceImpl implements DonationRequestService {

    @Autowired
    private DonationRequestRepository repository;

    @Autowired
    private DonationScheduleRepository scheduleRepository;

    @Autowired
    private DonationProcessService donationProcessService;

    @Override
    public DonationRequest createRequest(Long scheduleId, Account currentUser) {
        DonationSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        DonationRequest request = new DonationRequest();
        request.setDonor(currentUser);
        request.setSchedule(schedule);
        request.setRequestTime(LocalDateTime.now());
        request.setStatusRequest(StatusRequest.PENDING);
        request.setApprover(null);
        request.setApprovedTime(null);
        request.setNote(null);

        return repository.save(request);
    }

    @Override
    public DonationRequest approvedRequest(Long requestId, StatusRequest decision, String note, Account approver) {
        DonationRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        if (request.getStatusRequest() == StatusRequest.APPROVED) {
            throw new IllegalStateException("Request already processed");
        }
        request.setStatusRequest(decision);
        request.setApprovedTime(LocalDateTime.now());
        request.setApprover(approver);
        request.setNote(note);
        DonationRequest savedRequest = repository.save(request);
        if (decision == StatusRequest.APPROVED) {
            donationProcessService.autoCreateByRequest(savedRequest);
        }
        return savedRequest;
    }

    @Override
    public List<DonationRequest> getAll() {
        return repository.findAll();
    }

    @Override
    public DonationRequest getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("DonationRequest not found or inactive"));
    }

    public DonationRequestDTO requestTable(DonationRequest entity) {
        DonationRequestDTO dto = new DonationRequestDTO();
        dto.setId(entity.getId());
        dto.setDonorFullName(entity.getDonor().getFullName());
        dto.setDonorGender(entity.getDonor().getGender().toString());
        dto.setDonorBloodType(entity.getDonor().getBloodType());
        dto.setScheduleName(entity.getSchedule().getName());
        dto.setMedicalFacilityName(entity.getSchedule().getFacility().getName());
        dto.setRequestTime(entity.getRequestTime());
        dto.setStatusRequest(entity.getStatusRequest().toString());
        if (entity.getApprover() != null) {
            dto.setApproverFullName(entity.getApprover().getFullName());
            dto.setApprovedTime(entity.getApprovedTime());
        }
        dto.setNote(entity.getNote());
        return dto;
    }
}
