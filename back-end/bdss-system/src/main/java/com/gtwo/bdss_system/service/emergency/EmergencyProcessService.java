package com.gtwo.bdss_system.service.emergency;

import com.gtwo.bdss_system.dto.emergency.EmergencyProcessDTO;
import com.gtwo.bdss_system.dto.emergency.EmergencyProcessFormDTO;
import com.gtwo.bdss_system.entity.emergency.EmergencyRequest;
import com.gtwo.bdss_system.entity.auth.Account;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface EmergencyProcessService {
    EmergencyProcessDTO getById(Long id);
    List<EmergencyProcessDTO> getByStaffId(Long staffId);
    List<EmergencyProcessDTO> getAll();
    void autoCreateByRequest(EmergencyRequest request);
    void updateWithFile(Long id, EmergencyProcessFormDTO form, Account staff);
}