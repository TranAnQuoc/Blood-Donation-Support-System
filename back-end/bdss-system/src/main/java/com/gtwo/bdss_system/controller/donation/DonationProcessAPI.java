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
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<DonationProcessViewDTO>> getAll() {
        List<DonationProcess> processes = service.getAllActive();
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
    public ResponseEntity<DonationProcess> update(@PathVariable Long id,
                                                  @RequestBody DonationProcessDTO dto,
                                                  @AuthenticationPrincipal Account currentUser) {
        DonationProcess updated = service.update(id, dto, currentUser);
        DonationProcess response = mapper.map(updated, DonationProcess.class);
        return ResponseEntity.ok(response);
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

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/my-process")
    public ResponseEntity<DonationProcessDTO> getMyProcess(@AuthenticationPrincipal Account user) {
        Long userId = user.getId();
        DonationProcessDTO dto = service.getMyLatestProcess(userId);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/auto-setup")
    public ResponseEntity<String> autoSetup() {
        service.autoSetupExpiredProcesses();
        return ResponseEntity.ok("Đã cập nhật các đơn quá hạn.");
    }
}
