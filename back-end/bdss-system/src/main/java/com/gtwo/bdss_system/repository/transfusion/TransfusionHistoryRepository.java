package com.gtwo.bdss_system.repository.transfusion;

import com.gtwo.bdss_system.entity.transfusion.TransfusionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransfusionHistoryRepository
        extends JpaRepository<TransfusionHistory, Long> {
}
