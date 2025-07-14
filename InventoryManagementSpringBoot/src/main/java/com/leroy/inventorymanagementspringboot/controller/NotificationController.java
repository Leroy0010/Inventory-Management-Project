package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.response.NotificationResponseDto;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.NotificationType;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.service.NotificationService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<NotificationResponseDto>> getUnreadNotifications(@RequestParam int userId) {
        User user = userRepository.getReferenceById(userId);
        return ResponseEntity.ok(notificationService.getUnreadNotifications(user));
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getAllNotifications(@RequestParam int userId) {
        User user = userRepository.getReferenceById(userId);
        return ResponseEntity.ok(notificationService.getAllNotifications(user));
    }

    @PutMapping("/{id}/mark-read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(@RequestParam int userId) {
        User user = userRepository.getReferenceById(userId);
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count/unread")
    public ResponseEntity<Long> getUnreadCount(@RequestParam int userId) {
        User user = userRepository.getReferenceById(userId);
        return ResponseEntity.ok(notificationService.getUnreadCount(user));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<NotificationResponseDto>> getByType(@RequestParam int userId, @RequestParam NotificationType type){
        return ResponseEntity.ok(notificationService.getNotificationsByType(userId, type));
    }

    @DeleteMapping("/delete-all-old")
    public ResponseEntity<Void> deleteAllOldNotifications(@RequestParam int userId, @RequestParam int daysOld) {
        return ResponseEntity.ok(notificationService.deleteOldNotifications(userId, daysOld));
    }

}
