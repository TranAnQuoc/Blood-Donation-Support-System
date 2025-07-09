package com.gtwo.bdss_system.repository.commons;

import com.gtwo.bdss_system.entity.commons.BloodStorage;
import com.gtwo.bdss_system.enums.StatusBloodStorage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BloodStorageRepository extends JpaRepository<BloodStorage,Long> {
    List<BloodStorage> findByBloodStatus(StatusBloodStorage status);
    @Query("SELECT bs FROM BloodStorage bs " +
            "WHERE (:bloodTypeId IS NULL OR bs.bloodType.id = :bloodTypeId) " +
            "AND (:bloodComponentId IS NULL OR bs.bloodComponent.id = :bloodComponentId)")
    List<BloodStorage> searchByTypeAndComponent(@Param("bloodTypeId") Long bloodTypeId,
                                                @Param("bloodComponentId") Long bloodComponentId);
}
