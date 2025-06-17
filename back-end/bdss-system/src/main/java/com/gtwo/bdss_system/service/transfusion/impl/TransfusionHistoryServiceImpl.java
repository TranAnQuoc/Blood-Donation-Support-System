package com.gtwo.bdss_system.service.transfusion.impl;

import com.gtwo.bdss_system.entity.transfusion.TransfusionHistory;
import com.gtwo.bdss_system.repository.transfusion.TransfusionHistoryRepository;
import com.gtwo.bdss_system.service.transfusion.TransfusionHistoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransfusionHistoryServiceImpl implements TransfusionHistoryService {

    private final TransfusionHistoryRepository repo;

    public TransfusionHistoryServiceImpl(TransfusionHistoryRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<TransfusionHistory> findAll() {
        return repo.findAll();
    }

    @Override
    public TransfusionHistory findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy history với id=" + id));
    }
}
