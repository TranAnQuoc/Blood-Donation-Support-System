package com.gtwo.bdss_system.dto.transfusion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TransfusionRequestDTO {
    private Long id;

    @NotBlank(message = "TÃªn ngÆ°á»i nháº­n khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng")
    @Size(max = 100, message = "TÃªn ngÆ°á»i nháº­n tá»‘i Ä‘a 100 kÃ½ tá»±")
    private String recipientName;

    @NotBlank(message = "Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng há»£p lá»‡")
    private String recipientPhone;

    @NotBlank(message = "MÃ´ táº£ khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng")
    @Size(max = 500, message = "MÃ´ táº£ tá»‘i Ä‘a 500 kÃ½ tá»±")
    private String description;

    @Size(max = 255, message = "Äá»‹a chá»‰ tá»‘i Ä‘a 255 kÃ½ tá»±")
    private String address;
}
