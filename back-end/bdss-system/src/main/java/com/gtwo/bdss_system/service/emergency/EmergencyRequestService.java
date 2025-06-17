package com.gtwo.bdss_system.service.emergency;


import com.gtwo.bdss_system.dto.emergency.EmergencyRequestDTO;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;

public interface EmergencyRequestService {
    EmergencyRequest create(EmergencyRequestDTO dto);
}

