package com.gtwo.bdss_system.service.emergency.impl;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.repository.emergency.EmergencyRequestRepository;
import com.gtwo.bdss_system.service.emergency.EmergencyRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmergencyRequestServiceImpl implements EmergencyRequestService {

    @Autowired
    private EmergencyRequestRepository repository;

    @Override
    public EmergencyRequest create(EmergencyRequest request) {
        request.setSubmittedAt(java.time.LocalDateTime.now());
        return repository.save(request);
    }

    @Override
    public EmergencyRequest update(Long id, EmergencyRequest updatedRequest) {
        return repository.findById(id).map(existing -> {
            existing.setBloodType(updatedRequest.getBloodType());
            existing.setBloodComponent(updatedRequest.getBloodComponent());
            existing.setQuantity(updatedRequest.getQuantity());
            existing.setLocation(updatedRequest.getLocation());
            existing.setStatus(updatedRequest.getStatus());
            existing.setVerifiedBy(updatedRequest.getVerifiedBy());
            existing.setVerifiedAt(updatedRequest.getVerifiedAt());
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
    public Optional<EmergencyRequest> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<EmergencyRequest> getAll() {
        return repository.findAll();
    }
}