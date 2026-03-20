package com.gtwo.bdss_system.service.commons;

import com.gtwo.bdss_system.entity.commons.CompatibilityRule;

public interface CompatibilityRuleService {
    CompatibilityRule getRule(Long donorId, Long recipientId, Long componentId);
}
