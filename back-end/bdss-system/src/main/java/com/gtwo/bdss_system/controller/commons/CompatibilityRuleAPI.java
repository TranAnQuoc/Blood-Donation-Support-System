package com.gtwo.bdss_system.controller.commons;

import com.gtwo.bdss_system.entity.commons.CompatibilityRule;
import com.gtwo.bdss_system.service.commons.CompatibilityRuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/compatibility-rule")
public class CompatibilityRuleAPI {

    @Autowired
    private CompatibilityRuleService service;

    @GetMapping("/check-compatibility")
    public ResponseEntity<?> checkCompatibility(
            @RequestParam Long donorBloodTypeId,
            @RequestParam Long recipientBloodTypeId,
            @RequestParam Long componentId
    ) {
        CompatibilityRule rule = service.getRule(donorBloodTypeId, recipientBloodTypeId, componentId);
        return ResponseEntity.ok(rule);
    }
}
