package com.gtwo.bdss_system.service.emergency;
import com.gtwo.bdss_system.dto.emergency.EmergencyGuestRequestDTO;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;

public interface EmergencyGuestRequestService {
    void createEmergencyRequest(EmergencyGuestRequestDTO dto);
}