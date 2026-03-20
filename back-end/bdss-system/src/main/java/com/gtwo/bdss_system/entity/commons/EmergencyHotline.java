package com.gtwo.bdss_system.entity.commons;

import com.gtwo.bdss_system.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "emergency_hotline")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyHotline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "Facility_name")
    @Nationalized
    private String name;

    @Column(name = "Number")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "Số hotline không hợp lệ (phải bắt đầu bằng 0 hoặc +84 và đủ 10 số)")
    private String number;

    @Column(name = "Address")
    @Nationalized
    private String address;

    @Column(name = "Status")
    @Enumerated(EnumType.STRING)
    private Status status;
}
