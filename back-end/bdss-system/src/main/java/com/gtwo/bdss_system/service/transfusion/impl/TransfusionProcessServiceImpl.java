package com.gtwo.bdss_system.service.transfusion.impl;

import com.gtwo.bdss_system.dto.transfusion.TransfusionProcessDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.transfusion.TransfusionHistory;
import com.gtwo.bdss_system.entity.transfusion.TransfusionProcess;
import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;
import com.gtwo.bdss_system.enums.RhFactor;
import com.gtwo.bdss_system.enums.StatusProcess;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.repository.auth.AccountRepository;
import com.gtwo.bdss_system.repository.transfusion.TransfusionHistoryRepository;
import com.gtwo.bdss_system.repository.transfusion.TransfusionProcessRepository;
import com.gtwo.bdss_system.repository.transfusion.TransfusionRequestRepository;
import com.gtwo.bdss_system.service.transfusion.TransfusionProcessService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransfusionProcessServiceImpl implements TransfusionProcessService {

    private final TransfusionProcessRepository procRepo;
    private final TransfusionRequestRepository reqRepo;
    private final TransfusionHistoryRepository historyRepo;
    private final AccountRepository accountRepo;

    @Override
    @Transactional
    public TransfusionProcess createOrUpdate(Long requestId, TransfusionProcessDTO dto) {
        TransfusionRequest request = reqRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Transfusion request not found with ID: " + requestId));

        if (request.getStatusRequest() != StatusRequest.APPROVED) {
            throw new RuntimeException("Request must be approved before processing");
        }


        Optional<TransfusionProcess> optionalProc = procRepo.findByRequest_Id(requestId);
        TransfusionProcess proc = optionalProc.orElseGet(() -> initializeNewProcess(request));

        Account staff = getCurrentUser();
        proc.setPerformedBy(staff);

        mapDtoToEntity(dto, proc);

        TransfusionProcess saved = procRepo.save(proc);
        saveHistoryIfCompleted(saved);
        return saved;
    }

    @Override
    public TransfusionProcess updateById(Long id, TransfusionProcessDTO dto) {
        TransfusionProcess proc = procRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transfusion process not found with ID: " + id));

        if (proc.getStatus() == StatusProcess.COMPLETED) {
            throw new RuntimeException("Cannot update a completed transfusion process");
        }

        mapDtoToEntity(dto, proc);

        TransfusionProcess saved = procRepo.save(proc);
        saveHistoryIfCompleted(saved);
        return saved;
    }

    private TransfusionProcess initializeNewProcess(TransfusionRequest request) {
        TransfusionProcess proc = new TransfusionProcess();
        proc.setRequest(request);
        proc.setTransfusionStartedAt(LocalDateTime.now());

        Account account = accountRepo.findById(request.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient account not found"));

        proc.setFullNameSnapshot(account.getFullName());
        proc.setBirthdateSnapshot(account.getDateOfBirth().toLocalDate());

        if (account.getBloodType() != null) {
            proc.setBloodTypeSnapshot(account.getBloodType().getType());
            proc.setRhFactorSnapshot(RhFactor.valueOf(account.getBloodType().getRhFactor().toUpperCase()));
        }

        return proc;
    }

    private void mapDtoToEntity(TransfusionProcessDTO dto, TransfusionProcess proc) {
        proc.setTransfusionCompletedAt(dto.getTransfusionCompletedAt());

        if (dto.getStatus() != null) {
            try {
                proc.setStatus(StatusProcess.valueOf(dto.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status: " + dto.getStatus());
            }
        }

        proc.setStaffNotes(dto.getStaffNotes());
        proc.setHealthCheckPassed(dto.getHealthCheckPassed());
        proc.setBloodPressure(dto.getBloodPressure());
        proc.setHeartRate(dto.getHeartRate());
        proc.setTemperature(dto.getTemperature().doubleValue());
        proc.setAllergyNotes(dto.getAllergyNotes());
    }

    private void saveHistoryIfCompleted(TransfusionProcess process) {
        if (process.getStatus() == StatusProcess.FAILED || process.getStatus() == StatusProcess.COMPLETED) {
            TransfusionRequest request = process.getRequest();
            Long recipientId = request.getRecipientId();

            boolean exists = historyRepo.existsByRecipientIdAndTransfusionDate(
                    recipientId, process.getTransfusionCompletedAt().toLocalDate());

            if (exists) return;

            Account account = accountRepo.findById(recipientId)
                    .orElseThrow(() -> new RuntimeException("Recipient account not found"));

            TransfusionHistory history = new TransfusionHistory();
            history.setRecipientId(recipientId);
            history.setFullNameSnapshot(account.getFullName());
            history.setBirthdateSnapshot(account.getDateOfBirth().toLocalDate());

            if (account.getBloodType() != null) {
                history.setBloodTypeSnapshot(account.getBloodType().getType());
                history.setRhFactorSnapshot(RhFactor.valueOf(account.getBloodType().getRhFactor().toUpperCase()));
            }

            history.setTransfusionDate(process.getTransfusionCompletedAt().toLocalDate());
            history.setComponentReceived(request.getBloodComponentNeeded());
            history.setQuantity(request.getQuantityNeeded());
            history.setResultNotes(process.getStaffNotes());

            historyRepo.save(history);
        }
    }

    private Account getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return accountRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated staff not found"));
    }

    @Override
    public TransfusionProcess findByRequestId(Long requestId) {
        return procRepo.findByRequest_Id(requestId)
                .orElseThrow(() -> new RuntimeException("Transfusion process not found for request ID: " + requestId));
    }

    @Override
    public List<TransfusionProcess> findAll() {
        return procRepo.findAll();
    }

    @Override
    public void delete(Long requestId) {
        TransfusionProcess process = findByRequestId(requestId);
        procRepo.delete(process);
    }
}
