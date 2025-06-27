package com.gtwo.bdss_system.controller.commons;

import com.gtwo.bdss_system.enums.StatusBloodStorage;
import com.gtwo.bdss_system.service.commons.BloodStorageHistoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/blood-storage-history")
@SecurityRequirement(name = "api")
public class BloodStorageHistoryAPI {

    @Autowired
    private BloodStorageHistoryService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> getByStatus(@RequestParam StatusBloodStorage status) {
        if (status != StatusBloodStorage.IN_USED && status != StatusBloodStorage.TRANSFERRED) {
            return ResponseEntity.badRequest().body("Chỉ được truy xuất lịch sử với status IN_USED hoặc TRANSFERRED.");
        }
        return ResponseEntity.ok(service.getByStatus(status));
    }
}
