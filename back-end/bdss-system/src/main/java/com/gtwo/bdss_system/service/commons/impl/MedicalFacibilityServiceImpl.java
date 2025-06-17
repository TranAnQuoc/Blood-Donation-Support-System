package com.gtwo.bdss_system.service.commons.impl;

import com.gtwo.bdss_system.entity.commons.MedicalFacility;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.repository.commons.MedicalFacilityRepository;
import com.gtwo.bdss_system.service.commons.MedicalFacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalFacibilityServiceImpl implements MedicalFacilityService {
    @Autowired
    private MedicalFacilityRepository repository;

    @Override
    public MedicalFacility create(MedicalFacility medicalFacility) {
        boolean exists = repository.existsByNameAndAddressAndPhone(
                medicalFacility.getName(),
                medicalFacility.getAddress(),
                medicalFacility.getPhone()
        );
        if (exists) {
            throw new IllegalArgumentException("Cơ sở y tế đã tồn tại với cùng tên, địa chỉ và số điện thoại");
        }
        return repository.save(medicalFacility);
    }

    @Override
    public MedicalFacility getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical facility not found with ID: " + id));
    }

    @Override
    public List<MedicalFacility> getAll() {
        return repository.findByStatus(Status.ACTIVE);
    }

    @Override
    public MedicalFacility update(Long id, MedicalFacility updatedFacility) {
        MedicalFacility existing = getById(id);
        boolean isDuplicate = repository.existsByNameAndAddressAndPhone(
                updatedFacility.getName(),
                updatedFacility.getAddress(),
                updatedFacility.getPhone()
        ) && !(updatedFacility.getName().equals(existing.getName())
                && updatedFacility.getAddress().equals(existing.getAddress())
                && updatedFacility.getPhone().equals(existing.getPhone()));
        if (isDuplicate) {
            throw new IllegalArgumentException("Cơ sở y tế đã tồn tại với thông tin này");
        }
        existing.setName(updatedFacility.getName());
        existing.setAddress(updatedFacility.getAddress());
        existing.setPhone(updatedFacility.getPhone());
        existing.setRegion(updatedFacility.getRegion());
        existing.setStatus(updatedFacility.getStatus());
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        MedicalFacility facility = getById(id);
        facility.setStatus(Status.INACTIVE);
        repository.save(facility);
    }

    @Override
    public void restore(Long id) {
        MedicalFacility facility = getById(id);
        facility.setStatus(Status.ACTIVE);
        repository.save(facility);
    }
}
