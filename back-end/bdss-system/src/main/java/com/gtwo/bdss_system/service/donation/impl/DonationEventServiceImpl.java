package com.gtwo.bdss_system.service.donation.impl;

import com.gtwo.bdss_system.dto.donation.DonationEventDTO;
import com.gtwo.bdss_system.entity.donation.DonationEvent;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.repository.donation.DonationRequestRepository;
import com.gtwo.bdss_system.repository.donation.DonationEventRepository;
import com.gtwo.bdss_system.service.donation.DonationEventService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DonationEventServiceImpl implements DonationEventService {

    @Autowired
    private DonationEventRepository repository;

    @Autowired
    private DonationRequestRepository donationRequestRepository;

    @Override
    public List<DonationEvent> getAll() {
        List<DonationEvent> schedules = repository.findAllByStatus(Status.ACTIVE);
        for (DonationEvent schedule : schedules) {
            schedule.setCurrentSlot(donationRequestRepository.countEventIdInRequest(schedule.getId()));
        }
        return schedules;
    }

    @Override
    public List<DonationEvent> getAllForStaff() {
        List<DonationEvent> schedules = repository.findAll();
        for (DonationEvent schedule : schedules) {
            schedule.setCurrentSlot(donationRequestRepository.countEventIdInRequest(schedule.getId()));
        }
        return schedules;
    }

    @Override
    public DonationEvent getById(Long id) {
        DonationEvent schedule = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lịch hiến máu với ID: " + id));
        schedule.setCurrentSlot(donationRequestRepository.countEventIdInRequest(id));
        return schedule;
    }

    @Override
    public List<DonationEvent> getByDateRange(Date fromDate, Date toDate) {
        List<DonationEvent> schedules = repository.findByDateRangeAndActive(fromDate, toDate);
        for (DonationEvent schedule : schedules) {
            int approved = donationRequestRepository.countEventIdInRequest(schedule.getId());
            schedule.setCurrentSlot(approved);
        }
        return schedules;
    }

    @Override
    public DonationEvent create(DonationEventDTO dto) {
        DonationEvent schedule = new DonationEvent();
        LocalTime start = dto.getStartTime().toLocalTime();
        LocalTime end = dto.getEndTime().toLocalTime();
        long duration = ChronoUnit.MINUTES.between(start, end);
        if (duration < 60) {
            throw new IllegalArgumentException("Thời gian kết thúc phải sau thời gian bắt đầu ít nhất 1 tiếng");
        }
        schedule.setName(dto.getName());
        schedule.setDate(dto.getDate());
        schedule.setStartTime(dto.getStartTime());
        schedule.setEndTime(dto.getEndTime());
        schedule.setMaxSlot(dto.getMaxSlot());
        schedule.setAddress(dto.getAddress());
        schedule.setStatus(Status.ACTIVE);
        if (repository.existsByNameAndAddress(dto.getName(), dto.getAddress())) {
            throw new IllegalArgumentException("Lịch hiến máu với tên và địa chỉ này đã tồn tại");
        }
        return repository.save(schedule);
    }


    @Override
    public DonationEvent update(Long id, DonationEventDTO updated) {
        DonationEvent existing = getById(id);
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
        boolean isDuplicate = repository.existsByNameAndAddress(updated.getName(), updated.getAddress());
        if (isDuplicate &&
                (!existing.getName().equals(updated.getName()) || !existing.getAddress().equals(updated.getAddress()))) {
            throw new IllegalArgumentException("Tên và địa chỉ đã được sử dụng cho lịch khác");
        }
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        DonationEvent schedule = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + id));
        schedule.setStatus(Status.INACTIVE);
        repository.save(schedule);
    }

    @Override
    public void restore(Long id) {
        DonationEvent schedule = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + id));
        schedule.setStatus(Status.ACTIVE);
        repository.save(schedule);
    }
}
