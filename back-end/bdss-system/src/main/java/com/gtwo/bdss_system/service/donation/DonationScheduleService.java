package com.gtwo.bdss_system.service.donation;

import com.gtwo.bdss_system.dto.donation.DonationScheduleDTO;
import com.gtwo.bdss_system.entity.donation.DonationSchedule;

import java.util.List;

public interface DonationScheduleService {
    List<DonationSchedule> getAll();
    DonationSchedule getById(Long id);
    DonationSchedule create(DonationScheduleDTO schedule);
    DonationSchedule update(Long id, DonationScheduleDTO schedule);
    void delete(Long id);
}
