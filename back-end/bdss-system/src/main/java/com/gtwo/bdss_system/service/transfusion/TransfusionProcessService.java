package com.gtwo.bdss_system.service.transfusion;

import com.gtwo.bdss_system.dto.transfusion.TransfusionProcessDTO;
import com.gtwo.bdss_system.entity.transfusion.TransfusionProcess;

import java.util.List;

public interface TransfusionProcessService {
    TransfusionProcess createOrUpdate(Long requestId, TransfusionProcessDTO dto);
    TransfusionProcess findByRequestId(Long requestId);
    List<TransfusionProcess> findAll();
    void delete(Long requestId);
}
