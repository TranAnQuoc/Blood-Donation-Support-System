package com.gtwo.bdss_system.controller.emergency;
import com.gtwo.bdss_system.dto.emergency.EmergencyRequestDTO;
import com.gtwo.bdss_system.service.emergency.EmergencyRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emergency-requests/guest")
public class EmergencyRequestAPI {

    @Autowired
    private EmergencyRequestService service;

    @PostMapping
    public ResponseEntity<?> createEmergencyRequest(@RequestBody EmergencyRequestDTO dto) {
        service.createEmergencyRequest(dto);
        return ResponseEntity.ok("Emergency request submitted successfully.");
    }
}
