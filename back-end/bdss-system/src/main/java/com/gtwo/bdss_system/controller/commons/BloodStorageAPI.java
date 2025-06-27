package com.gtwo.bdss_system.controller.commons;

import com.gtwo.bdss_system.dto.commons.BloodStorageDTO;
import com.gtwo.bdss_system.dto.commons.BloodStorageUseDTO;
import com.gtwo.bdss_system.dto.commons.VerifiedNote;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodStorage;
import com.gtwo.bdss_system.enums.StatusBloodStorage;
import com.gtwo.bdss_system.service.commons.BloodStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-storage")
public class BloodStorageAPI {

    @Autowired
    private BloodStorageService service;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody BloodStorageDTO dto, @AuthenticationPrincipal Account creater) {
        return ResponseEntity.ok(service.create(dto, creater));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id, @AuthenticationPrincipal Account approver) {
        return ResponseEntity.ok(service.approve(id, approver));
    }

    @PutMapping("/{id}/use")
    public ResponseEntity<?> use(@PathVariable Long id, @RequestBody BloodStorageUseDTO dto, @AuthenticationPrincipal Account user) {
        dto.setTakeBy(user);
        return ResponseEntity.ok(service.use(id, dto));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verify(@PathVariable Long id, @RequestBody VerifiedNote verifiedNote, @AuthenticationPrincipal Account verifier) {
        return ResponseEntity.ok(service.verify(id, verifiedNote,verifier));
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/status")
    public ResponseEntity<?> getByStatus(@RequestParam("status") StatusBloodStorage status) {
        List<BloodStorage> result = service.getByStatus(status);
        return ResponseEntity.ok(result);
    }
}
