package com.gtwo.bdss_system.service.donation.impl;

import com.gtwo.bdss_system.dto.donation.DonationProcessDTO;
import com.gtwo.bdss_system.dto.donation.DonationProcessViewDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.entity.commons.MedicalFacility;
import com.gtwo.bdss_system.entity.donation.DonationHistory;
import com.gtwo.bdss_system.entity.donation.DonationProcess;
import com.gtwo.bdss_system.entity.donation.DonationRequest;
import com.gtwo.bdss_system.entity.donation.DonationSchedule;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusProcess;
import com.gtwo.bdss_system.repository.auth.AuthenticationRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
import com.gtwo.bdss_system.repository.donation.DonationHistoryRepository;
import com.gtwo.bdss_system.repository.donation.DonationProcessRepository;
import com.gtwo.bdss_system.service.donation.DonationProcessService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
public class DonationProcessServiceImpl implements DonationProcessService {

    @Autowired
    private DonationProcessRepository processRepository;

    @Autowired
    private AuthenticationRepository accountRepository;

    @Autowired
    private BloodTypeRepository bloodTypeRepository;

    @Autowired
    private DonationHistoryRepository historyRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public DonationProcess getById(Long id) {
        return processRepository.findById(id)
                .filter(p -> p.getStatus() == Status.ACTIVE)
                .orElseThrow(() -> new EntityNotFoundException("Process not found or inactive"));
    }

    @Override
    public List<DonationProcess> getAllActive() {
        return processRepository.findAllByStatus(Status.ACTIVE);
    }

