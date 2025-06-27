package com.gtwo.bdss_system.service.donation;

import com.gtwo.bdss_system.dto.donation.DonationRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.donation.DonationRequest;
import com.gtwo.bdss_system.enums.StatusRequest;

import java.util.List;

public interface DonationRequestService {
    DonationRequest approvedRequest(Long requestId, StatusRequest decision, String note, Account approver);
    DonationRequest cancelOwnRequest(Long requestId, Account currentUser, String note);
    DonationRequest createRequest(Long scheduleId, Account currentUser);
    List<DonationRequest> getAll();
    DonationRequest getById(Long id);
    DonationRequestDTO requestTable(DonationRequest entity);
    List<DonationRequest> getPendingRequests();
    List<DonationRequestDTO> getAllRequestsByMember(Long userId);
}
