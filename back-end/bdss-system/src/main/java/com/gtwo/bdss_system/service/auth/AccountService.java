package com.gtwo.bdss_system.service.auth;

import com.gtwo.bdss_system.dto.auth.*;
import com.gtwo.bdss_system.dto.commons.UpdateDonationSettingRequest;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusDonation;

import java.util.List;

public interface AccountService {
    void createByAdmin(AccountCreateDTO dto);
    void updateProfile(Account currentUser, AccountProfileDTO dto);
    Object getProfile(Account currentUser);
    void updateByAdminOrStaff(Long id, AccountUpdateDTO dto);
    List<AccountResponse> getAllByRole(Role role);
    void setSelfStatus(Long selfId, Status status);
    void staffSetStatus(Long staffId, Long targetId, Status status);
    void adminSetStatus(Long adminId, Long targetId, Status status);
    List<DonorSearchResponse> searchAvailableDonors(String bloodType, String location, Account currentUser);
    void updateDonationSettings(Long accountId, UpdateDonationSettingRequest request);
}
