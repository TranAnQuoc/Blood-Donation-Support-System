package com.gtwo.bdss_system.controller.donation;

import com.gtwo.bdss_system.dto.donation.DonationScheduleDTO;
import com.gtwo.bdss_system.entity.donation.DonationSchedule;
import com.gtwo.bdss_system.service.donation.DonationScheduleService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@SecurityRequirement(name = "api")
public class DonationScheduleAPI {

    @Autowired
    private DonationScheduleService service;

    @GetMapping
    @PreAuthorize("permitAll()")
    public List<DonationSchedule> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<DonationSchedule> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PreAuthorize("hasRole('STAFF')")
    @PostMapping
    public ResponseEntity<DonationSchedule> create(@Valid @RequestBody DonationScheduleDTO schedule) {
        DonationSchedule mapped = service.create(schedule);
        return ResponseEntity.ok(mapped);
    }

    @PreAuthorize("hasRole('STAFF')")
    @PutMapping("/{id}")
    public ResponseEntity<DonationSchedule> update(@PathVariable Long id,@Valid @RequestBody DonationScheduleDTO schedule) {
        return ResponseEntity.ok(service.update(id, schedule));
    }

    @PreAuthorize("hasRole('STAFF')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
