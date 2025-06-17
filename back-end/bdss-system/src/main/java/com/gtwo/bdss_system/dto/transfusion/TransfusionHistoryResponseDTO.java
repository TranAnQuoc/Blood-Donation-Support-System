package com.gtwo.bdss_system.dto.transfusion;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TransfusionHistoryResponseDTO {

    private Long id;
    private Long recipientId;
    private String fullNameSnapshot;
    private LocalDate birthdateSnapshot;
    private String bloodTypeSnapshot;
    private String rhFactorSnapshot;
    private LocalDate transfusionDate;
    private String facilityName;
    private String componentReceived;
    private Integer quantity;
    private String resultNotes;

}
