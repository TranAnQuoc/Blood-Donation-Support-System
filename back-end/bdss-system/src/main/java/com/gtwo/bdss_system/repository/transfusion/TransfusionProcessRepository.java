package com.gtwo.bdss_system.repository.transfusion;

import com.gtwo.bdss_system.entity.transfusion.TransfusionProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransfusionProcessRepository
        extends JpaRepository<TransfusionProcess, Long> {
}
