package com.gtwo.bdss_system.service.transfusion.impl;

import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.repository.auth.AuthenticationRepository;
import com.gtwo.bdss_system.repository.transfusion.TransfusionRequestRepository;
import com.gtwo.bdss_system.service.transfusion.TransfusionRequestService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransfusionRequestServiceImpl implements TransfusionRequestService {

    private final TransfusionRequestRepository repo;
    private final AuthenticationRepository accountRepo;
    private final ModelMapper mapper;

    public TransfusionRequestServiceImpl(
            TransfusionRequestRepository repo,
            AuthenticationRepository accountRepo,
            ModelMapper mapper) {
        this.repo = repo;
        this.accountRepo = accountRepo;
        this.mapper = mapper;
    }

    @Override
    public TransfusionRequest create(Account account, TransfusionRequestDTO dto) {
        TransfusionRequest e = new TransfusionRequest();

        e.setRecipient(account);

        e.setBloodComponentNeeded(dto.getBloodComponentNeeded());
        e.setQuantityNeeded(dto.getQuantityNeeded());
        e.setDoctorDiagnosis(dto.getDoctorDiagnosis());
        e.setPreCheckNotes(dto.getPreCheckNotes());

        e.setRequestedAt(LocalDateTime.now());
        e.setStatus(StatusRequest.PENDING);

        return repo.save(e);
    }

    @Override
    public TransfusionRequest update(Long id, TransfusionRequestDTO dto) {
        TransfusionRequest existing = findById(id);
        mapper.map(dto, existing);
        return repo.save(existing);
    }

    @Override
    public TransfusionRequest findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy request với id=" + id));
    }

    @Override
    public List<TransfusionRequest> findAll() {
        return repo.findAll();
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
