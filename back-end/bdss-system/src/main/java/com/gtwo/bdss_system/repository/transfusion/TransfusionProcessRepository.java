package com.gtwo.bdss_system.repository.transfusion;

import com.gtwo.bdss_system.entity.transfusion.TransfusionProcess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransfusionProcessRepository extends JpaRepository<TransfusionProcess, Long> {

    Optional<TransfusionProcess> findByRequest_Id(Long requestId);

}
