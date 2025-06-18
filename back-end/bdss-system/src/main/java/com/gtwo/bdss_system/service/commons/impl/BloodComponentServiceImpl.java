package com.gtwo.bdss_system.service.commons.impl;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "blood_component")
@Data
public class BloodComponentServiceImpl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;
}