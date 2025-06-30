package com.gtwo.bdss_system.config;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.entity.commons.CompatibilityRule;
import com.gtwo.bdss_system.enums.Gender;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.repository.auth.AccountRepository;
import com.gtwo.bdss_system.repository.auth.AuthenticationRepository;
import com.gtwo.bdss_system.repository.commons.BloodComponentRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
import com.gtwo.bdss_system.repository.commons.CompatibilityRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializr implements CommandLineRunner {

    @Autowired
    private BloodTypeRepository bloodTypeRepository;

    @Autowired
    private BloodComponentRepository bloodComponentRepository;

    @Autowired
    private CompatibilityRuleRepository compatibilityRuleRepository;

    @Override
    public void run(String... args) {
        initBloodTypes();
        initBloodComponents();
        initCompatibilityRules();
    }

    private void initBloodTypes() {
        if (bloodTypeRepository.count() == 0) {
            List<BloodType> bloodTypes = List.of(
                    createBloodType("UNKNOWN", "UNKNOWN"),
                    createBloodType("A", "+"),
                    createBloodType("A", "-"),
                    createBloodType("B", "+"),
                    createBloodType("B", "-"),
                    createBloodType("AB", "+"),
                    createBloodType("AB", "-"),
                    createBloodType("O", "+"),
                    createBloodType("O", "-")
            );
            bloodTypeRepository.saveAll(bloodTypes);
            System.out.println("✅ Seeded blood types");
        }
    }

    private BloodType createBloodType(String type, String rhFactor) {
        BloodType bloodType = new BloodType();
        bloodType.setType(type);
        bloodType.setRhFactor(rhFactor);
        return bloodType;
    }

    private void initBloodComponents() {
        if (bloodComponentRepository.count() == 0) {
            List<BloodComponent> components = List.of(
                    createBloodComponent("Unknow"),
                    createBloodComponent("Toàn phần"),
                    createBloodComponent("Huyết tương"),
                    createBloodComponent("Hồng cầu"),
                    createBloodComponent("Tiểu cầu"),
                    createBloodComponent("Bạch cầu")
            );
            bloodComponentRepository.saveAll(components);
            System.out.println("✅ Seeded blood components");
        }
    }

    private BloodComponent createBloodComponent(String name) {
        BloodComponent component = new BloodComponent();
        component.setName(name);
        return component;
    }

    private void initCompatibilityRules() {
        if (compatibilityRuleRepository.count() == 0) {
            List<BloodType> bloodTypes = bloodTypeRepository.findAll();
            List<BloodComponent> components = bloodComponentRepository.findAll();
            List<CompatibilityRule> rules = new ArrayList<>();
            for (BloodType donor : bloodTypes) {
                for (BloodType recipient : bloodTypes) {
                    for (BloodComponent component : components) {
                        // Bỏ UNKNOWN
                        if ("UNKNOWN".equals(donor.getType()) || "UNKNOWN".equals(recipient.getType()) || "Unknow".equals(component.getName())) {
                            continue;
                        }
                        boolean isCompatible = false;
                        String explanation = "";
                        String dType = donor.getType();
                        String dRh = donor.getRhFactor();
                        String rType = recipient.getType();
                        String rRh = recipient.getRhFactor();
                        // --- HỒNG CẦU ---
                        if ("Hồng cầu".equals(component.getName()) || "Toàn phần".equals(component.getName())) {
                            if ("O".equals(dType) && "-".equals(dRh)) {
                                isCompatible = true;
                                explanation = "O- có thể truyền cho tất cả (universal red cell donor)";
                            } else if ("O".equals(dType) && "+".equals(dRh)) {
                                isCompatible = "+".equals(rRh) && (List.of("O", "A", "B", "AB").contains(rType));
                                explanation = isCompatible ? "O+ truyền cho nhóm Rh+" : "Không phù hợp";
                            } else if ("A".equals(dType) && "-".equals(dRh)) {
                                isCompatible = List.of("A", "AB").contains(rType) && (List.of("-", "+").contains(rRh));
                                explanation = isCompatible ? "A- truyền cho A, AB" : "Không phù hợp";
                            } else if ("A".equals(dType) && "+".equals(dRh)) {
                                isCompatible = List.of("A", "AB").contains(rType) && "+".equals(rRh);
                                explanation = isCompatible ? "A+ truyền cho A+, AB+" : "Không phù hợp";
                            } else if ("B".equals(dType) && "-".equals(dRh)) {
                                isCompatible = List.of("B", "AB").contains(rType) && (List.of("-", "+").contains(rRh));
                                explanation = isCompatible ? "B- truyền cho B, AB" : "Không phù hợp";
                            } else if ("B".equals(dType) && "+".equals(dRh)) {
                                isCompatible = List.of("B", "AB").contains(rType) && "+".equals(rRh);
                                explanation = isCompatible ? "B+ truyền cho B+, AB+" : "Không phù hợp";
                            } else if ("AB".equals(dType) && "-".equals(dRh)) {
                                isCompatible = "AB".equals(rType) && (List.of("-", "+").contains(rRh));
                                explanation = isCompatible ? "AB- truyền cho AB" : "Không phù hợp";
                            } else if ("AB".equals(dType) && "+".equals(dRh)) {
                                isCompatible = "AB".equals(rType) && "+".equals(rRh);
                                explanation = isCompatible ? "AB+ truyền cho AB+" : "Không phù hợp";
                            }
                        }
                        // --- HUYẾT TƯƠNG ---
                        else if ("Huyết tương".equals(component.getName())) {
                            if ("AB".equals(dType)) {
                                isCompatible = true;
                                explanation = "AB có thể cho mọi nhóm (universal plasma donor)";
                            } else if ("A".equals(dType)) {
                                isCompatible = List.of("A", "O").contains(rType);
                                explanation = isCompatible ? "A cho A, O (plasma)" : "Không phù hợp";
                            } else if ("B".equals(dType)) {
                                isCompatible = List.of("B", "O").contains(rType);
                                explanation = isCompatible ? "B cho B, O (plasma)" : "Không phù hợp";
                            } else if ("O".equals(dType)) {
                                isCompatible = "O".equals(rType);
                                explanation = isCompatible ? "O chỉ cho O (plasma)" : "Không phù hợp";
                            }
                        }
                        // --- TIỂU CẦU và các thành phần khác (dùng theo logic hồng cầu) ---
                        else {
                            if ("O".equals(dType) && "-".equals(dRh)) {
                                isCompatible = true;
                                explanation = "O- có thể truyền tiểu cầu và thành phần khác cho tất cả";
                            } else if ("O".equals(dType) && "+".equals(dRh)) {
                                isCompatible = "+".equals(rRh) && (List.of("O", "A", "B", "AB").contains(rType));
                                explanation = isCompatible ? "O+ truyền được cho nhóm Rh+" : "Không phù hợp";
                            } else if ("A".equals(dType) && "-".equals(dRh)) {
                                isCompatible = List.of("A", "AB").contains(rType) && (List.of("-", "+").contains(rRh));
                                explanation = isCompatible ? "A- truyền cho A, AB" : "Không phù hợp";
                            } else if ("A".equals(dType) && "+".equals(dRh)) {
                                isCompatible = List.of("A", "AB").contains(rType) && "+".equals(rRh);
                                explanation = isCompatible ? "A+ truyền cho A+, AB+" : "Không phù hợp";
                            } else if ("B".equals(dType) && "-".equals(dRh)) {
                                isCompatible = List.of("B", "AB").contains(rType) && (List.of("-", "+").contains(rRh));
                                explanation = isCompatible ? "B- truyền cho B, AB" : "Không phù hợp";
                            } else if ("B".equals(dType) && "+".equals(dRh)) {
                                isCompatible = List.of("B", "AB").contains(rType) && "+".equals(rRh);
                                explanation = isCompatible ? "B+ truyền cho B+, AB+" : "Không phù hợp";
                            } else if ("AB".equals(dType) && "-".equals(dRh)) {
                                isCompatible = "AB".equals(rType) && (List.of("-", "+").contains(rRh));
                                explanation = isCompatible ? "AB- truyền cho AB" : "Không phù hợp";
                            } else if ("AB".equals(dType) && "+".equals(dRh)) {
                                isCompatible = "AB".equals(rType) && "+".equals(rRh);
                                explanation = isCompatible ? "AB+ truyền cho AB+" : "Không phù hợp";
                            }
                        }
                        CompatibilityRule rule = new CompatibilityRule();
                        rule.setDonorBloodType(donor);
                        rule.setRecipientBloodType(recipient);
                        rule.setComponent(component);
                        rule.setCompatible(isCompatible);
                        rule.setExplanation(explanation);
                        rules.add(rule);
                    }
                }
            }
            compatibilityRuleRepository.saveAll(rules);
            System.out.println("✅ Seeded compatibility rules (full logic)");
        }
    }
}
