package com.gtwo.bdss_system.controller.commons;

import com.gtwo.bdss_system.entity.commons.EmergencyHotline;
import com.gtwo.bdss_system.service.commons.EmergencyHotlineService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotlines")
@SecurityRequirement(name = "api")
public class EmergencyHotlineAPI {

    private final EmergencyHotlineService service;

    public EmergencyHotlineAPI(EmergencyHotlineService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<EmergencyHotline> getAll() {
        return service.getAll();
    }

    @GetMapping("/staff")
    @PreAuthorize("hasRole('STAFF')")
    public List<EmergencyHotline> getForStaff() {
        return service.getForStaff();
    }

    @GetMapping("/address")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public List<EmergencyHotline> getByAddress(@RequestParam String address) {
        return service.getByAddress(address);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public EmergencyHotline create(@RequestBody @Valid EmergencyHotline hotline) {
        return service.create(hotline);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public EmergencyHotline update(@PathVariable Long id, @RequestBody @Valid EmergencyHotline hotline) {
        return service.update(id, hotline);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PutMapping("/restore/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void restore(@PathVariable Long id) {
        service.restore(id);
    }
}
