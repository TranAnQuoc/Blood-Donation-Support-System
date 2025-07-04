package com.gtwo.bdss_system.service.transfusion;

import com.gtwo.bdss_system.dto.transfusion.TransfusionHistoryResponseDTO;
import com.gtwo.bdss_system.entity.transfusion.TransfusionHistory;

import java.util.List;

public interface TransfusionHistoryService {
    List<TransfusionHistoryResponseDTO> getAllHistory();
}


