package com.gtwo.bdss_system.service.donation;

import com.gtwo.bdss_system.dto.donation.DonationRequestDTO;
import com.gtwo.bdss_system.dto.donation.DonationRequestDetailDTO;
import com.gtwo.bdss_system.dto.donation.DonationSurveyDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.donation.DonationRequest;
import com.gtwo.bdss_system.enums.StatusRequest;

import java.util.List;

public interface DonationRequestService {
    DonationRequest cancelOwnRequest(Long requestId, Account currentUser, String note);
    DonationRequest createRequest(Long scheduleId, Account currentUser, DonationSurveyDTO surveyDTO);
    List<DonationRequest> getAll();
    DonationRequest getById(Long id);
    DonationRequestDetailDTO requestTable(DonationRequest entity);
    List<DonationRequest> getPendingRequests();
    List<DonationRequestDetailDTO> getAllRequestsByMember(Long userId);
}
