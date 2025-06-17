package com.gtwo.bdss_system.service.emergency;
import com.gtwo.bdss_system.entity.emergency.EmergencyProcess;

import java.util.List;
import java.util.Optional;

public interface EmergencyProcessService {
    EmergencyProcess create(EmergencyProcess process);
    EmergencyProcess update(Long id, EmergencyProcess process);
    boolean delete(Long id);
    Optional<EmergencyProcess> getById(Long id);
    List<EmergencyProcess> getAll();
}