package com.gtwo.bdss_system.service.transfusion;

import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;

import java.util.List;

public interface TransfusionRequestService {
    TransfusionRequest create(Account account, TransfusionRequestDTO dto);
    TransfusionRequest update(Long id, TransfusionRequestDTO dto);
    TransfusionRequest findById(Long id);
    List<TransfusionRequest> findAll();
    void delete(Long id);
}

