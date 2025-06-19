package com.gtwo.bdss_system.service.emergency;
import com.gtwo.bdss_system.dto.emergency.EmergencyRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;

import java.util.List;

public interface EmergencyRequestService {
    void createEmergencyRequest(EmergencyRequestDTO dto);
    List<EmergencyRequestDTO> getAllRequests();
    EmergencyRequestDTO getRequestById(Long id);
    void updateEmergencyRequest(Long id, EmergencyRequestDTO dto, Account account);
    void deleteEmergencyRequest(Long id);
    void restoreEmergencyRequest(Long id);
}