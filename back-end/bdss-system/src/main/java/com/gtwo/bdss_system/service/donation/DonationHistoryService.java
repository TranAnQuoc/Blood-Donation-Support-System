package com.gtwo.bdss_system.service.donation;

import com.gtwo.bdss_system.dto.donation.DonationHistoryResponseDTO;
import com.gtwo.bdss_system.entity.donation.DonationHistory;

import java.util.List;

public interface DonationHistoryService {
    List<DonationHistoryResponseDTO> getAllHistories();
    DonationHistoryResponseDTO getHistoryById(Long id);
    List<DonationHistory> getAllHistoryByDonorId(Long donorId);
}
