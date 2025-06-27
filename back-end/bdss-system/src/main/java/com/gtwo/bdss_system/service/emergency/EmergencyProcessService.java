package com.gtwo.bdss_system.service.emergency;

import com.gtwo.bdss_system.dto.emergency.EmergencyProcessDTO;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.entity.auth.Account;

import java.util.List;

public interface EmergencyProcessService {
    EmergencyProcessDTO update(Long id, EmergencyProcessDTO dto, Account account);
    EmergencyProcessDTO getById(Long id);
    List<EmergencyProcessDTO> getByStaffId(Long staffId);
    List<EmergencyProcessDTO> getAll();
    void autoCreateByRequest(EmergencyRequest request);
}