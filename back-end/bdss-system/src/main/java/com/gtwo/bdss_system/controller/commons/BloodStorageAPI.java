package com.gtwo.bdss_system.controller.commons;

import com.gtwo.bdss_system.dto.commons.*;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodStorage;
import com.gtwo.bdss_system.enums.StatusBloodStorage;
import com.gtwo.bdss_system.service.commons.BloodStorageService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-storage")
@SecurityRequirement(name = "api")
public class BloodStorageAPI {

    @Autowired
    private BloodStorageService service;

    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> create(@Valid @RequestBody BloodStorageDTO dto, @AuthenticationPrincipal Account creater) {
        return ResponseEntity.ok(service.create(dto, creater));
    }

    @PutMapping("/approve/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approve(@PathVariable Long id, @RequestBody ApproveRequestDTO dto, @AuthenticationPrincipal Account approver) {
        return ResponseEntity.ok(service.approve(id, dto, approver));
    }

    @PutMapping("/use/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> use(@PathVariable Long id, @RequestBody BloodStorageUseDTO dto, @AuthenticationPrincipal Account user) {
        return ResponseEntity.ok(service.use(id, dto, user));
    }

    @PutMapping("/verify/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verify(@PathVariable Long id, @RequestBody VerifiedNote verifiedNote, @AuthenticationPrincipal Account verifier) {
        return ResponseEntity.ok(service.verify(id, verifiedNote,verifier));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> getByStatus(@RequestParam("status") StatusBloodStorage status) {
        List<BloodStorageResponseDTO> result = service.getByStatus(status);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<BloodStorageResponseDTO>> searchByTypeRhComponent(
            @RequestParam(required = false) Long bloodTypeId,
            @RequestParam(required = false) Long bloodComponentId) {
        return ResponseEntity.ok(service.searchByTypeRhComponent(bloodTypeId, bloodComponentId));
    }
}
