// src/main/java/com/gtwo/bdss_system/controller/emergency/EmergencyLookupAPI.java (Tạo file mới)
package com.gtwo.bdss_system.controller.emergency;

import com.gtwo.bdss_system.dto.emergency.EmergencyRequestDTO;
import com.gtwo.bdss_system.service.emergency.EmergencyRequestService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emergency-lookup") // Base URL mới cho controller này
public class EmergencyLookupAPI {

    @Autowired
    private EmergencyRequestService service;

    @GetMapping // Endpoint này sẽ trở thành /api/emergency-lookup
    @Operation(summary = "Tra cứu yêu cầu khẩn cấp bằng họ tên và số điện thoại (không cần đăng nhập)")
    public ResponseEntity<?> lookupRequest(
            @RequestParam String fullName,
            @RequestParam String phone) {
        try {
            EmergencyRequestDTO dto = service.findByFullNameAndPhone(fullName, phone);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            // Có thể dùng HttpStatus.NOT_FOUND nếu bạn muốn rõ ràng hơn
            return ResponseEntity.status(404).body("Không tìm thấy yêu cầu phù hợp.");
        }
    }
}