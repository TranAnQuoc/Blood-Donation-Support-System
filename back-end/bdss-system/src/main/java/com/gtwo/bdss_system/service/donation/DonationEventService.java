package com.gtwo.bdss_system.service.donation;

import com.gtwo.bdss_system.dto.donation.DonationEventDTO;
import com.gtwo.bdss_system.entity.donation.DonationEvent;

import java.time.LocalDate;
import java.util.List;

public interface DonationEventService {
    List<DonationEvent> getAllForStaff();
    List<DonationEvent> getAll();
    DonationEvent getById(Long id);
    List<DonationEvent> getByDateRange(LocalDate fromDate, LocalDate toDate);
    DonationEvent create(DonationEventDTO schedule);
    DonationEvent update(Long id, DonationEventDTO schedule);
    void delete(Long id);
    void restore(Long id);
    List<DonationEvent> searchByName(String keyword);
    void autoExpirePastEvents();
}
