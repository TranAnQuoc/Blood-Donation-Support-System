package com.gtwo.bdss_system.dto.donation;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DonationSurveyDTO {

    @NotNull(message = "Bạn phải xác nhận tình trạng sức khỏe hôm nay.")
    private Boolean isHealthyToday;

    @NotNull(message = "Vui lòng cho biết bạn có đang có triệu chứng (sốt, ho, tiêu chảy...) không.")
    private Boolean hasSymptoms;

    @NotNull(message = "Vui lòng cho biết bạn có từng mắc bệnh truyền nhiễm không.")
    private Boolean hasInfectiousDiseases;

    @NotNull(message = "Vui lòng cho biết bạn có quan hệ không an toàn gần đây không.")
    private Boolean unsafeSex;

    @NotNull(message = "Vui lòng cho biết bạn có phẫu thuật/xăm trong vòng 6 tháng không.")
    private Boolean recentSurgeryTattoo;

    @NotNull(message = "Vui lòng cho biết bạn có tiêm vaccine gần đây không.")
    private Boolean recentVaccination;

    @NotNull(message = "Vui lòng cho biết bạn có đang sử dụng thuốc không.")
    private Boolean onMedication;

    @NotNull(message = "Vui lòng cho biết bạn có bệnh mãn tính không.")
    private Boolean hasChronicDisease;

    @Size(max = 255, message = "Ghi chú bệnh mãn tính không được vượt quá 255 ký tự.")
    private String chronicDiseaseNote;

    @Min(value = 0, message = "Số ngày kể từ lần hiến máu gần nhất không hợp lệ.")
    @Max(value = 10000, message = "Số ngày kể từ lần hiến máu quá lớn.")
    private Integer lastDonationDays;

    @NotNull(message = "Vui lòng cho biết bạn có từng bị phản ứng sau khi hiến không.")
    private Boolean hadReactionPreviousDonation;

    @Size(max = 255, message = "Ghi chú phản ứng sau hiến không được vượt quá 255 ký tự.")
    private String previousReactionNote;
}