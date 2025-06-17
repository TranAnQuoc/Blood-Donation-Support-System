package com.gtwo.bdss_system.controller.emergency;
import com.gtwo.bdss_system.dto.emergency.EmergencyRequestDTO;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.service.emergency.EmergencyRequestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emergency-requests")
@RequiredArgsConstructor
@SecurityRequirement(name = "api")
public class EmergencyRequestAPI {

    private final EmergencyRequestService emergencyRequestService;

    @PostMapping
    @PreAuthorize("hasAnyRole('MEMBER','STAFF')")
    public ResponseEntity<EmergencyRequest> create(@RequestBody EmergencyRequestDTO dto) {
        EmergencyRequest created = emergencyRequestService.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

}