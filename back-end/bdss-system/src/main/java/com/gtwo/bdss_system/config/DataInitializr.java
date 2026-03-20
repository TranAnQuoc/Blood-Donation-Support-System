package com.gtwo.bdss_system.config;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.entity.commons.CompatibilityRule;
import com.gtwo.bdss_system.enums.Gender;
import com.gtwo.bdss_system.enums.PhoneVisibility;
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

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializr implements CommandLineRunner {

    private static final String DEFAULT_ADMIN_EMAIL = "admin@system.com";
    private static final String DEFAULT_ADMIN_PASSWORD = "123456";
    private static final LocalDate DEFAULT_ADMIN_BIRTH_DATE = LocalDate.of(1990, 1, 1);

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
        Account admin = authenticationRepository.findByEmail(DEFAULT_ADMIN_EMAIL).orElse(null);
        boolean created = admin == null;

        if (created) {
            admin = new Account();
            admin.setEmail(DEFAULT_ADMIN_EMAIL);
            admin.setPassword(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
            admin.setRole(Role.ADMIN);
            admin.setPhone("0000000000");
            admin.setCCCD("000000000000");
            admin.setCreateAt(LocalDateTime.now());
        }

        boolean updated = false;
        BloodType defaultBloodType = bloodTypeRepository.findById(1L)
                .orElseGet(() -> bloodTypeRepository.findAll().stream()
                        .findFirst()
                        .orElseThrow(() -> new IllegalStateException("No blood types available for admin seed")));

        if (admin.getRole() == null) {
            admin.setRole(Role.ADMIN);
            updated = true;
        }
        if (admin.getFullName() == null || admin.getFullName().isBlank()) {
            admin.setFullName("Admin System");
            updated = true;
        }
        if (admin.getStatus() == null) {
            admin.setStatus(Status.ACTIVE);
            updated = true;
        }
        if (admin.getStatusDonation() == null) {
            admin.setStatusDonation(StatusDonation.INACTIVE);
            updated = true;
        }
        if (admin.getGender() == null) {
            admin.setGender(Gender.MALE);
            updated = true;
        }
        if (admin.getDateOfBirth() == null) {
            admin.setDateOfBirth(Date.valueOf(DEFAULT_ADMIN_BIRTH_DATE));
            updated = true;
        }
        if (admin.getPhoneVisibility() == null) {
            admin.setPhoneVisibility(PhoneVisibility.PRIVATE);
            updated = true;
        }
        if (admin.getPhone() == null || admin.getPhone().isBlank()) {
            admin.setPhone("0000000000");
            updated = true;
        }
        if (admin.getCCCD() == null || admin.getCCCD().isBlank()) {
            admin.setCCCD("000000000000");
            updated = true;
        }
        if (admin.getAddress() == null || admin.getAddress().isBlank()) {
            admin.setAddress("System Default Address");
            updated = true;
        }
        if (admin.getBloodType() == null) {
            admin.setBloodType(defaultBloodType);
            updated = true;
        }

        if (created || updated) {
            authenticationRepository.save(admin);
            System.out.println(
                    created
                            ? "Default admin account created: admin@system.com / 123456"
                            : "Default admin account updated with missing profile fields"
            );
        }
    }

    private void initBloodTypes() {
        if (bloodTypeRepository.count() == 0) {
            List<BloodType> bloodTypes = List.of(
                    createBloodType("Unknown", "Unknown"),
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
            System.out.println("Seeded blood types");
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
                    createBloodComponent("Unknown"),
                    createBloodComponent("Toàn phần"),
                    createBloodComponent("Huyết tương"),
                    createBloodComponent("Hồng cầu"),
                    createBloodComponent("Tiểu cầu"),
                    createBloodComponent("Bạch cầu")
            );
            bloodComponentRepository.saveAll(components);
            System.out.println("Seeded blood components");
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
                        boolean donorUnknown = "Unknown".equalsIgnoreCase(donor.getType());
                        boolean recipientUnknown = "Unknown".equalsIgnoreCase(recipient.getType());
                        boolean componentUnknown = "Unknown".equalsIgnoreCase(component.getName());

                        if ((donorUnknown || recipientUnknown) && componentUnknown) {
                            CompatibilityRule unknownRule = new CompatibilityRule();
                            unknownRule.setDonorBloodType(donor);
                            unknownRule.setRecipientBloodType(recipient);
                            unknownRule.setComponent(component);
                            unknownRule.setCompatible(true);
                            unknownRule.setExplanation(
                                    "Reference only: donor, recipient, and component information are still unknown."
                            );
                            rules.add(unknownRule);
                            continue;
                        }

                        if ((donorUnknown || recipientUnknown) && !componentUnknown) {
                            for (BloodType resolvedDonor : bloodTypes) {
                                for (BloodType resolvedRecipient : bloodTypes) {
                                    if ("Unknown".equalsIgnoreCase(resolvedDonor.getType())
                                            || "Unknown".equalsIgnoreCase(resolvedRecipient.getType())) {
                                        continue;
                                    }
                                    rules.add(createRule(resolvedDonor, resolvedRecipient, component));
                                }
                            }
                            continue;
                        }

                        if (!donorUnknown && !recipientUnknown && componentUnknown) {
                            for (BloodComponent resolvedComponent : components) {
                                if ("Unknown".equalsIgnoreCase(resolvedComponent.getName())) {
                                    continue;
                                }
                                rules.add(createRule(donor, recipient, resolvedComponent));
                            }
                            continue;
                        }

                        if (!donorUnknown && !recipientUnknown) {
                            rules.add(createRule(donor, recipient, component));
                        }
                    }
                }
            }

            compatibilityRuleRepository.saveAll(rules);
            System.out.println("Seeded compatibility rules");
        }
    }

    private CompatibilityRule createRule(BloodType donor, BloodType recipient, BloodComponent component) {
        boolean isCompatible = false;
        String explanation = "";

        String donorType = donor.getType();
        String donorRh = donor.getRhFactor();
        String recipientType = recipient.getType();
        String recipientRh = recipient.getRhFactor();
        String componentName = component.getName();

        if ("Hồng cầu".equals(componentName) || "Toàn phần".equals(componentName)) {
            if ("O".equals(donorType) && "-".equals(donorRh)) {
                isCompatible = true;
                explanation = "O- can donate red cells to all blood groups.";
            } else if ("O".equals(donorType) && "+".equals(donorRh)) {
                isCompatible = "+".equals(recipientRh);
                explanation = isCompatible ? "O+ can donate red cells to Rh+ recipients." : "Not compatible.";
            } else if ("A".equals(donorType) && "-".equals(donorRh)) {
                isCompatible = List.of("A", "AB").contains(recipientType);
                explanation = isCompatible ? "A- can donate red cells to A and AB." : "Not compatible.";
            } else if ("A".equals(donorType) && "+".equals(donorRh)) {
                isCompatible = List.of("A", "AB").contains(recipientType) && "+".equals(recipientRh);
                explanation = isCompatible ? "A+ can donate red cells to A+ and AB+." : "Not compatible.";
            } else if ("B".equals(donorType) && "-".equals(donorRh)) {
                isCompatible = List.of("B", "AB").contains(recipientType);
                explanation = isCompatible ? "B- can donate red cells to B and AB." : "Not compatible.";
            } else if ("B".equals(donorType) && "+".equals(donorRh)) {
                isCompatible = List.of("B", "AB").contains(recipientType) && "+".equals(recipientRh);
                explanation = isCompatible ? "B+ can donate red cells to B+ and AB+." : "Not compatible.";
            } else if ("AB".equals(donorType) && "-".equals(donorRh)) {
                isCompatible = "AB".equals(recipientType);
                explanation = isCompatible ? "AB- can donate red cells to AB." : "Not compatible.";
            } else if ("AB".equals(donorType) && "+".equals(donorRh)) {
                isCompatible = "AB".equals(recipientType) && "+".equals(recipientRh);
                explanation = isCompatible ? "AB+ can donate red cells to AB+." : "Not compatible.";
            }
        } else if ("Huyết tương".equals(componentName)) {
            if ("AB".equals(donorType)) {
                isCompatible = true;
                explanation = "AB plasma can be given to all blood groups.";
            } else if ("A".equals(donorType)) {
                isCompatible = List.of("A", "O").contains(recipientType);
                explanation = isCompatible ? "A plasma can be given to A and O." : "Not compatible.";
            } else if ("B".equals(donorType)) {
                isCompatible = List.of("B", "O").contains(recipientType);
                explanation = isCompatible ? "B plasma can be given to B and O." : "Not compatible.";
            } else if ("O".equals(donorType)) {
                isCompatible = "O".equals(recipientType);
                explanation = isCompatible ? "O plasma should only be given to O." : "Not compatible.";
            }
        } else {
            if ("O".equals(donorType) && "-".equals(donorRh)) {
                isCompatible = true;
                explanation = "O- is treated as the safest donor for platelets and similar components.";
            } else if ("O".equals(donorType) && "+".equals(donorRh)) {
                isCompatible = "+".equals(recipientRh);
                explanation = isCompatible ? "O+ can donate to Rh+ recipients." : "Not compatible.";
            } else if ("A".equals(donorType) && "-".equals(donorRh)) {
                isCompatible = List.of("A", "AB").contains(recipientType);
                explanation = isCompatible ? "A- can donate to A and AB." : "Not compatible.";
            } else if ("A".equals(donorType) && "+".equals(donorRh)) {
                isCompatible = List.of("A", "AB").contains(recipientType) && "+".equals(recipientRh);
                explanation = isCompatible ? "A+ can donate to A+ and AB+." : "Not compatible.";
            } else if ("B".equals(donorType) && "-".equals(donorRh)) {
                isCompatible = List.of("B", "AB").contains(recipientType);
                explanation = isCompatible ? "B- can donate to B and AB." : "Not compatible.";
            } else if ("B".equals(donorType) && "+".equals(donorRh)) {
                isCompatible = List.of("B", "AB").contains(recipientType) && "+".equals(recipientRh);
                explanation = isCompatible ? "B+ can donate to B+ and AB+." : "Not compatible.";
            } else if ("AB".equals(donorType) && "-".equals(donorRh)) {
                isCompatible = "AB".equals(recipientType);
                explanation = isCompatible ? "AB- can donate to AB." : "Not compatible.";
            } else if ("AB".equals(donorType) && "+".equals(donorRh)) {
                isCompatible = "AB".equals(recipientType) && "+".equals(recipientRh);
                explanation = isCompatible ? "AB+ can donate to AB+." : "Not compatible.";
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
