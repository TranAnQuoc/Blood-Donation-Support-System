package com.gtwo.bdss_system.repository.donation;

import com.gtwo.bdss_system.entity.donation.DonationEvent;
import com.gtwo.bdss_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface DonationEventRepository extends JpaRepository<DonationEvent, Long> {
    List<DonationEvent> findAllByStatus(Status status);
    boolean existsByNameAndAddress(String name, String address);
    @Query("SELECT s FROM DonationEvent s WHERE s.date BETWEEN :fromDate AND :toDate AND s.status = 'ACTIVE'")
    List<DonationEvent> findByDateRangeAndActive(
            @Param("fromDate") Date fromDate,
            @Param("toDate") Date toDate
    );
    List<DonationEvent> findByNameContainingIgnoreCaseOrderByNameAsc(String keyword);
}
