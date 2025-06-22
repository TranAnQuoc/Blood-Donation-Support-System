package com.gtwo.bdss_system.dto.donation;

import com.gtwo.bdss_system.enums.Status;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


import java.sql.Date;
import java.sql.Time;

@Data
public class DonationScheduleDTO {
    @NotBlank(message = "Tên lịch hiến máu không được để trống")
    private String name;

    @NotNull(message = "Ngày diễn ra không được để trống")
    @FutureOrPresent(message = "Ngày diễn ra phải là hôm nay hoặc tương lai")
    private Date date;

    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private Time startTime;

    @NotNull(message = "Thời gian kết thúc không được để trống")
    private Time endTime;

    @Min(value = 0)
    private int currentSlot;

    @Min(value = 1, message = "Số slot phải lớn hơn 0")
    private int maxSlot;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    private Status status;
}
