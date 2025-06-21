package com.gtwo.bdss_system.repository.donation;

import com.gtwo.bdss_system.entity.donation.DonationProcess;
import com.gtwo.bdss_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DonationProcessRepository extends JpaRepository<DonationProcess, Long> {
    List<DonationProcess> findAllByStatus(Status status);
    @Query("""
    SELECT dp FROM DonationProcess dp
    WHERE dp.request.donor.id = :userId
    ORDER BY dp.startTime DESC
""")
    Optional<DonationProcess> findLatestByUserId(@Param("userId") Long userId);
}
