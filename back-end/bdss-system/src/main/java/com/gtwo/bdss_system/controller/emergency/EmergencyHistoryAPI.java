package com.gtwo.bdss_system.controller.emergency;

import com.gtwo.bdss_system.dto.emergency.EmergencyHistoryDTO;
import com.gtwo.bdss_system.service.emergency.EmergencyHistoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-histories")
@RequiredArgsConstructor
@SecurityRequirement(name = "api")
public class EmergencyHistoryAPI {

    private final EmergencyHistoryService historyService;

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ResponseEntity<List<EmergencyHistoryDTO>> getAll() {
        return ResponseEntity.ok(historyService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ResponseEntity<EmergencyHistoryDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(historyService.getById(id));
    }

    @PutMapping("/restore/{id}")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        historyService.restore(id);
        return ResponseEntity.ok().build();
    }

}
