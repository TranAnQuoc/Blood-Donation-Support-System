package com.gtwo.bdss_system.service.donation.impl;

import com.gtwo.bdss_system.entity.donation.DonationHistory;
import com.gtwo.bdss_system.repository.auth.AuthenticationRepository;
import com.gtwo.bdss_system.repository.donation.DonationHistoryRepository;
import com.gtwo.bdss_system.service.donation.DonationHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationHistoryServiceImpl implements DonationHistoryService {

    @Autowired
    private DonationHistoryRepository donationHistoryRepository;

    @Autowired
    private AuthenticationRepository accountRepository;

    @Override
    public List<DonationHistory> getAllHistories() {
        return donationHistoryRepository.findAll();
    }

    @Override
    public DonationHistory getHistoryById(Long id) {
        return donationHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DonationHistory not found with ID: " + id));
    }
}
