package com.gtwo.bdss_system.repository.emergency;
import com.gtwo.bdss_system.entity.emergency.EmergencyHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmergencyHistoryRepository extends JpaRepository<EmergencyHistory, Long> {

}
