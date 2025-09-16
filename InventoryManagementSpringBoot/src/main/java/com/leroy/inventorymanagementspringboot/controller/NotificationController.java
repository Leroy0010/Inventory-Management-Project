package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.response.NotificationResponseDto;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.NotificationType;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.service.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponseDto>> getUnreadNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return ResponseEntity.ok(notificationService.getUnreadNotifications(user));
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getAllNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return ResponseEntity.ok(notificationService.getAllNotifications(user));
    }

    @PutMapping("/{id}/mark-read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count/unread")
    public ResponseEntity<Long> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return ResponseEntity.ok(notificationService.getUnreadCount(user));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<NotificationResponseDto>> getByType(@AuthenticationPrincipal UserDetails userDetails, @RequestParam NotificationType type){
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return ResponseEntity.ok(notificationService.getNotificationsByType(user.getId(), type));
    }

    @DeleteMapping("/delete-all-old")
    public ResponseEntity<Void> deleteAllOldNotifications(@AuthenticationPrincipal UserDetails userDetails, @RequestParam int daysOld) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return ResponseEntity.ok(notificationService.deleteOldNotifications(user.getId(), daysOld));
    }

}
