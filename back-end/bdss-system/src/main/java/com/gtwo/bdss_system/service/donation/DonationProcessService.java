package com.gtwo.bdss_system.service.donation;

import com.gtwo.bdss_system.dto.auth.AccountResponse;
import com.gtwo.bdss_system.dto.donation.DonationProcessDTO;
import com.gtwo.bdss_system.dto.donation.DonationProcessViewDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.donation.DonationProcess;
import com.gtwo.bdss_system.entity.donation.DonationRequest;

import java.util.List;

public interface DonationProcessService {
    DonationProcess getById(Long id);
    List<DonationProcess> getAllActive();
    DonationProcess update(Long processId, DonationProcessDTO dto);
    void delete(Long id);
    void restore(Long id);
    DonationProcess autoCreateByRequest(DonationRequest request);
    DonationProcessViewDTO processViewDTO(DonationProcess entity);
    DonationProcessDTO getMyLatestProcess(Long userId);
}
