package com.gtwo.bdss_system.service.donation;

import com.gtwo.bdss_system.entity.donation.DonationHistory;

import java.util.List;

public interface DonationHistoryService {
    List<DonationHistory> getAllHistories();
    DonationHistory getHistoryById(Long id);
}
