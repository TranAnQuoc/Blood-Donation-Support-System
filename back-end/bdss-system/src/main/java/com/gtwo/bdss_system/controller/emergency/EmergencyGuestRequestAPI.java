package com.gtwo.bdss_system.controller.emergency;
import com.gtwo.bdss_system.dto.emergency.EmergencyGuestRequestDTO;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.service.emergency.EmergencyGuestRequestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emergency-requests/guest")
@RequiredArgsConstructor
@SecurityRequirement(name = "api")
public class EmergencyGuestRequestAPI {

    private final EmergencyGuestRequestService emergencyGuestService;

    @PostMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<EmergencyRequest> createByGuest(@RequestBody EmergencyGuestRequestDTO dto) {
        EmergencyRequest saved = emergencyGuestService.create(dto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
