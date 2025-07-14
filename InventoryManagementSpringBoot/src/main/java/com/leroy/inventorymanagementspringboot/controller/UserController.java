package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.request.RegisterStaffDto;
import com.leroy.inventorymanagementspringboot.dto.request.RegisterStoreKeeperDto;
import com.leroy.inventorymanagementspringboot.dto.request.UpdatePasswordRequest;
import com.leroy.inventorymanagementspringboot.dto.response.UserEmailAndIdDto;
import com.leroy.inventorymanagementspringboot.dto.response.UserResponseDto;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.exception.ResourceNotFoundException;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
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
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/admin/register-user")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<User> registerUserByAdmin(@Valid @RequestBody RegisterStoreKeeperDto dto) {
        User registeredUser = userService.registerAdminOrStoreKeeperByAdmin(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    }

    @PostMapping("/storekeeper/register-staff")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<User> registerStaffByUser(
            @Valid @RequestBody RegisterStaffDto dto,
            @AuthenticationPrincipal UserDetails authenticatedUser) {

        User registeredStaff = userService.registerStaffByStoreKeeper(dto, authenticatedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredStaff);
    }

    @GetMapping("/storekeeper/get-users")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<List<UserResponseDto>> getAllUsers(@AuthenticationPrincipal UserDetails userDetails) {
        User storekeeper = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Optional<List<UserResponseDto>> users = userService.getUsersByDepartment(storekeeper.getDepartment());
        return users.map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PutMapping("user/update-status") // Changed to PUT for updating state
    @PreAuthorize("hasAnyRole('STOREKEEPER', 'ADMIN')")
    public ResponseEntity<?> updateUserStatus(@Valid @RequestBody UserResponseDto userResponseDto) {
        userService.setStaffStatus(userResponseDto);
        return ResponseEntity.ok(userResponseDto);
    }

    @GetMapping("users/get-general-notification-service-emails")
    @PreAuthorize("hasAnyAuthority('STOREKEEPER', 'ADMIN')")
    public ResponseEntity<Optional<List<String>>> getGeneralNotificationServiceEmails(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(userService.fetchGeneralNotificationServiceUsersEmails(userDetails));
        } catch (EntityNotFoundException e){
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
           return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/users/get-profile")
    public ResponseEntity<UserResponseDto> fetchUserDetails(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(userService.fetchUserDetails(userDetails));
        } catch (EntityNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/users/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            userService.changePassword(updatePasswordRequest, userDetails);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/users/get-all-emails-and-ids")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<Optional<List<UserEmailAndIdDto>>> getAllUserEmailsAndIds(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getEmailsAndIds(userDetails));
    }
}
