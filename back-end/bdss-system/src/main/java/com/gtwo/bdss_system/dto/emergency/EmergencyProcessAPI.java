package com.gtwo.bdss_system.controller.emergency;

import com.gtwo.bdss_system.dto.emergency.EmergencyProcessDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.service.emergency.EmergencyProcessService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-process")
@RequiredArgsConstructor
@SecurityRequirement(name ="api")
public class EmergencyProcessAPI {

    private final EmergencyProcessService emergencyProcessService;

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<EmergencyProcessDTO> updateProcess(
            @PathVariable Long id,
            @Valid @RequestBody EmergencyProcessDTO dto,
            @AuthenticationPrincipal Account account) {
        EmergencyProcessDTO updated = emergencyProcessService.update(id, dto, account);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyProcessDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(emergencyProcessService.getById(id));
    }

    @GetMapping("/by-staff/{staffId}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<EmergencyProcessDTO>> getByStaffId(@PathVariable Long staffId) {
        return ResponseEntity.ok(emergencyProcessService.getByStaffId(staffId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ResponseEntity<List<EmergencyProcessDTO>> getAll() {
        return ResponseEntity.ok(emergencyProcessService.getAll());
    }
}
