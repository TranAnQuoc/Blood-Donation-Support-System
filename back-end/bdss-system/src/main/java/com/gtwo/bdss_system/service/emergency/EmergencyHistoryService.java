package com.gtwo.bdss_system.service.emergency;

import com.gtwo.bdss_system.entity.emergency.EmergencyHistory;

import java.util.List;
import java.util.Optional;

public interface EmergencyHistoryService {
    EmergencyHistory create(EmergencyHistory history);
    EmergencyHistory update(Long id, EmergencyHistory history);
    boolean delete(Long id);
    Optional<EmergencyHistory> getById(Long id);
    List<EmergencyHistory> getAll();
}
