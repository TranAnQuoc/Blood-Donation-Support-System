package com.gtwo.bdss_system.controller.emergency;
import com.gtwo.bdss_system.dto.emergency.EmergencyRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.donation.DonationRequest;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.service.emergency.EmergencyRequestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-requests")
@SecurityRequirement(name = "api")
public class EmergencyRequestAPI {

    @Autowired
    private EmergencyRequestService service;

    @PostMapping
    public ResponseEntity<?> createEmergencyRequest(
            @RequestBody @Valid EmergencyRequestDTO dto,
            @AuthenticationPrincipal Account account) {
        service.createEmergencyRequest(dto, account);
        return ResponseEntity.ok("Emergency request submitted successfully.");
    }
    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<EmergencyRequestDTO>> getAllRequests() {
        List<EmergencyRequestDTO> list = service.getAllRequests();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<EmergencyRequestDTO> getRequestById(@PathVariable Long id) {
        EmergencyRequestDTO dto = service.getRequestById(id);
        return ResponseEntity.ok(dto);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?>  updateRequest(
            @PathVariable Long id,
            @RequestParam boolean accept,
            @RequestParam(required = false) String note,
            @AuthenticationPrincipal Account staff) {
        StatusRequest decision = accept ? StatusRequest.APPROVED : StatusRequest.REJECTED;
        service.updateEmergencyRequest(id, decision, note, staff);
        return ResponseEntity.ok("Update Succesfull");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        service.deleteEmergencyRequest(id);
        return ResponseEntity.ok("Xoá thành công.");
    }

    @PutMapping("/restore/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> restoreRequest(@PathVariable Long id) {
        service.restoreEmergencyRequest(id);
        return ResponseEntity.ok("Khôi phục yêu cầu thành công.");
    }
}
