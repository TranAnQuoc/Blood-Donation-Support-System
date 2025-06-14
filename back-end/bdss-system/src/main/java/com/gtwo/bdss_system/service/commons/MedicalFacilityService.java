package com.gtwo.bdss_system.service.commons;

import com.gtwo.bdss_system.entity.commons.MedicalFacility;

import java.util.List;

public interface MedicalFacilityService {
    MedicalFacility create(MedicalFacility medicalFacility);
    MedicalFacility getById(Long id);
    List<MedicalFacility> getAll();
    MedicalFacility update(Long id, MedicalFacility medicalFacility);
    void delete(Long id);
}
