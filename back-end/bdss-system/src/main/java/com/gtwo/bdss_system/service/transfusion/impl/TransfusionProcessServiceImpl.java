package com.gtwo.bdss_system.service.transfusion.impl;

import com.gtwo.bdss_system.dto.transfusion.TransfusionProcessDTO;
import com.gtwo.bdss_system.entity.transfusion.TransfusionProcess;
import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;
import com.gtwo.bdss_system.enums.StatusProcess;
import com.gtwo.bdss_system.repository.transfusion.TransfusionProcessRepository;
import com.gtwo.bdss_system.repository.transfusion.TransfusionRequestRepository;
import com.gtwo.bdss_system.service.transfusion.TransfusionProcessService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransfusionProcessServiceImpl implements TransfusionProcessService {

    private final TransfusionProcessRepository procRepo;
    private final TransfusionRequestRepository reqRepo;
    private final ModelMapper mapper;

    public TransfusionProcessServiceImpl(
            TransfusionProcessRepository procRepo,
            TransfusionRequestRepository reqRepo,
            ModelMapper mapper) {
        this.procRepo = procRepo;
        this.reqRepo = reqRepo;
        this.mapper = mapper;
    }

    @Override
    public TransfusionProcess createOrUpdate(Long requestId, TransfusionProcessDTO dto) {
        TransfusionRequest req = reqRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request không tồn tại id=" + requestId));

        TransfusionProcess proc = procRepo.findById(requestId)
                .orElseGet(() -> {
                    TransfusionProcess p = new TransfusionProcess();
                    p.setId(requestId);
                    p.setRequest(req);
                    p.markAsNew();
                    return p;
                });


        mapper.map(dto, proc);
        if (proc.getTransfusionStartedAt() == null) {
            proc.setTransfusionStartedAt(LocalDateTime.now());
        }
        proc.setStatus(StatusProcess.IN_PROCESS);

        return procRepo.save(proc);
    }

    @Override
    public TransfusionProcess findByRequestId(Long requestId) {
        return procRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy process cho request " + requestId));
    }

    @Override
    public List<TransfusionProcess> findAll() {
        return procRepo.findAll();
    }

    @Override
    public void delete(Long requestId) {
        procRepo.deleteById(requestId);
    }
}
