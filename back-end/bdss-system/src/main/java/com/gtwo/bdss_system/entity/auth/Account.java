package com.gtwo.bdss_system.entity.auth;

import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "Account")
@Data
public class Account implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Email", unique = true)
    private String email;

    @Column(name = "CCCD", unique = true)
    private String CCCD;

    @Column(name = "Password")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role")
    private Role role;

    @Column(name = "Full_Name")
    @Nationalized
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "Gender")
    private Gender gender;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "BloodTypeID")
    private BloodType bloodType;

    @Column(name = "Date_of_birth")
    private Date dateOfBirth;

    @Column(name = "Phone", unique = true)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "Phone_Visibility")
    private PhoneVisibility phoneVisibility;

    @Column(name = "Address")
    @Nationalized
    private String address;

    @Column(name = "Create_at")
    private LocalDateTime createAt;

    @PrePersist
    protected void onCreate() {
        this.createAt = LocalDateTime.now();
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status_Donation")
    private StatusDonation statusDonation;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.status == Status.ACTIVE;
    }

    public String getFullName() {
        return this.fullName;
    }
}
