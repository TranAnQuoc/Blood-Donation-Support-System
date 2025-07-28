package com.gtwo.bdss_system.service.automatic;

import com.gtwo.bdss_system.service.commons.BloodStorageService;
import com.gtwo.bdss_system.service.donation.DonationEventService;
import com.gtwo.bdss_system.service.donation.DonationHistoryService;
import com.gtwo.bdss_system.service.donation.DonationProcessService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class SchedulingServiceImpl {

    @Autowired
    private DonationHistoryService donationHistoryService;

    @Autowired
    private DonationProcessService donationProcessService;

    @Autowired
    private DonationEventService donationEventService;

    @Autowired
    private BloodStorageService bloodStorageService;

    //second minute hour day month dayOfWeek
//    @Scheduled(cron = "0 00 00 * * ?")
    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void autoScanAndSendReminder() {
        donationHistoryService.scanAndSendReminderToAllEligible();
        donationProcessService.autoSetupExpiredProcesses();
        donationEventService.autoExpirePastEvents();
        bloodStorageService.checkAndExpireStoredBags();
        System.out.println("✅ Đã tự động quét và gửi mail reminder cho donor vào 0h mỗi ngày!");
    }
}
