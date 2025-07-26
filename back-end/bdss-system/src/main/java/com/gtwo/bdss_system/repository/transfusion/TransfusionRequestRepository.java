package com.gtwo.bdss_system.repository.transfusion;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;
import com.gtwo.bdss_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface TransfusionRequestRepository extends JpaRepository<TransfusionRequest, Long> {
    List<TransfusionRequest> findByStatus(Status status);
    Collection<Object> findByOwnerAndStatus(Account owner, Status status);
}
