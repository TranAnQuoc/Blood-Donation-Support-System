package com.gtwo.bdss_system.dto.commons;

import com.gtwo.bdss_system.enums.StatusBloodStorage;
import com.gtwo.bdss_system.enums.StatusVerified;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VerifiedNote {

    @NotNull(message = "Bắt buộc phải điền trạng thái xác thực! CONFIRM or UNCONFIRM")
    private StatusVerified status;

    @NotNull(message = "Bắt buộc phải điền nội dung xác thực!")
    private String verifiedNote;
}
