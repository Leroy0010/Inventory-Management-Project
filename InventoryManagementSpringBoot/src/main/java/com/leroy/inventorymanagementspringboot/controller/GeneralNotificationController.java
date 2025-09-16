package com.leroy.inventorymanagementspringboot.controller;

import java.util.List;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leroy.inventorymanagementspringboot.dto.request.GeneralNotificationRequest;
import com.leroy.inventorymanagementspringboot.dto.response.GeneralNotificationResponse;
import com.leroy.inventorymanagementspringboot.service.NotificationService;

@RestController
@RequestMapping("/api/general-notifications")
@AllArgsConstructor
public class GeneralNotificationController {

    private final NotificationService notificationService;


    @GetMapping("/available-users")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STOREKEEPER')")
    public ResponseEntity<List<String>> getAvailableUsers(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(notificationService.getAvailableUsers(userDetails));
    }

    @PostMapping("/send")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STOREKEEPER')")
    public ResponseEntity<GeneralNotificationResponse> sendGeneralNotification(
            @RequestBody GeneralNotificationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        var recipients = notificationService.sendGeneralNotification(userDetails, request);
        var response = new GeneralNotificationResponse();
        response.setMessage("Notification sent successfully to " + recipients.size() + " recipients");
        return ResponseEntity.ok(response);
    }

}