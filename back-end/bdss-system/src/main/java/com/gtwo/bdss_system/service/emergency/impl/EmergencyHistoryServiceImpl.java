package com.gtwo.bdss_system.service.emergency.impl;

import com.gtwo.bdss_system.entity.emergency.EmergencyHistory;
import com.gtwo.bdss_system.repository.emergency.EmergencyHistoryRepository;
import com.gtwo.bdss_system.service.emergency.EmergencyHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmergencyHistoryServiceImpl implements EmergencyHistoryService {

    @Autowired
    private EmergencyHistoryRepository repository;

    @Override
    public EmergencyHistory create(EmergencyHistory history) {
        history.setResolvedAt(java.time.LocalDateTime.now());
        return repository.save(history);
    }

    @Override
    public EmergencyHistory update(Long id, EmergencyHistory newHistory) {
        return repository.findById(id).map(existing -> {
            existing.setResolvedAt(newHistory.getResolvedAt());
            existing.setFullNameSnapshot(newHistory.getFullNameSnapshot());
            existing.setBloodType(newHistory.getBloodType());
            existing.setFacilityName(newHistory.getFacilityName());
            existing.setBloodComponent(newHistory.getBloodComponent());
            existing.setQuantity(newHistory.getQuantity());
            existing.setResult(newHistory.getResult());
            existing.setNotes(newHistory.getNotes());
            return repository.save(existing);
        }).orElse(null);
    }

    @Override
    public boolean delete(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Optional<EmergencyHistory> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<EmergencyHistory> getAll() {
        return repository.findAll();
    }
}