package com.gtwo.bdss_system.controller.commons;

import com.gtwo.bdss_system.dto.commons.BloodStorageDTO;
import com.gtwo.bdss_system.dto.commons.BloodStorageUseDTO;
import com.gtwo.bdss_system.service.commons.BloodStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blood-storage")
public class BloodStorageAPI {

    @Autowired
    private BloodStorageService service;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody BloodStorageDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id, @RequestParam Long approverId) {
        return ResponseEntity.ok(service.approve(id, approverId));
    }

    @PutMapping("/{id}/use")
    public ResponseEntity<?> use(@PathVariable Long id, @RequestBody BloodStorageUseDTO dto) {
        return ResponseEntity.ok(service.use(id, dto));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verify(@PathVariable Long id, @RequestParam Long verifierId) {
        return ResponseEntity.ok(service.verify(id, verifierId));
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailable(@RequestParam String bloodType, @RequestParam String component) {
        return ResponseEntity.ok(service.getAvailable(bloodType, component));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory() {
        return ResponseEntity.ok(service.getHistory());
    }
}
