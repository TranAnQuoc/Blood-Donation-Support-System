package com.gtwo.bdss_system.entity;

import com.gtwo.bdss_system.enums.Gender;
import com.gtwo.bdss_system.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Entity
@Table(name = "Account")
@Getter @Setter
@NoArgsConstructor
@ToString
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "Email")
    private String email;

    @Column(name = "Password")
    private String password;

    @Column(name = "Role")
    private Role role;

    @Column(name = "Full_Name")
    private String fullName;

    @Column(name = "Gender")
    private Gender gender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BloodTypeID")
    private BloodType bloodType;

    @Column(name = "Date_of_birth")
    private Date dateOfBirth;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Address")
    private String address;

    @Column(name = "Create_at")
    private Date createAt;

    @Column(name = "Status")
    private boolean status;


}
