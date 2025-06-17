package com.gtwo.bdss_system.controller.donation;

import com.gtwo.bdss_system.dto.donation.DonationHistoryResponseDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.donation.DonationHistory;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.service.donation.DonationHistoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donation-histories")
@SecurityRequirement(name = "api")
public class DonationHistoryAPI {

    @Autowired
    private DonationHistoryService donationHistoryService;

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public List<DonationHistoryResponseDTO> getAll() {
        return donationHistoryService.getAllHistories();
    }

    @GetMapping("/search/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public DonationHistoryResponseDTO getById(@PathVariable Long id) {
        return donationHistoryService.getHistoryById(id);
    }

    @GetMapping("/my-latest")
    @PreAuthorize("hasAnyRole('MEMBER')")
    public ResponseEntity<DonationHistory> getMyLatestDonationHistory(
            @AuthenticationPrincipal Account currentUser) {
        DonationHistory latestHistory = donationHistoryService
                .getLatestHistoryByCurrentUser(currentUser.getId());
        return ResponseEntity.ok(latestHistory);
    }
}
