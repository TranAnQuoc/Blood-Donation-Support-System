package com.gtwo.bdss_system.service.donation.impl;

import com.gtwo.bdss_system.dto.donation.DonationScheduleDTO;
import com.gtwo.bdss_system.entity.commons.MedicalFacility;
import com.gtwo.bdss_system.entity.donation.DonationSchedule;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.repository.donation.DonationScheduleRepository;
import com.gtwo.bdss_system.service.commons.MedicalFacilityService;
import com.gtwo.bdss_system.service.donation.DonationScheduleService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DonationScheduleServiceImpl implements DonationScheduleService {

    @Autowired
    private DonationScheduleRepository repository;

    @Autowired
    private MedicalFacilityService medicalFacilityService;

    @Override
    public List<DonationSchedule> getAll() {
        return repository.findAllByStatus(Status.ACTIVE);
    }

    @Override
    public DonationSchedule getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with ID: " + id));
    }

    @Override
    public DonationSchedule create(DonationScheduleDTO dto) {
        MedicalFacility facility = medicalFacilityService.getById(dto.getFacilityId());
        DonationSchedule schedule = new DonationSchedule();
        LocalTime start = dto.getStartTime().toLocalTime();
        LocalTime end = dto.getEndTime().toLocalTime();
        long duration = ChronoUnit.MINUTES.between(start, end);
        if (duration < 60) {
            throw new IllegalArgumentException("Thời gian kết thúc phải sau thời gian bắt đầu ít nhất 1 tiếng");
        }
        schedule.setName(dto.getName());
        schedule.setFacility(facility);
        schedule.setDate(dto.getDate());
        schedule.setStartTime(dto.getStartTime());
        schedule.setEndTime(dto.getEndTime());
        schedule.setMaxSlot(dto.getMaxSlot());
        schedule.setAddress(dto.getAddress());
        schedule.setStatus(Status.ACTIVE);
        return repository.save(schedule);
    }


    @Override
    public DonationSchedule update(Long id, DonationScheduleDTO updated) {
        DonationSchedule existing = getById(id);
        LocalTime start = updated.getStartTime().toLocalTime();
        LocalTime end = updated.getEndTime().toLocalTime();
        long duration = ChronoUnit.MINUTES.between(start, end);
        if (duration < 60) {
            throw new IllegalArgumentException("Thời gian kết thúc phải sau thời gian bắt đầu ít nhất 1 tiếng");
        }
        existing.setName(updated.getName());
        existing.setDate(updated.getDate());
        existing.setStartTime(updated.getStartTime());
        existing.setEndTime(updated.getEndTime());
        existing.setAddress(updated.getAddress());
        existing.setMaxSlot(updated.getMaxSlot());
        MedicalFacility facility = medicalFacilityService.getById(updated.getFacilityId());
        existing.setFacility(facility);
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        DonationSchedule schedule = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + id));
        schedule.setStatus(Status.INACTIVE);
        repository.save(schedule);
    }
}
