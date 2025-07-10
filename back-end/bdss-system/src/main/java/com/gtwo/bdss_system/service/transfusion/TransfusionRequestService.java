package com.gtwo.bdss_system.service.transfusion;

import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestDTO;
import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestResponseDTO;
import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;

public interface TransfusionRequestService {

    TransfusionRequest createRequest(TransfusionRequestDTO dto);
    void softDelete(Integer requestId);
    TransfusionRequest getById(Long id);
    void cancelRequest(Long requestId);
    void rejectRequest(Long requestId);
    void approveRequest(Long requestId);

}
