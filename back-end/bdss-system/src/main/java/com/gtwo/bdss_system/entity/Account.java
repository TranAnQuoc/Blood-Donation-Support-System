package com.gtwo.bdss_system.entity;

import com.gtwo.bdss_system.enums.Gender;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusDonation;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Account")
@Data
public class Account implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "Email")
    private String email;

    @Column(name = "Password")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role")
    private Role role;

    @Column(name = "Full_Name")
    private String fullName;

    @Enumerated(EnumType.STRING)
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

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status_Donation")
    private StatusDonation statusDonation;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}
