package com.gtwo.bdss_system.repository.donation;

import com.gtwo.bdss_system.entity.donation.DonationSchedule;
import com.gtwo.bdss_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationScheduleRepository extends JpaRepository<DonationSchedule, Long> {
    List<DonationSchedule> findAllByStatus(Status status);
}
