package com.gtwo.bdss_system.controller.emergency;
import com.gtwo.bdss_system.dto.emergency.EmergencyRequestDTO;
import com.gtwo.bdss_system.dto.emergency.EmergencyRequestFormDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.service.emergency.EmergencyRequestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-requests")
@SecurityRequirement(name = "api")
public class EmergencyRequestAPI {

    @Autowired
    private EmergencyRequestService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Tạo yêu cầu khẩn cấp kèm ảnh")
    public ResponseEntity<?> createEmergencyRequest(
            @ModelAttribute EmergencyRequestFormDTO form,
            @AuthenticationPrincipal Account account) {

        EmergencyRequestDTO dto = new EmergencyRequestDTO();
        dto.setFullName(form.getFullName());
        dto.setPhone(form.getPhone());
        dto.setCccd(form.getCccd());
        dto.setBloodTypeId(form.getBloodTypeId());
        dto.setBloodComponentId(form.getBloodComponentId());
        dto.setQuantity(form.getQuantity());
        dto.setLocation(form.getLocation());
        dto.setEmergencyProof(form.getEmergencyProof());
        dto.setStatusRequest(StatusRequest.PENDING);
        dto.setEmergencyPlace(form.getEmergencyPlace());
        service.createEmergencyRequest(dto, form.getProofImage(), account);
        return ResponseEntity.ok("Yêu cầu khẩn cấp đã được gửi.");
    }

    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<EmergencyRequestDTO>> getAllRequests() {
        List<EmergencyRequestDTO> list = service.getAllRequests();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<EmergencyRequestDTO> getRequestById(@PathVariable Long id) {
        EmergencyRequestDTO dto = service.getRequestById(id);
        return ResponseEntity.ok(dto);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?>  updateRequest(
            @PathVariable Long id,
            @RequestParam boolean accept,
            @RequestParam(required = false) String note,
            @AuthenticationPrincipal Account staff) {
        StatusRequest decision = accept ? StatusRequest.APPROVED : StatusRequest.REJECTED;
        service.updateEmergencyRequest(id, decision, note, staff);
        return ResponseEntity.ok("Update Succesfull");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        service.deleteEmergencyRequest(id);
        return ResponseEntity.ok("Xoá thành công.");
    }

    @PutMapping("/restore/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> restoreRequest(@PathVariable Long id) {
        service.restoreEmergencyRequest(id);
        return ResponseEntity.ok("Khôi phục yêu cầu thành công.");
    }

}
