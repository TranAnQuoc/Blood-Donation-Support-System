package com.gtwo.bdss_system.service.emergency;
import com.gtwo.bdss_system.dto.emergency.EmergencyRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.StatusRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface EmergencyRequestService {
    void createEmergencyRequest(EmergencyRequestDTO dto, MultipartFile proofImage, Account account);
    List<EmergencyRequestDTO> getAllRequests();
    EmergencyRequestDTO getRequestById(Long id);
    void updateEmergencyRequest(Long id, StatusRequest decision,String note, Account account);
    void deleteEmergencyRequest(Long id);
    void restoreEmergencyRequest(Long id);

}