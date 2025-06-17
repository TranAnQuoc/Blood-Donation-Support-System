package com.gtwo.bdss_system.service.emergency.impl;
import com.gtwo.bdss_system.entity.emergency.EmergencyProcess;
import com.gtwo.bdss_system.repository.emergency.EmergencyProcessRepository;
import com.gtwo.bdss_system.service.emergency.EmergencyProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmergencyProcessServiceImpl implements EmergencyProcessService {

    @Autowired
    private EmergencyProcessRepository repository;

    @Override
    public EmergencyProcess create(EmergencyProcess process) {
        process.setStartedAt(java.time.LocalDateTime.now());
        return repository.save(process);
    }

    @Override
    public EmergencyProcess update(Long id, EmergencyProcess newProcess) {
        return repository.findById(id).map(existing -> {
            existing.setStatus(newProcess.getStatus());
            existing.setStartedAt(newProcess.getStartedAt());
            existing.setStartedAt(newProcess.getStartedAt());
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
    public Optional<EmergencyProcess> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<EmergencyProcess> getAll() {
        return repository.findAll();
    }
}