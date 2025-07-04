package com.gtwo.bdss_system.controller.transfusion;

import com.gtwo.bdss_system.dto.transfusion.TransfusionHistoryResponseDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.transfusion.TransfusionHistory;
import com.gtwo.bdss_system.repository.auth.AuthenticationRepository;
import com.gtwo.bdss_system.repository.transfusion.TransfusionHistoryRepository;
import com.gtwo.bdss_system.service.transfusion.TransfusionHistoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@SecurityRequirement(name = "api")
@RestController
@RequestMapping("/api/transfusion-history")
@RequiredArgsConstructor
public class TransfusionHistoryAPI {

    private final TransfusionHistoryService historyService;
    private final ModelMapper modelMapper;
    private final AuthenticationRepository authenticationRepository;
    private final TransfusionHistoryRepository historyRepository;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Account account = authenticationRepository.findAccountByEmail(email);
        if (account == null) throw new RuntimeException("User not found");
        return account.getId();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @GetMapping
    public ResponseEntity<List<TransfusionHistoryResponseDTO>> getAll() {
        return ResponseEntity.ok(historyService.getAllHistory());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @GetMapping("/search/{id}")
    public ResponseEntity<TransfusionHistoryResponseDTO> getById(@PathVariable Long id) {
        TransfusionHistory history = historyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transfusion history not found with ID: " + id));

        TransfusionHistoryResponseDTO dto = modelMapper.map(history, TransfusionHistoryResponseDTO.class);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/my-history")
    public ResponseEntity<List<TransfusionHistoryResponseDTO>> getMyHistory() {
        Long userId = getCurrentUserId();

        List<TransfusionHistory> histories = historyRepository.findByRecipientId(userId);

        List<TransfusionHistoryResponseDTO> result = histories.stream()
                .map(history -> modelMapper.map(history, TransfusionHistoryResponseDTO.class))
                .toList();

        return ResponseEntity.ok(result);
    }

}


