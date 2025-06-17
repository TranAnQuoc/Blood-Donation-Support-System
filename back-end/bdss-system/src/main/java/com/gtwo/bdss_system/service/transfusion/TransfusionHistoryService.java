package com.gtwo.bdss_system.service.transfusion;

import com.gtwo.bdss_system.entity.transfusion.TransfusionHistory;

import java.util.List;

public interface TransfusionHistoryService {
    List<TransfusionHistory> findAll();
    TransfusionHistory findById(Long id);
}
