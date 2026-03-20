package com.gtwo.bdss_system.service.commons;

import com.gtwo.bdss_system.entity.commons.EmergencyHotline;

import java.util.List;

public interface EmergencyHotlineService {
    List<EmergencyHotline> getAll();
    List<EmergencyHotline> getForStaff();
    List<EmergencyHotline> getByAddress(String address);
    EmergencyHotline create(EmergencyHotline hotline);
    EmergencyHotline update(Long id, EmergencyHotline hotline);
    void delete(Long id);
    void restore(Long id);
}
