package com.gtwo.bdss_system.service.commons.impl;

import com.gtwo.bdss_system.entity.commons.EmergencyHotline;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.repository.commons.EmergencyHotlineRepository;
import com.gtwo.bdss_system.service.commons.EmergencyHotlineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmergencyHotlineServiceImpl implements EmergencyHotlineService {

    private final EmergencyHotlineRepository repository;

    @Override
    public List<EmergencyHotline> getAll() {
        return repository.findAll();
    }

    @Override
    public List<EmergencyHotline> getForStaff() {
        return repository.findByStatus(Status.ACTIVE);
    }

    @Override
    public List<EmergencyHotline> getByAddress(String address) {
        return repository.findByAddressAndStatus(address, Status.ACTIVE);
    }

    @Override
    public EmergencyHotline create(EmergencyHotline hotline) {
        if (repository.existsByName(hotline.getName())) {
            throw new RuntimeException("Tên cơ sở đã tồn tại");
        }
        hotline.setStatus(Status.ACTIVE);
        return repository.save(hotline);
    }

    @Override
    public EmergencyHotline update(Long id, EmergencyHotline updatedHotline) {
        EmergencyHotline existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hotline với ID: " + id));

        if (!existing.getName().equals(updatedHotline.getName()) && repository.existsByName(updatedHotline.getName())) {
            throw new RuntimeException("Tên cơ sở đã tồn tại");
        }

        existing.setName(updatedHotline.getName());
        existing.setNumber(updatedHotline.getNumber());
        existing.setAddress(updatedHotline.getAddress());
        // status giữ nguyên
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        EmergencyHotline hotline = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hotline với ID: " + id));
        hotline.setStatus(Status.INACTIVE);
        repository.save(hotline);
    }

    @Override
    public void restore(Long id) {
        EmergencyHotline hotline = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hotline với ID: " + id));
        hotline.setStatus(Status.ACTIVE);
        repository.save(hotline);
    }
}
