package com.gtwo.bdss_system.service.commons;

import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
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
