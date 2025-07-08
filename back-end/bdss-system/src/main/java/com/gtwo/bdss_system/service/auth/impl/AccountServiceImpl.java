package com.gtwo.bdss_system.service.auth.impl;

import com.gtwo.bdss_system.dto.auth.*;
import com.gtwo.bdss_system.dto.commons.UpdateDonationSettingRequest;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.entity.donation.DonationHistory;
import com.gtwo.bdss_system.enums.*;
import com.gtwo.bdss_system.repository.auth.AccountRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
import com.gtwo.bdss_system.repository.donation.DonationHistoryRepository;
import com.gtwo.bdss_system.service.auth.AccountService;
import com.gtwo.bdss_system.service.commons.EmailService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private BloodTypeRepository bloodTypeRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private EmailService emailService;

    @Autowired
    private DonationHistoryRepository donationHistoryRepository;

    @Override
    public void createByAdmin(AccountCreateDTO dto) {
        if (dto.getRole() == Role.MEMBER) {
            throw new IllegalArgumentException("Admin cannot create MEMBER accounts");
        }
        if (accountRepo.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (accountRepo.existsByPhone(dto.getPhone())) {
            throw new IllegalArgumentException("Phone already in use");
        }
        if (accountRepo.existsByCCCD(dto.getCCCD())) {
            throw new IllegalArgumentException("CCCD already in use");
        }
        if (!dto.getCCCD().matches("\\d{12}")) {
            throw new IllegalArgumentException("CCCD must be exactly 12 digits");
        }
        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setPassword(passwordEncoder.encode(dto.getPassword()));
        account.setFullName(dto.getFullName());
        account.setGender(dto.getGender());
        account.setRole(dto.getRole());
        account.setDateOfBirth(dto.getDateOfBirth());
        account.setPhone(dto.getPhone());
        account.setAddress(dto.getAddress());
        account.setStatus(Status.ACTIVE);
        account.setStatusDonation(StatusDonation.INACTIVE);
        account.setCCCD(dto.getCCCD());
        BloodType bloodType = bloodTypeRepo.findById(dto.getBloodTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid blood type ID"));
        account.setBloodType(bloodType);
        emailService.sendLoginStaffAccount(dto);
        accountRepo.save(account);
    }

    @Override
    public void updateProfile(Account currentUser, AccountProfileDTO dto) {
        boolean phoneInUse = accountRepo.existsByPhone(dto.getPhone())
                && !dto.getPhone().equals(currentUser.getPhone());
        if (phoneInUse) {
            throw new IllegalArgumentException("Phone number already in use");
        }
        currentUser.setFullName(dto.getFullName());
        currentUser.setGender(dto.getGender());
        currentUser.setDateOfBirth(dto.getDateOfBirth());
        currentUser.setPhone(dto.getPhone());
        currentUser.setAddress(dto.getAddress());
        currentUser.setStatusDonation(dto.getStatusDonation());
        accountRepo.save(currentUser);
    }

    @Override
    public void updateDonationSettings(Long accountId, UpdateDonationSettingRequest request) {
        Account account = accountRepo.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (request.getStatusDonation() != null) {
            if (request.getStatusDonation() == StatusDonation.AVAILABLE) {
                Long count = donationHistoryRepository.countCompletedByAccount(accountId, StatusProcess.COMPLETED);
                if (count == 0) {
                    throw new IllegalArgumentException("Bạn chưa từng hiến máu thành công tại BDSC, không thể sử dụng dịch vụ sẵn sàng hiến máu.");
                }
            }
            account.setStatusDonation(request.getStatusDonation());
        }
        if (request.getPhoneVisibility() != null) {
            account.setPhoneVisibility(request.getPhoneVisibility());
        }
        accountRepo.save(account);
    }

    @Override
    public Object getProfile(Account currentUser) {
        if (currentUser.getRole() == Role.MEMBER) {
            AccountProfileDTO dto = modelMapper.map(currentUser, AccountProfileDTO.class);
            if (currentUser.getBloodType() != null) {
                dto.setBloodType(currentUser.getBloodType());
            }
            return dto;
        } else {
            AccountResponse response = modelMapper.map(currentUser, AccountResponse.class);
            response.setToken(null);
            return response;
        }
    }

    @Override
    public void updateByAdminOrStaff(Long id, AccountUpdateDTO dto) {
        Account acc = accountRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        boolean phoneInUse = accountRepo.existsByPhone(dto.getPhone())
                && !dto.getPhone().equals(acc.getPhone());
        if (phoneInUse) {
            throw new IllegalArgumentException("Phone number already in use");
        }
        acc.setFullName(dto.getFullName());
        acc.setGender(dto.getGender());
        acc.setDateOfBirth(dto.getDateOfBirth());
        acc.setPhone(dto.getPhone());
        acc.setAddress(dto.getAddress());
        acc.setStatusDonation(dto.getStatusDonation());
        if (dto.getBloodTypeId() != null) {
            BloodType bt = bloodTypeRepo.findById(dto.getBloodTypeId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid blood type ID"));
            acc.setBloodType(bt);
        }
        accountRepo.save(acc);
    }

    @Override
    public List<AccountResponse> getAllByRole(Role role) {
        List<Account> accounts = accountRepo.findAllByRole(role);
        return accounts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void setSelfStatus(Long selfId, Status status) {
        Account self = accountRepo.findById(selfId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (self.getRole() != Role.MEMBER)
            throw new IllegalArgumentException("Only members can update their own status");
        self.setStatus(status);
        accountRepo.save(self);
    }

    @Override
    public void staffSetStatus(Long staffId, Long targetId, Status status) {
        if (staffId.equals(targetId))
            throw new IllegalArgumentException("Staff cannot modify their own account");
        Account target = accountRepo.findById(targetId)
                .orElseThrow(() -> new IllegalArgumentException("Target account not found"));
        if (target.getRole() != Role.MEMBER)
            throw new IllegalArgumentException("Staff can only modify MEMBER accounts");
        accountRepo.save(updateStatus(target, status));
    }

    @Override
    public void adminSetStatus(Long adminId, Long targetId, Status status) {
        Account target = accountRepo.findById(targetId)
                .orElseThrow(() -> new IllegalArgumentException("Target account not found"));
        if (target.getRole() == Role.MEMBER)
            throw new IllegalArgumentException("Admin cannot modify MEMBER accounts");
        accountRepo.save(updateStatus(target, status));
    }

    private Account updateStatus(Account account, Status status) {
        account.setStatus(status);
        return account;
    }

    public AccountResponse mapToResponse(Account account) {
        return modelMapper.map(account, AccountResponse.class);
    }

    public void updateDonationStatus(Account account, StatusDonation newStatus, PhoneVisibility phoneVisibility) {
        if (newStatus == StatusDonation.AVAILABLE) {
            List<DonationHistory> completedHistories = donationHistoryRepository.findByDonorAndStatus(account, StatusProcess.COMPLETED);

            if (completedHistories.isEmpty()) {
                throw new IllegalArgumentException("Bạn chưa từng hiến máu trước đây, không thể chuyển trạng thái sang AVAILABLE.");
            }
            DonationHistory lastHistory = completedHistories.stream()
                    .max(Comparator.comparing(DonationHistory::getDonationDate))
                    .orElseThrow();
            LocalDate lastDate = lastHistory.getDonationDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            LocalDate nextEligibleDate = lastDate.plusDays(84);
            LocalDate today = LocalDate.now();
            if (today.isBefore(nextEligibleDate)) {
                throw new IllegalArgumentException("Bạn vẫn đang trong thời gian phục hồi, không thể chuyển trạng thái sang AVAILABLE trước " + nextEligibleDate + ".");
            }
        }
        account.setStatusDonation(newStatus);
        account.setPhoneVisibility(phoneVisibility);
        accountRepo.save(account);
    }

    @Override
    public List<DonorSearchResponse> searchAvailableDonors(String bloodType, String location, Account currentUser) {
        String type = null;
        String rhFactor = null;
        if (bloodType.endsWith("+") || bloodType.endsWith("-")) {
            type = bloodType.substring(0, bloodType.length() - 1).toUpperCase();
            rhFactor = bloodType.substring(bloodType.length() - 1); // + hoặc -
        } else {
            type = bloodType.toUpperCase();
            rhFactor = null; // không giới hạn Rh
        }
        List<Account> donors;
        if (rhFactor != null) {
            // Tìm chính xác cả type và Rh
            donors = accountRepo.searchAvailableDonorsByTypeAndRh(
                    StatusDonation.AVAILABLE, type, rhFactor, location
            );
        } else {
            // Tìm theo type, không quan tâm Rh
            donors = accountRepo.searchAvailableDonorsByType(
                    StatusDonation.AVAILABLE, type, location
            );
        }
        boolean isMember = (currentUser != null && currentUser.getRole() == Role.MEMBER);
        return donors.stream().map(donor -> {
            DonorSearchResponse dto = new DonorSearchResponse();
            dto.setFullName(donor.getFullName());
            dto.setLocation(donor.getAddress());
            if (isMember) {
                if (donor.getPhoneVisibility() == PhoneVisibility.PUBLIC) {
                    dto.setPhone(donor.getPhone());
                    dto.setNote("");
                } else {
                    dto.setPhone("0123456789 thông tin liên lạc của cơ sở y tế");
                    dto.setNote("Hãy liên lạc với cơ sở y tế để được hỗ trợ kết nối với người hiến máu.");
                }
            } else {
                dto.setNote("Hãy đăng nhập để xem thông tin liên lạc về member này.");
            }
            dto.setBloodType(donor.getBloodType() != null ? donor.getBloodType().getType() : null);
            dto.setRhFactor(donor.getBloodType() != null ? donor.getBloodType().getRhFactor() : null);
            return dto;
        }).toList();
    }
}

