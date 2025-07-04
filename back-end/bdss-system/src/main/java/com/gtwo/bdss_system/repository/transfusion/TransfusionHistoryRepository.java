package com.gtwo.bdss_system.repository.transfusion;

import com.gtwo.bdss_system.entity.transfusion.TransfusionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransfusionHistoryRepository extends JpaRepository<TransfusionHistory, Long> {

    boolean existsByRecipientIdAndTransfusionDate(Long recipientId, LocalDate transfusionDate);

    Optional<TransfusionHistory> findByProcess_Id(Long processId);

    List<TransfusionHistory> findByRecipientId(Long recipientId); // ✅ dùng cho /my-history
}
