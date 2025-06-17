package com.gtwo.bdss_system.controller.auth;

import com.gtwo.bdss_system.dto.auth.AccountCreateDTO;
import com.gtwo.bdss_system.dto.auth.AccountProfileDTO;
import com.gtwo.bdss_system.dto.auth.AccountResponse;
import com.gtwo.bdss_system.dto.auth.AccountUpdateDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusDonation;
import com.gtwo.bdss_system.service.auth.AccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/account")
@SecurityRequirement(name = "api")
public class AccountApi {

    @Autowired
    private AccountService accountService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping("/admin/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> createStaffOrAdmin(@Valid @RequestBody AccountCreateDTO dto) {
        accountService.createByAdmin(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/member/profile")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<Void> updateMemberProfile(@AuthenticationPrincipal Account currentUser,
                                                    @Valid @RequestBody AccountProfileDTO dto) {
        accountService.updateProfile(currentUser, dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/manager/profile")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ResponseEntity<Void> updateStaffOrAdminProfile(@AuthenticationPrincipal Account currentUser,
                                                          @Valid @RequestBody AccountUpdateDTO dto) {
        accountService.updateByAdminOrStaff(currentUser.getId(), dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/member/delete/{status}")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<Void> updateSelfStatus(@AuthenticationPrincipal Account currentUser,
                                                 @PathVariable Status status) {
        accountService.setSelfStatus(currentUser.getId(), status);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/staff/delete/{id}/{status}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Void> staffUpdateMemberStatus(@AuthenticationPrincipal Account currentUser,
                                                        @PathVariable Long id,
                                                        @PathVariable Status status) {
        accountService.staffSetStatus(currentUser.getId(), id, status);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admin/delete/{id}/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> adminUpdateStaffOrAdminStatus(@AuthenticationPrincipal Account currentUser,
                                                              @PathVariable Long id,
                                                              @PathVariable Status status) {
        accountService.adminSetStatus(currentUser.getId(), id, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/view-profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER', 'STAFF')")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal Account currentUser) {
        return ResponseEntity.ok(accountService.getProfile(currentUser));
    }

    @GetMapping("/list-account/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AccountResponse>> getAllAccountsByRole(@PathVariable Role role) {
        return ResponseEntity.ok(accountService.getAllByRole(role));
    }

    @GetMapping("/list-account/member")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<AccountResponse>> getAllMembers() {
        return ResponseEntity.ok(accountService.getAllByRole(Role.MEMBER));
    }
}
