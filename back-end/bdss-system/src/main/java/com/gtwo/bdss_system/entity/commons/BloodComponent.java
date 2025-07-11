package com.gtwo.bdss_system.entity.commons;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "Blood_Component")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class BloodComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Component")
    @Nationalized
    private String name;
}
