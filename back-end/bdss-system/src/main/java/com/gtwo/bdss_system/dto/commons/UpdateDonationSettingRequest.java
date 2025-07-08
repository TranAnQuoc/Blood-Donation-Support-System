package com.gtwo.bdss_system.dto.commons;

import com.gtwo.bdss_system.enums.PhoneVisibility;
import com.gtwo.bdss_system.enums.StatusDonation;
import lombok.Data;

@Data
public class UpdateDonationSettingRequest {
    private StatusDonation statusDonation;
    private PhoneVisibility phoneVisibility;
}
