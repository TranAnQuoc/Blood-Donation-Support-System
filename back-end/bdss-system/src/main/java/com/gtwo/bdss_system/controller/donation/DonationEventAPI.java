package com.gtwo.bdss_system.controller.donation;

import com.gtwo.bdss_system.dto.donation.DonationEventDTO;
import com.gtwo.bdss_system.entity.donation.DonationEvent;
import com.gtwo.bdss_system.service.donation.DonationEventService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/event")
@SecurityRequirement(name = "api")
public class DonationEventAPI {

    @Autowired
    private DonationEventService service;

    @GetMapping
    public List<DonationEvent> getAll() {
        return service.getAll();
    }

    @GetMapping("staff-view")
    @PreAuthorize("hasRole('STAFF')")
    public List<DonationEvent> getAllForStaff() {
        return service.getAllForStaff();
    }

    @GetMapping("/by-date")
    public ResponseEntity<List<DonationEvent>> getByDateRange(
            @RequestParam("from") @DateTimeFormat(pattern = "yyyy-MM-dd") Date from,
            @RequestParam("to") @DateTimeFormat(pattern = "yyyy-MM-dd") Date to) {
        return ResponseEntity.ok(service.getByDateRange(from, to));
    }

    @PreAuthorize("hasRole('STAFF')")
    @PostMapping
    public ResponseEntity<DonationEvent> create(@Valid @RequestBody DonationEventDTO schedule) {
        DonationEvent mapped = service.create(schedule);
        return ResponseEntity.ok(mapped);
    }

    @PreAuthorize("hasRole('STAFF')")
    @PutMapping("/{id}")
    public ResponseEntity<DonationEvent> update(@PathVariable Long id, @Valid @RequestBody DonationEventDTO schedule) {
        return ResponseEntity.ok(service.update(id, schedule));
    }

    @PreAuthorize("hasRole('STAFF')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('STAFF')")
    @DeleteMapping("/restore/{id}")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        service.restore(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<DonationEvent>> searchByName(@RequestParam String keyword) {
        return ResponseEntity.ok(service.searchByName(keyword));
    }
}
