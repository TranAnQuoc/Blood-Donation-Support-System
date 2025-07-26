package com.gtwo.bdss_system.controller.donation;

import com.gtwo.bdss_system.dto.donation.DonationRequestDTO;
import com.gtwo.bdss_system.dto.donation.DonationRequestDetailDTO;
import com.gtwo.bdss_system.dto.donation.DonationSurveyDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.donation.DonationRequest;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.service.donation.DonationRequestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
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
            @Valid @RequestBody DonationSurveyDTO surveyDTO,
            @AuthenticationPrincipal Account currentUser) {
        DonationRequest newRequest = service.createRequest(scheduleId, currentUser, surveyDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newRequest);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @PutMapping("/cancel/{id}")
    public ResponseEntity<DonationRequest> cancelOwnRequest(
            @PathVariable Long id,
            @RequestParam(required = false) String note,
            @AuthenticationPrincipal Account currentUser) {
        DonationRequest cancelled = service.cancelOwnRequest(id, currentUser, note);
        return ResponseEntity.ok(cancelled);
    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DonationRequestDetailDTO>> getAll() {
        List<DonationRequest> requests = service.getAll();
        List<DonationRequestDetailDTO> dtoList = requests.stream()
                .map(request -> donationRequestService.requestTable(request))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/search/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<DonationRequestDetailDTO> getById(@PathVariable Long id) {
        DonationRequest entity = service.getById(id);
        DonationRequestDetailDTO dto = service.requestTable(entity);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<List<DonationRequestDetailDTO>> getMyRequests(@AuthenticationPrincipal Account user) {
        Long userId = user.getId();
        List<DonationRequestDetailDTO> dtos = service.getAllRequestsByMember(userId);
        return ResponseEntity.ok(dtos);
    }
}
