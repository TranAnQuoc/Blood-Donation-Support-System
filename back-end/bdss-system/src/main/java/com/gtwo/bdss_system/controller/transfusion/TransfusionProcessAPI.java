package com.gtwo.bdss_system.controller.transfusion;

import com.gtwo.bdss_system.dto.transfusion.TransfusionProcessDTO;
import com.gtwo.bdss_system.dto.transfusion.TransfusionProcessResponseDTO;
import com.gtwo.bdss_system.entity.transfusion.TransfusionProcess;
import com.gtwo.bdss_system.service.transfusion.TransfusionProcessService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@SecurityRequirement(name = "api")
@RestController
@RequestMapping("/api/transfusion-requests")
public class TransfusionProcessAPI {

    private final TransfusionProcessService service;
    private final ModelMapper mapper;

    public TransfusionProcessAPI(TransfusionProcessService service, ModelMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @Operation(summary = "Tạo hoặc cập nhật quá trình truyền máu theo request ID")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tạo thành công"),
            @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ"),
            @ApiResponse(responseCode = "403", description = "Không có quyền")
    })
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PostMapping("/{requestId}/process")
    public ResponseEntity<TransfusionProcessResponseDTO> createOrUpdate(
            @PathVariable Long requestId,
            @Validated @RequestBody TransfusionProcessDTO dto) {
        TransfusionProcess proc = service.createOrUpdate(requestId, dto);
        TransfusionProcessResponseDTO resp = mapper.map(proc, TransfusionProcessResponseDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @GetMapping("/processes")
    public List<TransfusionProcessResponseDTO> getAll() {
        return service.findAll().stream()
                .map(p -> mapper.map(p, TransfusionProcessResponseDTO.class))
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @GetMapping("/{requestId}/process")
    public ResponseEntity<TransfusionProcessResponseDTO> getByRequestId(@PathVariable Long requestId) {
        TransfusionProcess proc = service.findByRequestId(requestId);
        TransfusionProcessResponseDTO resp = mapper.map(proc, TransfusionProcessResponseDTO.class);
        return ResponseEntity.ok(resp);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @DeleteMapping("/{requestId}/process")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long requestId) {
        service.delete(requestId);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PutMapping("/processes/{id}")
    public ResponseEntity<TransfusionProcessResponseDTO> updateProcessById(
            @PathVariable Long id,
            @Validated @RequestBody TransfusionProcessDTO dto) {

        TransfusionProcess proc = service.updateById(id, dto);
        TransfusionProcessResponseDTO resp = mapper.map(proc, TransfusionProcessResponseDTO.class);
        return ResponseEntity.ok(resp);
    }

}
