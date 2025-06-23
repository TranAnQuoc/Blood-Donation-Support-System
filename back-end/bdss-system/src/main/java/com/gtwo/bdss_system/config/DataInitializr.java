package com.gtwo.bdss_system.config;

import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodComponent;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.Gender;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.repository.auth.AccountRepository;
import com.gtwo.bdss_system.repository.auth.AuthenticationRepository;
import com.gtwo.bdss_system.repository.commons.BloodComponentRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.List;

@Component
public class DataInitializr implements CommandLineRunner {

    @Autowired
    private BloodTypeRepository bloodTypeRepository;
    @Autowired
    private BloodComponentRepository bloodComponentRepository;

    @Override
    public void run(String... args) {
        initBloodTypes();
        initBloodComponents();
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
                    createBloodComponent("Plasma"),
                    createBloodComponent("Red Blood Cells"),
                    createBloodComponent("Platelets"),
                    createBloodComponent("White Blood Cells")
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
}
