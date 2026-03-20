package com.gtwo.bdss_system.service.emergency;

import com.gtwo.bdss_system.dto.emergency.EmergencyHistoryDTO;
import com.gtwo.bdss_system.entity.emergency.EmergencyProcess;

import java.util.List;

public interface EmergencyHistoryService {
    EmergencyHistoryDTO getById(Long id);
    List<EmergencyHistoryDTO> getAll();
    void restore(Long id);
    void autoCreateFromProcess(EmergencyProcess  process);

}