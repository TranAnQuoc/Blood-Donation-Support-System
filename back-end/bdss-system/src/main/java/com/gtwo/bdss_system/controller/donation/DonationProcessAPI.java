package com.gtwo.bdss_system.controller.donation;

import com.gtwo.bdss_system.dto.donation.DonationProcessDTO;
import com.gtwo.bdss_system.dto.donation.DonationProcessViewDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.donation.DonationProcess;
import com.gtwo.bdss_system.service.donation.DonationProcessService;
import com.gtwo.bdss_system.service.donation.DonationRequestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/donation-processes")
@SecurityRequirement(name = "api")
public class DonationProcessAPI {
    @Autowired
    private DonationProcessService service;

    @Autowired
    private ModelMapper mapper;

    @GetMapping("/list")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<DonationProcessViewDTO>> getAll() {
        List<DonationProcess> processes = service.getAllActive();
        List<DonationProcessViewDTO> dto = processes.stream()
                .map(process -> service.processViewDTO(process))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/all-list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DonationProcessViewDTO>> getAllAdmin () {
        List<DonationProcess> processes = service.getAll();
        List<DonationProcessViewDTO> dto = processes.stream()
                .map(process -> service.processViewDTO(process))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/search/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DonationProcessViewDTO> getById(@PathVariable Long id) {
        DonationProcess entity = service.getById(id);
        DonationProcessViewDTO dto = service.processViewDTO(entity);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('STAFF')")
    @PutMapping("/edit/{id}")
    public ResponseEntity<DonationProcessViewDTO> update(@PathVariable Long id,
                                                  @RequestBody DonationProcessDTO dto,
                                                  @AuthenticationPrincipal Account currentUser) {
        DonationProcess updated = service.update(id, dto, currentUser);
        DonationProcessViewDTO viewDto = mapper.map(updated, DonationProcessViewDTO.class);
        return ResponseEntity.ok(viewDto);
    }

    @PreAuthorize("hasRole('STAFF')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('STAFF')")
    @PutMapping("/restore/{id}")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        service.restore(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/start/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> startDonationProcess(@PathVariable Long id) {
        DonationProcess started = service.startDonationProcess(id);
        return ResponseEntity.ok(started);
    }


    @GetMapping("/my-process")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<DonationProcessViewDTO> getMyProcess(@AuthenticationPrincipal Account user) {
        Long userId = user.getId();
        DonationProcessViewDTO dto = service.getMyLatestProcess(userId);
        return ResponseEntity.ok(dto);
    }
}
