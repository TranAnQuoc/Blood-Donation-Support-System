package com.gtwo.bdss_system.service.commons.impl;

import com.gtwo.bdss_system.entity.commons.CompatibilityRule;
import com.gtwo.bdss_system.repository.commons.CompatibilityRuleRepository;
import com.gtwo.bdss_system.service.commons.CompatibilityRuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompatibilityRuleServiceImpl implements CompatibilityRuleService {

    @Autowired
    private CompatibilityRuleRepository compatibilityRuleRepository;

    @Override
    public CompatibilityRule getRule(Long donorId, Long recipientId, Long componentId) {
        return compatibilityRuleRepository.findByDonorBloodType_IdAndRecipientBloodType_IdAndComponent_Id(
                donorId, recipientId, componentId
        ).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy quy tắc tương thích."));
    }
}
