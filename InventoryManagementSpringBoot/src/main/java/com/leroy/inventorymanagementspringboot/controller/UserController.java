package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.request.RegisterStaffDto;
import com.leroy.inventorymanagementspringboot.dto.request.RegisterStoreKeeperDto;
import com.leroy.inventorymanagementspringboot.dto.request.UpdatePasswordRequest;
import com.leroy.inventorymanagementspringboot.dto.request.UpdateProfileRequest;
import com.leroy.inventorymanagementspringboot.dto.response.StaffResponseDto;
import com.leroy.inventorymanagementspringboot.dto.response.UserEmailAndIdDto;
import com.leroy.inventorymanagementspringboot.dto.response.UserResponseDto;
import com.leroy.inventorymanagementspringboot.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/admin/register-user")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponseDto> registerUserByAdmin(@Valid @RequestBody RegisterStoreKeeperDto dto) {
        var registeredUser = userService.registerAdminOrStoreKeeperByAdmin(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    }

    @PostMapping("/storekeeper/register-staff")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<UserResponseDto> registerStaffByUser(
            @Valid @RequestBody RegisterStaffDto dto,
            @AuthenticationPrincipal UserDetails authenticatedUser) {

        var registeredStaff = userService.registerStaffByStoreKeeper(dto, authenticatedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredStaff);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getUsers());
    }

    @GetMapping("/storekeeper/get-users")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<List<StaffResponseDto>> getAllDepartmentUsers(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<StaffResponseDto> users = userService.getDepartmentStaff(userDetails);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/update-status") // Changed to PUT for updating state
    @PreAuthorize("hasAnyAuthority('STOREKEEPER', 'ADMIN')")
    public ResponseEntity<UserResponseDto> updateUserStatus(@Valid @RequestBody UserResponseDto userResponseDto) {
        userService.setStaffStatus(userResponseDto);
        return ResponseEntity.ok(userResponseDto);
    }

    @GetMapping("/get-general-notification-service-emails")
    @PreAuthorize("hasAnyAuthority('STOREKEEPER', 'ADMIN')")
    public ResponseEntity<Optional<List<String>>> getGeneralNotificationServiceEmails(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(userService.fetchGeneralNotificationServiceUsersEmails(userDetails));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/get-profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponseDto> fetchUserDetails(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            return ResponseEntity.ok(userService.fetchUserDetails(userDetails));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            userService.changePassword(updatePasswordRequest, userDetails);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<UserResponseDto> updateProfile(@Valid @RequestBody UpdateProfileRequest updateProfileRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            UserResponseDto updatedUser = userService.updateProfile(updateProfileRequest, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/get-all-emails-and-ids")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<List<UserEmailAndIdDto>> getAllUserEmailsAndIds(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getEmailsAndIds(userDetails));
    }
}
