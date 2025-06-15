package com.gtwo.bdss_system.repository.donation;

import com.gtwo.bdss_system.entity.donation.DonationProcess;
import com.gtwo.bdss_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonationProcessRepository extends JpaRepository<DonationProcess, Long> {
    List<DonationProcess> findAllByStatus(Status status);
}
