package com.gtwo.bdss_system.service.transfusion;

import com.gtwo.bdss_system.dto.transfusion.TransfusionProcessDTO;
import com.gtwo.bdss_system.entity.transfusion.TransfusionProcess;

import java.util.List;

public interface TransfusionProcessService {
    // Phê duyệt request (nếu chưa có) hoặc cập nhật process nếu đã tồn tại
    TransfusionProcess createOrUpdate(Long requestId, TransfusionProcessDTO dto);

    // Lấy process theo request ID
    TransfusionProcess findByRequestId(Long requestId);

    // Lấy toàn bộ
    List<TransfusionProcess> findAll();

    // Xóa mềm hoặc cứng tùy nhu cầu
    void delete(Long requestId);

    // Cập nhật trực tiếp bằng ID (không theo requestId)
    TransfusionProcess updateById(Long id, TransfusionProcessDTO dto);
}

