package com.gtwo.bdss_system.controller.emergency;

import com.gtwo.bdss_system.dto.emergency.EmergencyProcessDTO;
import com.gtwo.bdss_system.dto.emergency.EmergencyProcessFormDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.service.emergency.EmergencyProcessService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-process")
@RequiredArgsConstructor
@SecurityRequirement(name ="api")
public class EmergencyProcessAPI {

    private final EmergencyProcessService emergencyProcessService;

@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@Operation(summary = "Cập nhật quy trình khẩn cấp kèm file hồ sơ sức khỏe")
public ResponseEntity<?> updateEmergencyProcess(
        @PathVariable Long id,
        @ModelAttribute EmergencyProcessFormDTO form,
        @AuthenticationPrincipal Account staff
) {
    emergencyProcessService.updateWithFile(id, form, staff);
    return ResponseEntity.ok("Cập nhật quy trình thành công.");
}
    @GetMapping("/{id}")
    public ResponseEntity<EmergencyProcessDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(emergencyProcessService.getById(id));
    }

    @GetMapping("/by-staff/{staffId}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<EmergencyProcessDTO>> getByStaffId(@PathVariable Long staffId) {
        return ResponseEntity.ok(emergencyProcessService.getByStaffId(staffId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ResponseEntity<List<EmergencyProcessDTO>> getAll() {
        return ResponseEntity.ok(emergencyProcessService.getAll());
    }

    @GetMapping("/emergency-lookup")
    @Operation(summary = "Tra cứu tiến độ xử lý đơn khẩn cấp theo họ tên và số điện thoại")
    public ResponseEntity<List<EmergencyProcessDTO>> lookupProcessStatus(
            @RequestParam String fullName,
            @RequestParam String phone) {
        List<EmergencyProcessDTO> result = emergencyProcessService.lookupByNameAndPhone(fullName, phone);
        return ResponseEntity.ok(result);
    }

}
