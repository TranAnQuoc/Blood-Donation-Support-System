package com.gtwo.bdss_system.controller.donation;

import com.gtwo.bdss_system.dto.donation.DonationRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.donation.DonationRequest;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.service.donation.DonationRequestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/donation-requests")
@SecurityRequirement(name = "api")
public class DonationRequestAPI {

    @Autowired
    private DonationRequestService service;

    @Autowired
    private DonationRequestService donationRequestService;

    @PreAuthorize("hasAnyRole('MEMBER', 'STAFF')")
    @PostMapping("/register/{scheduleId}")
    public ResponseEntity<DonationRequest> registerRequest(
            @PathVariable Long scheduleId,
            @AuthenticationPrincipal Account currentUser) {
        DonationRequest newRequest = service.createRequest(scheduleId, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(newRequest);
    }

    @PreAuthorize("hasRole('STAFF')")
    @PutMapping("/{id}/approved")
    public ResponseEntity<DonationRequest> approvedRequest(
            @PathVariable Long id,
            @RequestParam boolean accept,
            @RequestParam(required = false) String note,
            @AuthenticationPrincipal Account staff) {
        StatusRequest decision = accept ? StatusRequest.APPROVED : StatusRequest.REJECTED;
        DonationRequest updated = service.approvedRequest(id, decision, note, staff);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @PutMapping("/{id}/cancel-own")
    public ResponseEntity<DonationRequest> cancelOwnRequest(
            @PathVariable Long id,
            @RequestParam(required = false) String note,
            @AuthenticationPrincipal Account currentUser) {
        DonationRequest cancelled = service.cancelOwnRequest(id, currentUser, note);
        return ResponseEntity.ok(cancelled);
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<DonationRequestDTO>> getAll() {
        List<DonationRequest> requests = service.getAll();
        List<DonationRequestDTO> dtoList = requests.stream()
                .map(request -> donationRequestService.requestTable(request))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<DonationRequestDTO> getById(@PathVariable Long id) {
        DonationRequest entity = service.getById(id);
        DonationRequestDTO dto = service.requestTable(entity);
        return ResponseEntity.ok(dto);
    }
}
