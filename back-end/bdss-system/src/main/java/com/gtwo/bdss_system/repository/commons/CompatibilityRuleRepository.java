package com.gtwo.bdss_system.repository.commons;

import com.gtwo.bdss_system.entity.commons.CompatibilityRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompatibilityRuleRepository extends JpaRepository<CompatibilityRule, Long> {
    List<CompatibilityRule> findByDonorBloodType_IdAndRecipientBloodType_IdAndComponent_Id(Long donorId, Long recipientId, Long componentId);
}
