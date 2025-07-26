package com.gtwo.bdss_system.service.transfusion;


import com.gtwo.bdss_system.dto.transfusion.RequestOwnerDTO;
import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;

import java.util.List;

public interface TransfusionRequestService {
    List<RequestOwnerDTO> getAll();
    TransfusionRequestDTO create(TransfusionRequestDTO dto, Account currentUser);
    TransfusionRequestDTO update(Long id, TransfusionRequestDTO dto, Account currentUser);
    void delete(Long id, Account currentUser);
    void restore(Long id, Account currentUser);
    List<RequestOwnerDTO> getMyRequests(Account currentUser);
    List<TransfusionRequestDTO> getView();
}
