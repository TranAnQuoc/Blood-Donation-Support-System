package com.gtwo.bdss_system.service.donation.impl;

import com.gtwo.bdss_system.dto.donation.DonationHistoryResponseDTO;
import com.gtwo.bdss_system.entity.donation.DonationHistory;
import com.gtwo.bdss_system.enums.StatusProcess;
import com.gtwo.bdss_system.repository.donation.DonationHistoryRepository;
import com.gtwo.bdss_system.service.commons.EmailService;
import com.gtwo.bdss_system.service.donation.DonationHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DonationHistoryServiceImpl implements DonationHistoryService {

    @Autowired
    private DonationHistoryRepository donationHistoryRepository;

    @Autowired
    private EmailService mailService;

    @Override
    public List<DonationHistoryResponseDTO> getAllHistories() {
        return donationHistoryRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DonationHistoryResponseDTO getHistoryById(Long id) {
        DonationHistory history = donationHistoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("DonationHistory not found with ID: " + id));
        return mapToDTO(history);
    }

    private DonationHistoryResponseDTO mapToDTO(DonationHistory history) {
        DonationHistoryResponseDTO dto = new DonationHistoryResponseDTO();
        dto.setId(history.getId());
        dto.setStaffName(history.getStaff() != null ? history.getStaff().getFullName() : null);
        dto.setDonorName(history.getFullName());
        dto.setDonorPhone(history.getPhone());
        dto.setDonorGender(history.getGender() != null ? history.getGender().name() : null);
        dto.setDonorDateOfBirth(history.getDateOfBirth());
        dto.setBloodType(history.getBloodType());
        dto.setDonationDate(history.getDonationDate());
        dto.setDonationType(history.getDonationType());
        dto.setQuantity(history.getQuantity());
        dto.setAddress(history.getAddress());
        dto.setNote(history.getNote());
        dto.setStatus(history.getStatus() != null ? history.getStatus().name() : null);
        return dto;
    }

    @Override
    public List<DonationHistory> getAllHistoryByDonorId(Long donorId) {
        return donationHistoryRepository.findAllByDonor_IdOrderByDonationDateDesc(donorId);
    }

    @Override
    public void scanAndSendReminderToAllEligible() {
        List<DonationHistory> completedHistories = donationHistoryRepository.findByStatus(StatusProcess.COMPLETED);
        Map<Long, DonationHistory> latestDonationMap = new HashMap<>();
        for (DonationHistory history : completedHistories) {
            Long donorId = history.getDonor().getId();
            if (!latestDonationMap.containsKey(donorId)
                    || history.getDonationDate().after(latestDonationMap.get(donorId).getDonationDate())) {
                latestDonationMap.put(donorId, history);
            }
        }
        for (DonationHistory lastHistory : latestDonationMap.values()) {
            LocalDate nextEligibleDate = calculateNextEligibleDate(lastHistory);
            LocalDate today = LocalDate.now();
            if (!today.isBefore(nextEligibleDate)) {
                mailService.sendReminderEmail(lastHistory.getDonor(), nextEligibleDate);
            }
        }
    }

    private LocalDate calculateNextEligibleDate(DonationHistory history) {
        if (history == null || history.getDonationDate() == null) {
            return LocalDate.now();
        }
        LocalDate lastDate = history.getDonationDate().toLocalDate();
        return lastDate.plusDays(84);
    }
}
