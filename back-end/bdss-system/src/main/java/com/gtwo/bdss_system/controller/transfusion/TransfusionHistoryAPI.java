package com.gtwo.bdss_system.controller.transfusion;

import com.gtwo.bdss_system.dto.transfusion.TransfusionHistoryResponseDTO;
import com.gtwo.bdss_system.entity.transfusion.TransfusionHistory;
import com.gtwo.bdss_system.service.transfusion.TransfusionHistoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@SecurityRequirement(name = "api")
@RestController
@RequestMapping("/api/transfusions/history")
public class TransfusionHistoryAPI {

    private final TransfusionHistoryService service;
    private final ModelMapper mapper;

    public TransfusionHistoryAPI(TransfusionHistoryService service, ModelMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @GetMapping
    public List<TransfusionHistoryResponseDTO> getAll() {
        return service.findAll().stream()
                .map(h -> mapper.map(h, TransfusionHistoryResponseDTO.class))
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @GetMapping("/{id}")
    public TransfusionHistoryResponseDTO getById(@PathVariable Long id) {
        TransfusionHistory h = service.findById(id);
        return mapper.map(h, TransfusionHistoryResponseDTO.class);
    }
}
