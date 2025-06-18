package com.gtwo.bdss_system.service.emergency;
import com.gtwo.bdss_system.dto.emergency.EmergencyGuestRequestDTO;

public interface EmergencyGuestRequestService {
    void createEmergencyRequest(EmergencyGuestRequestDTO dto);
}