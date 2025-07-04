package com.gtwo.bdss_system.controller.transfusion;

import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestDTO;
import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestResponseDTO;
import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;
import com.gtwo.bdss_system.service.transfusion.TransfusionRequestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@SecurityRequirement(name = "api")
@RestController
@RequestMapping("/api/transfusion-requests")
@RequiredArgsConstructor
public class TransfusionRequestAPI {

    private final TransfusionRequestService requestService;
    private final ModelMapper mapper;

    @PreAuthorize("hasRole('MEMBER')")
    @PostMapping
    public ResponseEntity<TransfusionRequestResponseDTO> createRequest(@RequestBody TransfusionRequestDTO dto) {
        TransfusionRequest entity = requestService.createRequest(dto);
        TransfusionRequestResponseDTO resp = mapper.map(entity, TransfusionRequestResponseDTO.class);
        return ResponseEntity.ok(resp);
    }


    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> softDelete(@PathVariable Integer id) {
        requestService.softDelete(id);
        return ResponseEntity.noContent().build();
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    @GetMapping("/{id}")
    public ResponseEntity<TransfusionRequestResponseDTO> getById(@PathVariable Long id) {
        TransfusionRequest entity = requestService.getById(id);
        TransfusionRequestResponseDTO dto = new TransfusionRequestResponseDTO();
        dto.setId(Long.valueOf(entity.getId())); // nếu getId() trả về Integer
        dto.setRecipientId(entity.getRecipientId());
        dto.setBloodComponentNeeded(entity.getBloodComponentNeeded());
        dto.setQuantityNeeded(entity.getQuantityNeeded());
        dto.setDoctorDiagnosis(entity.getDoctorDiagnosis());
        dto.setPreCheckNotes(entity.getPreCheckNotes());
        dto.setRequestedAt(entity.getRequestedAt());
        dto.setStatusRequest(entity.getStatusRequest());
        dto.setStatus(entity.getStatus());
        return ResponseEntity.ok(dto);
    }


}