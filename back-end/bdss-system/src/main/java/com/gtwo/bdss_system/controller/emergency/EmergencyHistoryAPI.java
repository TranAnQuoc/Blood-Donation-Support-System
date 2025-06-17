package com.gtwo.bdss_system.controller.emergency;

import com.gtwo.bdss_system.entity.emergency.EmergencyHistory;
import com.gtwo.bdss_system.service.emergency.EmergencyHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-histories")
public class EmergencyHistoryAPI {

    @Autowired
    private EmergencyHistoryService service;

    @PostMapping
    public ResponseEntity<EmergencyHistory> create(@RequestBody EmergencyHistory history) {
        return ResponseEntity.ok(service.create(history));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmergencyHistory> update(@PathVariable Long id, @RequestBody EmergencyHistory history) {
        EmergencyHistory updated = service.update(id, history);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyHistory> getById(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<EmergencyHistory>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}