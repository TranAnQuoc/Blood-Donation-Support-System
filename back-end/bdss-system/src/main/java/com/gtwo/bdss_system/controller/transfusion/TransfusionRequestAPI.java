package com.gtwo.bdss_system.controller.transfusion;

import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestDTO;
import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestResponseDTO;
import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;
import com.gtwo.bdss_system.service.transfusion.TransfusionRequestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@SecurityRequirement(name = "api")
@RestController
@RequestMapping("/api/transfusions/requests")
public class TransfusionRequestAPI {

    private final TransfusionRequestService service;
    private final ModelMapper mapper;

    public TransfusionRequestAPI(TransfusionRequestService service, ModelMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    @PostMapping
    public ResponseEntity<TransfusionRequestResponseDTO> create(
            @Validated @RequestBody TransfusionRequestDTO dto) {
        TransfusionRequest req = service.create(dto);
        TransfusionRequestResponseDTO resp = mapper.map(req, TransfusionRequestResponseDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    @GetMapping
    public List<TransfusionRequestResponseDTO> getAll() {
        return service.findAll().stream()
                .map(r -> mapper.map(r, TransfusionRequestResponseDTO.class))
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    @GetMapping("/{id}")
    public ResponseEntity<TransfusionRequestResponseDTO> getById(@PathVariable Long id) {
        TransfusionRequest req = service.findById(id);
        TransfusionRequestResponseDTO resp = mapper.map(req, TransfusionRequestResponseDTO.class);
        return ResponseEntity.ok(resp);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    @PutMapping("/{id}")
    public ResponseEntity<TransfusionRequestResponseDTO> update(@PathVariable Long id,
                                                                @Validated @RequestBody TransfusionRequestDTO dto) {
        TransfusionRequest updated = service.update(id, dto);
        TransfusionRequestResponseDTO resp = mapper.map(updated, TransfusionRequestResponseDTO.class);
        return ResponseEntity.ok(resp);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
