package com.gtwo.bdss_system.repository.transfusion;

import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransfusionRequestRepository
        extends JpaRepository<TransfusionRequest, Long> {
}
