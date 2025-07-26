package com.gtwo.bdss_system.controller.transfusion;

import com.gtwo.bdss_system.dto.transfusion.RequestOwnerDTO;
import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;
import com.gtwo.bdss_system.service.transfusion.TransfusionRequestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SecurityRequirement(name = "api")
@RestController
@RequestMapping("/api/transfusion-requests")
@RequiredArgsConstructor
public class TransfusionRequestAPI {

    private final TransfusionRequestService service;

    @PostMapping
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<TransfusionRequestDTO> create(@RequestBody @Valid TransfusionRequestDTO dto,
                                                        @AuthenticationPrincipal Account currentUser) {
        return ResponseEntity.ok(service.create(dto, currentUser));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<TransfusionRequestDTO> update(@PathVariable Long id,
                                                        @RequestBody @Valid TransfusionRequestDTO dto,
                                                        @AuthenticationPrincipal Account currentUser) {
        return ResponseEntity.ok(service.update(id, dto, currentUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'MEMBER')")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal Account currentUser) {
        service.delete(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/restore")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<Void> restore(@PathVariable Long id,
                                        @AuthenticationPrincipal Account currentUser) {
        service.restore(id, currentUser);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<List<RequestOwnerDTO>> getMyRequests(@AuthenticationPrincipal Account currentUser) {
        return ResponseEntity.ok(service.getMyRequests(currentUser));
    }

    @GetMapping("/view")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<List<TransfusionRequestDTO>> getView() {
        return ResponseEntity.ok(service.getView());
    }

    @GetMapping("/all-list")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<RequestOwnerDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
