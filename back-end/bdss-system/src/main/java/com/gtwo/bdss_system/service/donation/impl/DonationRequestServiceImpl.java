package com.gtwo.bdss_system.service.donation.impl;

import com.gtwo.bdss_system.dto.commons.EmailDetailForDonationApproved;
import com.gtwo.bdss_system.dto.donation.DonationRequestDTO;
import com.gtwo.bdss_system.dto.donation.DonationRequestDetailDTO;
import com.gtwo.bdss_system.dto.donation.DonationSurveyDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.donation.DonationProcess;
import com.gtwo.bdss_system.entity.donation.DonationRequest;
import com.gtwo.bdss_system.entity.donation.DonationEvent;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.repository.donation.DonationRequestRepository;
import com.gtwo.bdss_system.repository.donation.DonationEventRepository;
import com.gtwo.bdss_system.service.commons.EmailService;
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
    private DonationEventRepository scheduleRepository;

    @Autowired
    private DonationProcessService donationProcessService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private EmailService emailService;

    @Override
    public DonationRequest createRequest(Long scheduleId, Account currentUser, DonationSurveyDTO surveyDTO) {
        if (!currentUser.getRole().equals(Role.MEMBER)) {
            throw new IllegalArgumentException("Chỉ người dùng với vai trò MEMBER mới được đăng ký hiến máu.");
        }
        if (currentUser.getDateOfBirth() == null) {
            throw new IllegalArgumentException("Không có thông tin ngày sinh. Vui lòng cập nhật hồ sơ.");
        }
        LocalDate birthDate = currentUser.getDateOfBirth().toLocalDate();
        if (Period.between(birthDate, LocalDate.now()).getYears() < 18) {
            throw new IllegalArgumentException("Người hiến máu phải đủ 18 tuổi để đăng ký hiến máu.");
        }
        List<DonationRequest> previousRequests = repository.findAllByUserIdOrderByRequestTimeDesc(currentUser.getId());
        if (!previousRequests.isEmpty()) {
            DonationRequest lastRequest = previousRequests.get(0);
            if (lastRequest.getStatusRequest() != StatusRequest.CANCELED &&
                    lastRequest.getStatusRequest() != StatusRequest.REJECTED) {
                DonationProcess process = lastRequest.getProcess();
                if (process != null) {
                    switch (process.getProcess()) {
                        case COMPLETED -> {
                            LocalDate completedDate = process.getEndTime().toLocalDate();
                            if (ChronoUnit.WEEKS.between(completedDate, LocalDate.now()) < 12) {
                                throw new IllegalArgumentException("Bạn cần chờ ít nhất 12 tuần sau khi hiến máu để đăng ký lại.");
                            }
                        }
                        case IN_PROCESS, FAILED -> {
                            throw new IllegalArgumentException("Đơn hiến máu trước đó đang trong quá trình xử lý.");
                        }
                    }
                } else {
                    throw new IllegalArgumentException("Bạn đã đăng ký hiến máu và đang chờ xử lý.");
                }
            }
        }
        DonationEvent event = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lịch hiến máu."));
        DonationRequest request = new DonationRequest();
        request.setDonor(currentUser);
        request.setEvent(event);
        request.setRequestTime(LocalDateTime.now());
        // Mapping survey
        request.setIsHealthyToday(surveyDTO.getIsHealthyToday());
        request.setHasSymptoms(surveyDTO.getHasSymptoms());
        request.setHasInfectiousDiseases(surveyDTO.getHasInfectiousDiseases());
        request.setUnsafeSex(surveyDTO.getUnsafeSex());
        request.setRecentSurgeryTattoo(surveyDTO.getRecentSurgeryTattoo());
        request.setRecentVaccination(surveyDTO.getRecentVaccination());
        request.setOnMedication(surveyDTO.getOnMedication());
        request.setHasChronicDisease(surveyDTO.getHasChronicDisease());
        request.setChronicDiseaseNote(surveyDTO.getChronicDiseaseNote());
        request.setLastDonationDays(surveyDTO.getLastDonationDays());
        request.setHadReactionPreviousDonation(surveyDTO.getHadReactionPreviousDonation());
        request.setPreviousReactionNote(surveyDTO.getPreviousReactionNote());
        // Logic tự động xét duyệt
        String autoRejectReason = evaluateSurvey(surveyDTO);
        if (autoRejectReason != null) {
            request.setStatusRequest(StatusRequest.REJECTED);
            request.setNote(autoRejectReason);
        } else {
            request.setStatusRequest(StatusRequest.APPROVED);
            request.setNote("Tự động duyệt dựa trên khảo sát sức khỏe.");
            request.setApprovedTime(LocalDateTime.now());
        }
        DonationRequest savedRequest = repository.save(request);
        // Nếu được duyệt, tự động tạo DonationProcess
        if (savedRequest.getStatusRequest() == StatusRequest.APPROVED) {
            donationProcessService.autoCreateByRequest(savedRequest);
            int approved = repository.countEventIdInRequest(event.getId());
            EmailDetailForDonationApproved mail = new EmailDetailForDonationApproved();
            mail.setToEmail(currentUser.getEmail());
            mail.setSubject("Thông báo phê duyệt đơn hiến máu");
            mail.setDonorName(currentUser.getFullName());
            mail.setEventName(event.getName());
            mail.setDonationDate(event.getDate());
            mail.setStartTime(event.getStartTime());
            mail.setEndTime(event.getEndTime());
            mail.setLocation(event.getAddress());
            emailService.sendDonationApprovedEmail(mail);
            if (approved >= event.getMaxSlot()) {
                event.setStatus(Status.INACTIVE);
                scheduleRepository.save(event);
            }
        }
        return savedRequest;
    }

    private String evaluateSurvey(DonationSurveyDTO dto) {
        if (Boolean.FALSE.equals(dto.getIsHealthyToday())) return "Bạn không cảm thấy khỏe hôm nay.";
        if (Boolean.TRUE.equals(dto.getHasSymptoms())) return "Bạn đang có triệu chứng nghi ngờ bệnh.";
        if (Boolean.TRUE.equals(dto.getHasInfectiousDiseases())) return "Bạn có nguy cơ mắc bệnh truyền nhiễm.";
        if (Boolean.TRUE.equals(dto.getUnsafeSex())) return "Lịch sử quan hệ tình dục không an toàn.";
        if (Boolean.TRUE.equals(dto.getRecentSurgeryTattoo())) return "Bạn vừa trải qua phẫu thuật/xăm.";
        if (Boolean.TRUE.equals(dto.getRecentVaccination())) return "Bạn vừa tiêm vaccine gần đây.";
        if (Boolean.TRUE.equals(dto.getOnMedication())) return "Bạn đang dùng thuốc điều trị.";
        if (Boolean.TRUE.equals(dto.getHasChronicDisease())) return "Bạn có bệnh mãn tính.";
        if (Boolean.TRUE.equals(dto.getHadReactionPreviousDonation())) return "Bạn từng phản ứng khi hiến máu trước.";
        if (dto.getLastDonationDays() != null && dto.getLastDonationDays() < 84) return "Chưa đủ 12 tuần từ lần hiến máu gần nhất.";
        return null;
    }

    @Override
    public DonationRequest cancelOwnRequest(Long requestId, Account currentUser, String note) {
        DonationRequest request = repository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn đăng ký."));
        if (request.getStatusRequest() != StatusRequest.PENDING) {
            throw new IllegalArgumentException("Chỉ có thể hủy đơn khi đang ở trạng thái PENDING.");
        }
        request.setStatusRequest(StatusRequest.CANCELED);
        request.setNote(note);
        return repository.save(request);
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

    public DonationRequestDetailDTO requestTable(DonationRequest entity) {
        DonationRequestDetailDTO dto = new DonationRequestDetailDTO();
        dto.setId(entity.getId());
        dto.setDonorFullName(entity.getDonor().getFullName());
        dto.setDonorGender(entity.getDonor().getGender().toString());
        dto.setDonorBloodType(entity.getDonor().getBloodType());
        dto.setEventName(entity.getEvent().getName());
        dto.setRequestTime(entity.getRequestTime());
        dto.setStatusRequest(entity.getStatusRequest().toString());
        dto.setApprovedTime(entity.getApprovedTime());
        dto.setNote(entity.getNote());
        dto.setIsHealthyToday(entity.getIsHealthyToday());
        dto.setHasSymptoms(entity.getHasSymptoms());
        dto.setHasInfectiousDiseases(entity.getHasInfectiousDiseases());
        dto.setUnsafeSex(entity.getUnsafeSex());
        dto.setRecentSurgeryTattoo(entity.getRecentSurgeryTattoo());
        dto.setRecentVaccination(entity.getRecentVaccination());
        dto.setOnMedication(entity.getOnMedication());
        dto.setHasChronicDisease(entity.getHasChronicDisease());
        dto.setChronicDiseaseNote(entity.getChronicDiseaseNote());
        dto.setLastDonationDays(entity.getLastDonationDays());
        dto.setHadReactionPreviousDonation(entity.getHadReactionPreviousDonation());
        dto.setPreviousReactionNote(entity.getPreviousReactionNote());
        return dto;
    }

    @Override
    public List<DonationRequestDetailDTO> getAllRequestsByMember(Long userId) {
        List<DonationRequest> requests = repository.findAllByUserIdOrderBySubmittedAtDesc(userId);
        return requests.stream()
                .map(entity -> modelMapper.map(entity, DonationRequestDetailDTO.class))
                .toList();
    }
}
