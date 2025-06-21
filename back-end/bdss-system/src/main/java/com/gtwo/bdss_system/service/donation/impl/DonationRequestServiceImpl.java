package com.gtwo.bdss_system.service.donation.impl;

import com.gtwo.bdss_system.dto.donation.DonationRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.donation.DonationProcess;
import com.gtwo.bdss_system.entity.donation.DonationRequest;
import com.gtwo.bdss_system.entity.donation.DonationSchedule;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.repository.donation.DonationRequestRepository;
import com.gtwo.bdss_system.repository.donation.DonationScheduleRepository;
import com.gtwo.bdss_system.service.donation.DonationProcessService;
import com.gtwo.bdss_system.service.donation.DonationRequestService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DonationRequestServiceImpl implements DonationRequestService {

    @Autowired
    private DonationRequestRepository repository;

    @Autowired
    private DonationScheduleRepository scheduleRepository;

    @Autowired
    private DonationProcessService donationProcessService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public DonationRequest createRequest(Long scheduleId, Account currentUser) {
        if (!currentUser.getRole().equals(Role.MEMBER)) {
            throw new IllegalArgumentException("Chỉ người dùng với vai trò MEMBER mới được đăng ký hiến máu.");
        }
        if (currentUser.getDateOfBirth() == null) {
            throw new IllegalArgumentException("Không có thông tin ngày sinh. Vui lòng cập nhật hồ sơ.");
        }
        LocalDate birthDate = currentUser.getDateOfBirth().toLocalDate();
        LocalDate now = LocalDate.now();
        Period age = Period.between(birthDate, now);
        if (age.getYears() < 18) {
            throw new IllegalArgumentException("Người hiến máu phải đủ 18 tuổi để đăng ký hiến máu.");
        }
        List<DonationRequest> previousRequests = repository.findAllByUserIdOrderByRequestTimeDesc(currentUser.getId());
        if (!previousRequests.isEmpty()) {
            DonationRequest lastRequest = previousRequests.get(0);
            DonationProcess process = lastRequest.getProcess();
            if (process != null) {
                switch (process.getProcess()) {
                    case COMPLETED -> {
                        LocalDate completedDate = process.getEndTime().toLocalDate();
                        if (ChronoUnit.WEEKS.between(completedDate, LocalDate.now()) < 12) {
                            throw new IllegalArgumentException("Bạn cần chờ ít nhất 12 tuần sau khi hiến máu để đăng ký lại.");
                        }
                    }
                    case IN_PROCESS -> {
                        throw new IllegalArgumentException("Đơn hiến máu trước đó đang trong quá trình xử lý.");
                    }
                    case FAILED -> {
                    }
                }
            } else {
                throw new IllegalArgumentException("Bạn đã đăng ký hiến máu và đang chờ xử lý.");
            }
        }
        DonationSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lịch hiến máu."));
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
            throw new IllegalStateException("Request already approved");
        }
        request.setStatusRequest(decision);
        request.setApprovedTime(LocalDateTime.now());
        request.setApprover(approver);
        request.setNote(note);
        DonationRequest savedRequest = repository.save(request);
        if (decision == StatusRequest.APPROVED) {
            donationProcessService.autoCreateByRequest(savedRequest);
        }
        DonationSchedule schedule = request.getSchedule();
        int approved = repository.countScheduleIdInRequest(schedule.getId());
        if (approved >= schedule.getMaxSlot()) {
            schedule.setStatus(Status.INACTIVE);
            scheduleRepository.save(schedule);
        }
        return savedRequest;
    }

    @Override
    public DonationRequest cancelOwnRequest(Long requestId, Account currentUser, String note) {
        DonationRequest request = repository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn đăng ký."));
        if (request.getStatusRequest() != StatusRequest.PENDING) {
            throw new IllegalArgumentException("Chỉ có thể hủy đơn khi đang ở trạng thái PENDING.");
        }
        request.setStatusRequest(StatusRequest.CANCELLED);
        request.setNote(note);
        return repository.save(request);
    }

    @Override
    public List<DonationRequest> getAll() {
        return repository.findAll();
    }

    @Override
    public List<DonationRequest> getPendingRequests() {
        return repository.findByStatusRequest(StatusRequest.PENDING);
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

    @Override
    public List<DonationRequestDTO> getAllRequestsByMember(Long userId) {
        List<DonationRequest> requests = repository.findAllByUserIdOrderBySubmittedAtDesc(userId);
        return requests.stream()
                .map(entity -> modelMapper.map(entity, DonationRequestDTO.class))
                .toList();
    }
}
