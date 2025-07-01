package com.gtwo.bdss_system.controller.commons;

import com.gtwo.bdss_system.dto.auth.DonorSearchResponse;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.service.auth.AccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search-donor")
@SecurityRequirement(name = "api")
public class SearchDonorAPI {

    @Autowired
    private AccountService accountService;

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<DonorSearchResponse>> searchDonors(
            @RequestParam String bloodType,
            @RequestParam String location,
            @AuthenticationPrincipal Account currentUser
    ) {
        List<DonorSearchResponse> result = accountService.searchAvailableDonors(bloodType, location, currentUser);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/member")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<List<DonorSearchResponse>> searchDonorsForMember(
            @RequestParam String bloodType,
            @RequestParam String location,
            @AuthenticationPrincipal Account currentUser
    ) {
        List<DonorSearchResponse> result = accountService.searchAvailableDonors(bloodType, location, currentUser);
        return ResponseEntity.ok(result);
    }
}