    @Override
    public DonationProcess update(Long processId, DonationProcessDTO dto) {
        DonationProcess existing = getById(processId);
        if (dto.getPerformerId() == null) {
            throw new IllegalArgumentException("Người thực hiện không được để trống.");
        }
        Account performer = accountRepository.findById(dto.getPerformerId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người thực hiện với ID: " + dto.getPerformerId()));
        if (!performer.getRole().equals(Role.STAFF)) {
            throw new IllegalArgumentException("Chỉ nhân viên (STAFF) mới được phép thực hiện quy trình.");
        }
        if (dto.getDate() == null || dto.getStartTime() == null || dto.getEndTime() == null) {
            throw new IllegalArgumentException("Ngày và thời gian bắt đầu, kết thúc không được để trống.");
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime start;
        LocalDateTime end;
        try {
            start = LocalDateTime.parse(dto.getDate() + " " + dto.getStartTime(), formatter);
            end = LocalDateTime.parse(dto.getDate() + " " + dto.getEndTime(), formatter);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Định dạng ngày/giờ không hợp lệ. VD: date='2025-06-15', time='08:00'");
        }
        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("Thời gian kết thúc phải sau thời gian bắt đầu.");
        }
        if (dto.getBloodPressure() == null || !dto.getBloodPressure().matches("\\d{2,3}/\\d{2,3}")) {
            throw new IllegalArgumentException("Huyết áp không hợp lệ. Ví dụ hợp lệ: 120/80");
        }
        if (dto.getQuantity() <= 249 || dto.getQuantity() > 500) {
            throw new IllegalArgumentException("Lượng máu hiến phải nằm trong khoảng 250 - 500 ml.");
        }
        if (dto.getType() == null) {
            throw new IllegalArgumentException("Loại hiến máu không được để trống.");
        }
        if (dto.getBloodTypeId() != null) {
            if (dto.getBloodTypeId() == 1L || !bloodTypeRepository.existsById(dto.getBloodTypeId())) {
                throw new IllegalArgumentException("Nhóm máu không hợp lệ.");
            }
            BloodType newBloodType = bloodTypeRepository.findById(dto.getBloodTypeId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhóm máu với ID: " + dto.getBloodTypeId()));
            Account donor = existing.getRequest().getDonor();
            if (donor.getBloodType() == null || "Unknown".equalsIgnoreCase(donor.getBloodType().getType())) {
                donor.setBloodType(newBloodType);
                accountRepository.save(donor);
            }
        }
        existing.setStartTime(start);
        existing.setEndTime(end);
        existing.setHealthCheck(dto.isHealthCheck());
        existing.setHemoglobin(dto.getHemoglobin());
        existing.setBloodPressure(dto.getBloodPressure());
        existing.setQuantity(dto.getQuantity());
        existing.setNotes(dto.getNotes());
        existing.setType(dto.getType());
        existing.setProcess(dto.getProcess());
        existing.setPerformer(performer);
        DonationProcess saved = processRepository.save(existing);
        if (dto.getProcess() == StatusProcess.COMPLETED || dto.getProcess() == StatusProcess.FAILED) {
            createDonationHistory(saved);
        }
        return saved;
    }

    @Override
    public void delete(Long id) {
        DonationProcess process = getById(id);
        process.setStatus(Status.INACTIVE);
        processRepository.save(process);
    }

    @Override
    public void restore(Long id) {
        DonationProcess process = processRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Process not found"));
        process.setStatus(Status.ACTIVE);
        processRepository.save(process);
    }

    @Override
    public DonationProcess autoCreateByRequest(DonationRequest request) {
        DonationProcess process = new DonationProcess();
        process.setRequest(request);
        process.setStatus(Status.ACTIVE);
        process.setProcess(StatusProcess.IN_PROCESS);
        return processRepository.save(process);
    }

    public DonationProcessViewDTO processViewDTO(DonationProcess entity) {
        DonationProcessViewDTO dto = new DonationProcessViewDTO();
        dto.setId(entity.getId());
        Account donor = entity.getRequest().getDonor();
        dto.setDonorFullName(donor.getFullName());
        dto.setDonorBirthDate(donor.getDateOfBirth().toLocalDate());
        dto.setDonorPhone(donor.getPhone());
        dto.setDonorGender(donor.getGender().toString());
        dto.setDonorBloodType(donor.getBloodType());
        DonationSchedule schedule = entity.getRequest().getSchedule();
        dto.setScheduleName(schedule.getName());
        dto.setFacilityName(schedule.getFacility().getName());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setHealthCheck(entity.getHealthCheck() != null ? entity.getHealthCheck() : false);
        dto.setHemoglobin(entity.getHemoglobin());
        dto.setBloodPressure(entity.getBloodPressure());
        dto.setQuantity(entity.getQuantity());
        dto.setNotes(entity.getNotes());
        dto.setTypeDonation(entity.getType());
        dto.setProcess(entity.getProcess());
        if (entity.getPerformer() != null) {
            dto.setPerformerFullName(entity.getPerformer().getFullName());
        }
        return dto;
    }

    @Transactional
    public void createDonationHistory(DonationProcess process) {
        if (process.getProcess() != StatusProcess.COMPLETED && process.getProcess() != StatusProcess.FAILED) {
            return;
        }
        DonationRequest request = process.getRequest();
        Account donor = request.getDonor();
        DonationSchedule schedule = request.getSchedule();
        MedicalFacility facility = schedule.getFacility();
        DonationHistory history = new DonationHistory();
        history.setStaff(process.getPerformer());
        history.setDonor(donor);
        history.setFullName(donor.getFullName());
        history.setPhone(donor.getPhone());
        history.setGender(donor.getGender());
        history.setDateOfBirth(donor.getDateOfBirth());
        BloodType bloodType = donor.getBloodType();
        if (bloodType != null) {
            history.setBloodType(bloodType.getType() + bloodType.getRhFactor());
        } else {
            history.setBloodType("Unknown");
        }
        history.setDonationDate(java.sql.Date.valueOf(process.getEndTime().toLocalDate()));
        history.setDonationType(process.getType().toString());
        history.setQuantity(process.getQuantity());
        history.setFacilityName(facility.getName());
        history.setAddress(facility.getAddress());
        history.setNote(process.getNotes());
        history.setStatus(process.getProcess());
        process.setStatus(Status.INACTIVE);
        historyRepository.save(history);
    }

    @Override
    public DonationProcessDTO getMyLatestProcess(Long userId) {
        DonationProcess process = processRepository.findLatestByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Bạn chưa có tiến trình hiến máu nào."));
        return modelMapper.map(process, DonationProcessDTO.class);
    }
}
