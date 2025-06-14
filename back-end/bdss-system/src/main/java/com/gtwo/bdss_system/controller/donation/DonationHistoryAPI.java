package com.gtwo.bdss_system.controller.donation;

import com.gtwo.bdss_system.entity.donation.DonationHistory;
import com.gtwo.bdss_system.service.donation.DonationHistoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donation-histories")
@SecurityRequirement(name = "api")
public class DonationHistoryAPI {

    @Autowired
    private DonationHistoryService donationHistoryService;

    @GetMapping("/all")
    @PreAuthorize("permitAll()")
    public List<DonationHistory> getAll() {
        return donationHistoryService.getAllHistories();
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public DonationHistory getById(@PathVariable Long id) {
        return donationHistoryService.getHistoryById(id);
    }
}
