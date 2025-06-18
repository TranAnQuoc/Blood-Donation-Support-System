package com.gtwo.bdss_system.controller.emergency;
import com.gtwo.bdss_system.dto.emergency.EmergencyGuestRequestDTO;
import com.gtwo.bdss_system.service.emergency.EmergencyGuestRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emergency-requests/guest")
public class EmergencyGuestRequestAPI {

    @Autowired
    private EmergencyGuestRequestService service;

    @PostMapping
    public ResponseEntity<?> createEmergencyRequest(@RequestBody EmergencyGuestRequestDTO dto) {
        service.createEmergencyRequest(dto);
        return ResponseEntity.ok("Emergency request submitted successfully.");
    }
}
