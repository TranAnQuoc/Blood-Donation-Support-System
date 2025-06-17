package com.gtwo.bdss_system.controller.emergency;

import com.gtwo.bdss_system.entity.emergency.EmergencyProcess;
import com.gtwo.bdss_system.service.emergency.EmergencyProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-processes")
public class EmergencyProcessAPI {

    @Autowired
    private EmergencyProcessService service;

    @PostMapping
    public ResponseEntity<EmergencyProcess> create(@RequestBody EmergencyProcess process) {
        return ResponseEntity.ok(service.create(process));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmergencyProcess> update(@PathVariable Long id, @RequestBody EmergencyProcess process) {
        EmergencyProcess updated = service.update(id, process);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyProcess> getById(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<EmergencyProcess>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
