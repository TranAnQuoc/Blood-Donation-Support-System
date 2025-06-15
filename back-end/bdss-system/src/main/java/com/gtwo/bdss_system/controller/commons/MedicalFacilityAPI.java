package com.gtwo.bdss_system.controller.commons;

import com.gtwo.bdss_system.dto.commons.MedicalDTO;
import com.gtwo.bdss_system.entity.commons.MedicalFacility;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.service.commons.MedicalFacilityService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-facilities")
@SecurityRequirement(name = "api")
public class MedicalFacilityAPI {
    @Autowired
    private MedicalFacilityService service;

    @Autowired
    private ModelMapper modelMapper;

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PostMapping
    public ResponseEntity create(@Valid @RequestBody MedicalDTO dto) {
        MedicalFacility entity = modelMapper.map(dto, MedicalFacility.class);
        entity.setStatus(Status.ACTIVE);
        return ResponseEntity.ok(service.create(entity));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public MedicalFacility getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PreAuthorize("permitAll()")
    @GetMapping
    public List<MedicalFacility> getAll() {
        return service.getAll();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PutMapping("/{id}")
    public MedicalFacility update(@PathVariable Long id,@Valid @RequestBody MedicalDTO medicalFacility) {
        MedicalFacility mapped = modelMapper.map(medicalFacility, MedicalFacility.class);
        return service.update(id, mapped);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
