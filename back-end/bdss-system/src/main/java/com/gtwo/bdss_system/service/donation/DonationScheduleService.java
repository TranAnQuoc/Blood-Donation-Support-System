package com.gtwo.bdss_system.service.donation;

import com.gtwo.bdss_system.dto.donation.DonationScheduleDTO;
import com.gtwo.bdss_system.entity.donation.DonationSchedule;

import java.util.Date;
import java.util.List;

public interface DonationScheduleService {
    List<DonationSchedule> getAllForStaff();
    List<DonationSchedule> getAll();
    DonationSchedule getById(Long id);
    List<DonationSchedule> getByDateRange(Date fromDate, Date toDate);
    DonationSchedule create(DonationScheduleDTO schedule);
    DonationSchedule update(Long id, DonationScheduleDTO schedule);
    void delete(Long id);
    void restore(Long id);
}
