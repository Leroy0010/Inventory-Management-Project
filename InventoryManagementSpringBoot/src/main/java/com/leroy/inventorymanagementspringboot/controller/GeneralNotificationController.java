package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.request.GeneralNotificationRequest;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.exception.ResourceNotFoundException;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.service.GeneralNotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/general-notifications")
public class GeneralNotificationController {

    private final GeneralNotificationService generalNotificationService;
    private final UserRepository userRepository;

    public GeneralNotificationController(GeneralNotificationService generalNotificationService, UserRepository userRepository) {
        this.generalNotificationService = generalNotificationService;
        this.userRepository = userRepository;
    }

    @PostMapping("/send")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STOREKEEPER')") // Only Admin or Storekeeper can send
    public ResponseEntity<String> sendGeneralNotification(
            @Valid @RequestBody GeneralNotificationRequest request,
            @AuthenticationPrincipal UserDetails authenticatedUser) {

        User senderUser = userRepository.findByEmail(authenticatedUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Sender user not found."));

        try {
            generalNotificationService.sendGeneralNotification(request, senderUser);
            return ResponseEntity.ok("General notification sent successfully.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send general notification: " + e.getMessage());
        }
    }
}