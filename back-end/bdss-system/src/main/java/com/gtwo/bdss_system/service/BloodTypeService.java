package com.gtwo.bdss_system.service;

import com.gtwo.bdss_system.entity.BloodType;
import com.gtwo.bdss_system.repository.BloodTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BloodTypeService {
    @Autowired
    private BloodTypeRepository bloodTypeRepository;

    public BloodType findById(Long id) {
        return bloodTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood type not found"));
    }
}
