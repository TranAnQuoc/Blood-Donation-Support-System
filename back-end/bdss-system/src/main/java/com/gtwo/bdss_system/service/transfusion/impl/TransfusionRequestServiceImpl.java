package com.gtwo.bdss_system.service.transfusion.impl;

import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestDTO;
import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;
import com.gtwo.bdss_system.enums.StatusRequest;
import com.gtwo.bdss_system.repository.transfusion.TransfusionRequestRepository;
import com.gtwo.bdss_system.service.transfusion.TransfusionRequestService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransfusionRequestServiceImpl implements TransfusionRequestService {

    private final TransfusionRequestRepository repo;
    private final ModelMapper mapper;

    public TransfusionRequestServiceImpl(TransfusionRequestRepository repo, ModelMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    @Override
    public TransfusionRequest create(TransfusionRequestDTO dto) {
        TransfusionRequest e = mapper.map(dto, TransfusionRequest.class);
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

