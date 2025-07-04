package com.gtwo.bdss_system.service.emergency.impl;

import com.gtwo.bdss_system.dto.emergency.EmergencyNotificationDTO;
import com.gtwo.bdss_system.service.emergency.EmergencyNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmergencyNotificationServiceImpl implements EmergencyNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendEmergencyNotification(String message) {
        messagingTemplate.convertAndSend("/topic/emergency", new EmergencyNotificationDTO(message));
    }
}
