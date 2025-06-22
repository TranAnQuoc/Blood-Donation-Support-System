package com.gtwo.bdss_system.service.donation.impl;

import com.gtwo.bdss_system.dto.donation.DonationHistoryResponseDTO;
import com.gtwo.bdss_system.entity.donation.DonationHistory;
import com.gtwo.bdss_system.repository.auth.AuthenticationRepository;
import com.gtwo.bdss_system.repository.donation.DonationHistoryRepository;
import com.gtwo.bdss_system.service.donation.DonationHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationHistoryServiceImpl implements DonationHistoryService {

    @Autowired
    private DonationHistoryRepository donationHistoryRepository;

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
    public DonationHistory getLatestHistoryByCurrentUser(Long donorId) {
        return donationHistoryRepository.findFirstByDonor_IdOrderByDonationDateDesc(donorId)
                .orElseThrow(() -> new IllegalArgumentException("No donation history found for this user."));
    }
}
