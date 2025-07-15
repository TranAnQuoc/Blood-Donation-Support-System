package com.gtwo.bdss_system.config;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.entity.commons.CompatibilityRule;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusDonation;
import com.gtwo.bdss_system.repository.auth.AuthenticationRepository;
import com.gtwo.bdss_system.repository.commons.BloodComponentRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
import com.gtwo.bdss_system.repository.commons.CompatibilityRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
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

    @Autowired
    private AuthenticationRepository authenticationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initBloodTypes();
        initBloodComponents();
        initCompatibilityRules();
        initAdminAccount();
    }

    private void initAdminAccount() {
        if (!authenticationRepository.existsByRole(Role.ADMIN)) {
            Account admin = new Account();
            admin.setEmail("admin@system.com");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setRole(Role.ADMIN);
            admin.setFullName("Admin System");
            admin.setStatus(Status.ACTIVE);
            admin.setStatusDonation(StatusDonation.INACTIVE);
            admin.setPhone("0000000000");
            admin.setCCCD("000000000000");
            admin.setAddress("System Default Address");
            admin.setCreateAt(LocalDateTime.now());
            admin.setBloodType(bloodTypeRepository.findById(1L).orElseThrow());
            authenticationRepository.save(admin);
            System.out.println("✅ Default admin account created: admin@system.com / 123456");
        }
    }

    private void initBloodTypes() {
        if (bloodTypeRepository.count() == 0) {
            List<BloodType> bloodTypes = List.of(
                    createBloodType("Unknow", "Unknow"),
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

                        boolean donorUnknown = "UNKNOWN".equalsIgnoreCase(donor.getType());
                        boolean recipientUnknown = "UNKNOWN".equalsIgnoreCase(recipient.getType());
                        boolean componentUnknown = "Unknow".equalsIgnoreCase(component.getName());

                        // Nếu tất cả đều UNKNOWN => chỉ thông tin tham khảo
                        if ((donorUnknown || recipientUnknown) && componentUnknown) {
                            CompatibilityRule unknownRule = new CompatibilityRule();
                            unknownRule.setDonorBloodType(donor);
                            unknownRule.setRecipientBloodType(recipient);
                            unknownRule.setComponent(component);
                            unknownRule.setCompatible(true);
                            unknownRule.setExplanation("Thông tin tham khảo: Cả nhóm máu và thành phần đều chưa xác định.");
                            rules.add(unknownRule);
                            continue;
                        }

                        // Nếu blood type UNKNOWN nhưng component xác định => sinh toàn bộ rule cho component đó
                        if ((donorUnknown || recipientUnknown) && !componentUnknown) {
                            for (BloodType d : bloodTypes) {
                                for (BloodType r : bloodTypes) {
                                    if ("UNKNOWN".equalsIgnoreCase(d.getType()) || "UNKNOWN".equalsIgnoreCase(r.getType())) continue;
                                    CompatibilityRule rule = createRule(d, r, component);
                                    rules.add(rule);
                                }
                            }
                            continue;
                        }

                        // Nếu component UNKNOWN nhưng blood type xác định => sinh toàn bộ rule cho tất cả components
                        if (!donorUnknown && !recipientUnknown && componentUnknown) {
                            for (BloodComponent c : components) {
                                if ("Unknow".equalsIgnoreCase(c.getName())) continue;
                                CompatibilityRule rule = createRule(donor, recipient, c);
                                rules.add(rule);
                            }
                            continue;
                        }

                        // Nếu không có UNKNOWN => logic bình thường
                        if (!donorUnknown && !recipientUnknown && !componentUnknown) {
                            CompatibilityRule rule = createRule(donor, recipient, component);
                            rules.add(rule);
                        }
                    }
                }
            }

            compatibilityRuleRepository.saveAll(rules);
            System.out.println("✅ Seeded compatibility rules (new logic for unknown cases handled)");
        }
    }

    private CompatibilityRule createRule(BloodType donor, BloodType recipient, BloodComponent component) {
        boolean isCompatible = false;
        String explanation = "";

        String dType = donor.getType();
        String dRh = donor.getRhFactor();
        String rType = recipient.getType();
        String rRh = recipient.getRhFactor();

        // --- HỒNG CẦU & TOÀN PHẦN ---
        if ("Hồng cầu".equals(component.getName()) || "Toàn phần".equals(component.getName())) {
            if ("O".equals(dType) && "-".equals(dRh)) {
                isCompatible = true;
                explanation = "O- có thể truyền cho tất cả nhóm máu (universal red cell donor)";
            } else if ("O".equals(dType) && "+".equals(dRh)) {
                isCompatible = "+".equals(rRh);
                explanation = isCompatible ? "O+ truyền cho tất cả nhóm Rh+" : "Không phù hợp";
            } else if ("A".equals(dType) && "-".equals(dRh)) {
                isCompatible = List.of("A", "AB").contains(rType);
                explanation = isCompatible ? "A- truyền cho A, AB" : "Không phù hợp";
            } else if ("A".equals(dType) && "+".equals(dRh)) {
                isCompatible = List.of("A", "AB").contains(rType) && "+".equals(rRh);
                explanation = isCompatible ? "A+ truyền cho A+, AB+" : "Không phù hợp";
            } else if ("B".equals(dType) && "-".equals(dRh)) {
                isCompatible = List.of("B", "AB").contains(rType);
                explanation = isCompatible ? "B- truyền cho B, AB" : "Không phù hợp";
            } else if ("B".equals(dType) && "+".equals(dRh)) {
                isCompatible = List.of("B", "AB").contains(rType) && "+".equals(rRh);
                explanation = isCompatible ? "B+ truyền cho B+, AB+" : "Không phù hợp";
            } else if ("AB".equals(dType) && "-".equals(dRh)) {
                isCompatible = "AB".equals(rType);
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
                explanation = "AB có thể cho tất cả (universal plasma donor)";
            } else if ("A".equals(dType)) {
                isCompatible = List.of("A", "O").contains(rType);
                explanation = isCompatible ? "A cho A và O (plasma)" : "Không phù hợp";
            } else if ("B".equals(dType)) {
                isCompatible = List.of("B", "O").contains(rType);
                explanation = isCompatible ? "B cho B và O (plasma)" : "Không phù hợp";
            } else if ("O".equals(dType)) {
                isCompatible = "O".equals(rType);
                explanation = isCompatible ? "O chỉ cho O (plasma)" : "Không phù hợp";
            }
        }
        // --- TIỂU CẦU & KHÁC ---
        else {
            if ("O".equals(dType) && "-".equals(dRh)) {
                isCompatible = true;
                explanation = "O- có thể truyền tiểu cầu và các thành phần khác cho tất cả";
            } else if ("O".equals(dType) && "+".equals(dRh)) {
                isCompatible = "+".equals(rRh);
                explanation = isCompatible ? "O+ truyền cho các nhóm Rh+" : "Không phù hợp";
            } else if ("A".equals(dType) && "-".equals(dRh)) {
                isCompatible = List.of("A", "AB").contains(rType);
                explanation = isCompatible ? "A- truyền cho A, AB" : "Không phù hợp";
            } else if ("A".equals(dType) && "+".equals(dRh)) {
                isCompatible = List.of("A", "AB").contains(rType) && "+".equals(rRh);
                explanation = isCompatible ? "A+ truyền cho A+, AB+" : "Không phù hợp";
            } else if ("B".equals(dType) && "-".equals(dRh)) {
                isCompatible = List.of("B", "AB").contains(rType);
                explanation = isCompatible ? "B- truyền cho B, AB" : "Không phù hợp";
            } else if ("B".equals(dType) && "+".equals(dRh)) {
                isCompatible = List.of("B", "AB").contains(rType) && "+".equals(rRh);
                explanation = isCompatible ? "B+ truyền cho B+, AB+" : "Không phù hợp";
            } else if ("AB".equals(dType) && "-".equals(dRh)) {
                isCompatible = "AB".equals(rType);
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
        return rule;
    }
}
