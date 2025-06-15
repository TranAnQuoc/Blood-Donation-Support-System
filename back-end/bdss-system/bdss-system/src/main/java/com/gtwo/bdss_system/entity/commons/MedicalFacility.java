package com.gtwo.bdss_system.entity.commons;

import com.gtwo.bdss_system.enums.FacilityStatus;
import com.gtwo.bdss_system.enums.Status;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "Medical_Facility")
@Data
public class MedicalFacility {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Name")
    @Nationalized
    private String name;

    @Column(name = "Address")
    @Nationalized
    private String address;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Region")
    @Nationalized
    private String region;

    @Column(name = "Status_Facility")
    @Enumerated(EnumType.STRING)
    private FacilityStatus facilityStatus;

    @Column(name = "Status")
    @Enumerated(EnumType.STRING)
    private Status status;
}
