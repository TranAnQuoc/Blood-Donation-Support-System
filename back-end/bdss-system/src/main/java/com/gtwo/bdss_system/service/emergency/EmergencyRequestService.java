package com.gtwo.bdss_system.service.emergency;


import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;

import java.util.List;
import java.util.Optional;

public interface EmergencyRequestService {
    EmergencyRequest create(EmergencyRequest request);
    EmergencyRequest update(Long id, EmergencyRequest request);
    boolean delete(Long id);
    Optional<EmergencyRequest> getById(Long id);
    List<EmergencyRequest> getAll();
}
