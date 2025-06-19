package com.gtwo.bdss_system.service.emergency;

import com.gtwo.bdss_system.dto.emergency.EmergencyProcessDTO;

import java.util.List;

public interface EmergencyProcessService {
    EmergencyProcessDTO create(EmergencyProcessDTO dto);
    EmergencyProcessDTO getById(Long id);
    List<EmergencyProcessDTO> getAll();
    EmergencyProcessDTO update(Long id, EmergencyProcessDTO dto);
    void delete(Long id);
}
