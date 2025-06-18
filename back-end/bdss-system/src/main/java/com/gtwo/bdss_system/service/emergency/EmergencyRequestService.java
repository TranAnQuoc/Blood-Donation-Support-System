package com.gtwo.bdss_system.service.emergency;
import com.gtwo.bdss_system.dto.emergency.EmergencyRequestDTO;

public interface EmergencyRequestService {
    void createEmergencyRequest(EmergencyRequestDTO dto);
}