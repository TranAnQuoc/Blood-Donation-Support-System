package com.gtwo.bdss_system.service.transfusion;

import com.gtwo.bdss_system.dto.transfusion.RequestOwnerDTO;
import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;

import java.util.List;

public interface TransfusionRequestService {
    List<RequestOwnerDTO> getAll();
    RequestOwnerDTO getById(Long id, Account currentUser);
    TransfusionRequestDTO create(TransfusionRequestDTO dto, Account currentUser);
    TransfusionRequestDTO update(Long id, TransfusionRequestDTO dto, Account currentUser);
    void delete(Long id, Account currentUser);
    void restore(Long id, Account currentUser);
    List<RequestOwnerDTO> getMyRequests(Account currentUser);
    List<TransfusionRequestDTO> getView();
}
