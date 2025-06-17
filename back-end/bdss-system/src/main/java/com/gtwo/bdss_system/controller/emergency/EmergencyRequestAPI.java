package com.gtwo.bdss_system.controller.emergency;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.service.emergency.EmergencyRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-requests")
public class EmergencyRequestAPI {

    @Autowired
    private EmergencyRequestService service;

    @PostMapping
    public ResponseEntity<EmergencyRequest> create(@RequestBody EmergencyRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmergencyRequest> update(@PathVariable Long id, @RequestBody EmergencyRequest request) {
        EmergencyRequest updated = service.update(id, request);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyRequest> getById(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<EmergencyRequest>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}