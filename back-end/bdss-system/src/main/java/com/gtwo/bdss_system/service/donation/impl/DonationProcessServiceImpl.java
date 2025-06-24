package com.gtwo.bdss_system.service.donation.impl;

import com.gtwo.bdss_system.dto.donation.DonationProcessDTO;
import com.gtwo.bdss_system.dto.donation.DonationProcessViewDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.entity.donation.DonationHistory;
import com.gtwo.bdss_system.entity.donation.DonationProcess;
import com.gtwo.bdss_system.entity.donation.DonationRequest;
import com.gtwo.bdss_system.entity.donation.DonationEvent;
import com.gtwo.bdss_system.enums.Gender;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    public DonationProcess update(Long processId, DonationProcessDTO dto, Account performer) {
        DonationProcess existing = getById(processId);
        if (existing.getProcess() == StatusProcess.WAITING && existing.getDate() != null) {
            LocalDate processDate = existing.getDate();
            LocalDate today = LocalDate.now();
            if (processDate.isAfter(today)) {
                throw new IllegalStateException("Chưa đến ngày thực hiện, không thể chỉnh sửa quy trình hiến máu.");
            }
        }
        LocalDateTime now = LocalDateTime.now();
        existing.setStartTime(existing.getStartTime() == null ? now : existing.getStartTime());
        existing.setEndTime(now);
        existing.setPerformer(performer);
        StatusProcess inputStatus = dto.getProcess();
        if (inputStatus == StatusProcess.COMPLETED) {
            if (dto.getBloodPressure() == null || !dto.getBloodPressure().matches("\\d{2,3}/\\d{2,3}")) {
                throw new IllegalArgumentException("Huyết áp không hợp lệ. Ví dụ hợp lệ: 120/80");
            }
            if (dto.getQuantity() <= 249 || dto.getQuantity() > 500) {
                throw new IllegalArgumentException("Lượng máu hiến phải nằm trong khoảng 250 - 500 ml.");
            }
            if (dto.getType() == null) {
                throw new IllegalArgumentException("Loại hiến máu không được để trống.");
            }
            if (dto.getHeartRate() == null || !dto.getHeartRate().matches("\\d{2,3}")) {
                throw new IllegalArgumentException("Nhịp tim không hợp lệ. Vui lòng nhập số từ 60 đến 100.");
            } else {
                int heartRateValue = Integer.parseInt(dto.getHeartRate());
                if (heartRateValue < 60 || heartRateValue > 100) {
                    throw new IllegalArgumentException("Nhịp tim phải từ 60 đến 100 lần/phút.");
                }
            }
            if (dto.getTemperature() == null || dto.getTemperature() < 36.0 || dto.getTemperature() > 37.5) {
                throw new IllegalArgumentException("Nhiệt độ cơ thể phải từ 36.0°C đến 37.5°C.");
            }
            if (dto.getHeight() == null || dto.getHeight() < 145) {
                throw new IllegalArgumentException("Chiều cao phải từ 145 cm trở lên.");
            }
            if (dto.getWeight() == null) {
                throw new IllegalArgumentException("Cân nặng không được để trống.");
            }
            Gender gender = existing.getRequest().getDonor().getGender();
            if (gender == Gender.MALE && dto.getWeight() < 45) {
                throw new IllegalArgumentException("Nam giới phải nặng ít nhất 45 kg để hiến máu.");
            }
            if (gender == Gender.FEMALE && dto.getWeight() < 42) {
                throw new IllegalArgumentException("Nữ giới phải nặng ít nhất 42 kg để hiến máu.");
            }
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
        existing.setDate(dto.getDate());
        existing.setHealthCheck(dto.isHealthCheck());
        existing.setHeartRate(dto.getHeartRate());
        existing.setTemperature(dto.getTemperature());
        existing.setWeight(dto.getWeight());
        existing.setHeight(dto.getHeight());
        existing.setHemoglobin(dto.getHemoglobin());
        existing.setBloodPressure(dto.getBloodPressure());
        existing.setHasChronicDisease(dto.getHasChronicDisease());
        existing.setHasRecentTattoo(dto.getHasRecentTattoo());
        existing.setHasUsedDrugs(dto.getHasUsedDrugs());
        existing.setScreeningNote(dto.getScreeningNote());
        existing.setQuantity(dto.getQuantity());
        existing.setNotes(dto.getNotes());
        existing.setType(dto.getType());
        existing.setProcess(dto.getProcess());
        existing.setPerformer(performer);

        StatusProcess currentStatus = existing.getProcess();
        if (currentStatus != StatusProcess.COMPLETED &&
                currentStatus != StatusProcess.FAILED &&
                currentStatus != StatusProcess.SCREENING_FAILED &&
                currentStatus != StatusProcess.DONOR_CANCEL) {
            if (Boolean.TRUE.equals(dto.getHasChronicDisease()) ||
                    Boolean.TRUE.equals(dto.getHasRecentTattoo()) ||
                    Boolean.TRUE.equals(dto.getHasUsedDrugs())) {
                existing.setProcess(StatusProcess.SCREENING_FAILED);
            } else if (Boolean.FALSE.equals(dto.getHasChronicDisease()) ||
                    Boolean.FALSE.equals(dto.getHasRecentTattoo()) ||
                    Boolean.FALSE.equals(dto.getHasUsedDrugs())) {
                existing.setProcess(StatusProcess.SCREENING);
            } else {
                existing.setProcess(StatusProcess.IN_PROCESS);
            }
        }
        StatusProcess newStatus = existing.getProcess();
        if (newStatus == StatusProcess.COMPLETED) {
            existing.setStatus(Status.INACTIVE);
            createDonationHistory(existing);
        } else if (newStatus == StatusProcess.FAILED ||
                newStatus == StatusProcess.SCREENING_FAILED ||
                newStatus == StatusProcess.DONOR_CANCEL) {
            createDonationHistory(existing);
        }
        DonationProcess saved = processRepository.save(existing);
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
        DonationEvent event = request.getEvent();
        process.setRequest(request);
        process.setDate(event.getDate());
        process.setStatus(Status.ACTIVE);
        process.setProcess(StatusProcess.WAITING);
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
        DonationEvent event = entity.getRequest().getEvent();
        dto.setEventName(event.getName());
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
        StatusProcess p = process.getProcess();
        if (p != StatusProcess.COMPLETED &&
                p != StatusProcess.FAILED &&
                p != StatusProcess.SCREENING_FAILED &&
                p != StatusProcess.DONOR_CANCEL) {
            return;
        }
        DonationRequest request = process.getRequest();
        Account donor = request.getDonor();
        DonationEvent event = request.getEvent();
        DonationHistory history = new DonationHistory();
        history.setStaff(process.getPerformer());
        history.setDonor(donor);
        history.setFullName(donor.getFullName());
        history.setPhone(donor.getPhone());
        history.setGender(donor.getGender());
        history.setAddress(event.getAddress());
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
        history.setNote(process.getNotes());
        history.setStatus(p);
        if (p == StatusProcess.COMPLETED) {
            process.setStatus(Status.INACTIVE);
        }
        historyRepository.save(history);
    }

    @Override
    public DonationProcessDTO getMyLatestProcess(Long userId) {
        DonationProcess process = processRepository.findLatestByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Bạn chưa có tiến trình hiến máu nào."));
        return modelMapper.map(process, DonationProcessDTO.class);
    }

    @Transactional
    public void autoSetupExpiredProcesses() {
        LocalDate today = LocalDate.now();
        List<DonationProcess> pendingProcesses = processRepository.findByProcess(StatusProcess.WAITING);
        for (DonationProcess process : pendingProcesses) {
            DonationEvent event = process.getRequest().getEvent();
            if (event != null) {
                LocalDate eventDate = event.getDate();
                if (eventDate.isBefore(today)) {
                    process.setProcess(StatusProcess.DONOR_CANCEL);
                    process.setStatus(Status.INACTIVE);
                    process.setNotes("Người dùng không tham gia hoạt động hiến đúng ngày.");
                    processRepository.save(process);
                    createDonationHistory(process);
                }
            }
        }
        for (DonationProcess process : pendingProcesses) {
            DonationEvent event = process.getRequest().getEvent();
            if (event != null) {
                LocalDate eventDate = event.getDate();
                if (eventDate.isEqual(today)) {
                    process.setProcess(StatusProcess.IN_PROCESS);
                    processRepository.save(process);
                }
            }
        }
    }
}
