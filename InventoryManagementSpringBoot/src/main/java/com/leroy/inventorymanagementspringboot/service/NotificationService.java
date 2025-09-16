package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.dto.request.GeneralNotificationRequest;
import com.leroy.inventorymanagementspringboot.dto.response.NotificationResponseDto;
import com.leroy.inventorymanagementspringboot.dto.websocket.WebSocketNotificationDto;
import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.enums.NotificationType;
import com.leroy.inventorymanagementspringboot.mapper.NotificationMapper;
import com.leroy.inventorymanagementspringboot.repository.InventoryBatchRepository;
import com.leroy.inventorymanagementspringboot.repository.NotificationRepository;
import com.leroy.inventorymanagementspringboot.repository.RoleRepository;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.servicei.NotificationServiceInterface;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class NotificationService implements NotificationServiceInterface {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final SimpMessagingTemplate messagingTemplate;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    

    private void broadcast(Notification notification) {
        WebSocketNotificationDto socketDto = new WebSocketNotificationDto(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.isRead(),
                notification.getType(),
                notification.getRequest() != null ? notification.getRequest().getId() : null,
                notification.getInventoryItem() != null ? notification.getInventoryItem().getId() : null,
                notification.getCreatedAt()
        );

        messagingTemplate.convertAndSend("/topic/notifications/user-" + notification.getUser().getId(), socketDto);
    }

    @Override
    public void notify(User user, String title, String message, NotificationType type, Timestamp createdAt) {
        Notification notification = new Notification(user, title, message, type, createdAt);
        notificationRepository.save(notification);
        broadcast(notification);
    }

    @Override
    public void notifyWithRequest(User user, String title, String message, NotificationType type, Request request, Timestamp createdAt) {
        Notification notification = new Notification(user, title, message, type, request, createdAt);
        notificationRepository.save(notification);
        broadcast(notification);
    }

    @Override
    public void notifyWithItem(User user, String title, String message, NotificationType type, InventoryItem item, Timestamp createdAt) {
        Notification notification = new Notification(user, title, message, type, item, createdAt);
        notificationRepository.save(notification);
        broadcast(notification);
    }

    @Override
    public List<NotificationResponseDto> getUnreadNotifications(User user) {
        if(user == null)
            throw new IllegalArgumentException("User can't be null");
        return notificationRepository
                .findByUserAndReadIsFalse(user)
                .stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationResponseDto> getAllNotifications(User user) {
        if(user == null)
            throw new IllegalArgumentException("User can't be null");
        return notificationRepository
                .findByUser(user)
                .stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });

    }

    @Override
    public void markAllAsRead(User user) {
        if (user == null)
            throw new IllegalArgumentException("User can't be null");

        List<Notification> notifications = notificationRepository.findByUser(user);
        notifications.forEach(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    @Override
    public Long getUnreadCount(User user) {
        if(user == null)
            throw new IllegalArgumentException("User can't be null");
        return notificationRepository.countNotificationsByUserAndIsReadIsFalse(user);
    }

    @Override
    // Filtering by type
    public List<NotificationResponseDto> getNotificationsByType(int userId, NotificationType type) {
        return notificationRepository.findByUser_IdAndType(userId, type)
                .stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }

    // Cleanup (optional)
    public Void deleteOldNotifications(int userId, int daysOld) {
        Timestamp cutoff = new Timestamp(System.currentTimeMillis() - (long) daysOld * 24 * 60 * 60 * 1000);
        notificationRepository.deleteAllByUser_IdAndCreatedAtBefore(userId, cutoff);
        return null;
    }

    @Scheduled(cron = "0 0 3 * * ?") // Every day at 3 AM
    public void autoDeleteOldNotifications() {
        Timestamp cutoff = new Timestamp(System.currentTimeMillis() - (60L * 24 * 60 * 60 * 1000)); // 60 days ago
        notificationRepository.deleteAllByCreatedAtBefore(cutoff);
    }

    @Override
    public void notifyLowStockIfNeeded(InventoryItem item) {
        User storekeeper = userRepository
                .findByDepartmentAndRole(
                        item.getDepartment(),
                        roleRepository.findByName("STOREKEEPER").orElseThrow()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        int availableQty = inventoryBatchRepository.sumRemainingQuantityByItem(item);
        Timestamp now = new Timestamp(System.currentTimeMillis());
        Timestamp yesterday = new Timestamp(now.getTime() - 24 * 60 * 60 * 1000);

        boolean alreadyNotified = !notificationRepository
                .findRecentByUserAndItemAndType(storekeeper, item, NotificationType.LOW_STOCK, yesterday)
                .isEmpty();

        if (!alreadyNotified && availableQty <= item.getReorderLevel()) {
            notifyWithItem(
                    storekeeper,
                    "Low Stock Alert",
                    "Stock for item " + item.getName() + " is low (" + availableQty + " " + item.getUnit() + " left)",
                    NotificationType.LOW_STOCK,
                    item,
                    now
            );
        }
    }

    public List<String> getAvailableUsers(UserDetails userDetails) {
        User sender = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        List<User> availableUsers;

        if ("ADMIN".equals(sender.getRole().getName())) {
            // Admin can see all users except themselves
            availableUsers = userRepository.findAllByIdNot(sender.getId()).orElse(List.of());
        } else if ("STOREKEEPER".equals(sender.getRole().getName())) {
            // Storekeeper can only see users from their department
            if (sender.getDepartment() != null) {
                availableUsers = userRepository.findAllByOffice_DepartmentAndIdNot(
                        sender.getDepartment(),
                        sender.getId()
                ).orElse(List.of());
            } else {
                availableUsers = List.of();
            }
        } else {
            availableUsers = List.of();
        }

        return availableUsers
                .stream()
                .map(User::getEmail)
                .collect(Collectors.toList());
    }

    public List<User> sendGeneralNotification(UserDetails userDetails, GeneralNotificationRequest request) {
        User sender = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        List<User> recipients = getRecipients(request, sender);
        Timestamp now = new Timestamp(System.currentTimeMillis());

        // Send notification to each recipient
        for (User recipient : recipients) {
            notify(
                    recipient,
                    request.getSubject(),
                    request.getMessage(),
                    NotificationType.GENERAL,
                    now
            );

            emailService.sendGeneralNotificationEmail(
                    recipient.getEmail(),
                    request.getSubject(),
                    request.getMessage(),
                    recipient.getFirstName()
            );
        }

        return recipients;
    }

    private List<User> getRecipients(GeneralNotificationRequest request, User sender) {
        return switch (request.getRecipientType()) {
            case "ALL_USERS" -> {
                // Admin can send to all users except themselves
                if ("ADMIN".equals(sender.getRole().getName())) {
                    yield userRepository.findAllByIdNot(sender.getId()).orElse(List.of());
                }
                yield List.of();
            }
            case "DEPARTMENT_USERS" -> {
                // Both Admin and Storekeeper can send to department users
                if (sender.getOffice() != null && sender.getOffice().getDepartment() != null) {
                    yield userRepository.findAllByOffice_DepartmentAndIdNot(
                            sender.getOffice().getDepartment(),
                            sender.getId()
                    ).orElse(List.of());
                }
                yield List.of();
            }
            case "SPECIFIC_USERS" -> {
                if (request.getUserEmails() != null && !request.getUserEmails().isEmpty()) {
                    List<User> selectedUsers = userRepository.findAllByEmailIn(request.getUserEmails());

                    // For Storekeeper: filter to only include users from their department
                    if ("STOREKEEPER".equals(sender.getRole().getName())) {
                        if (sender.getOffice() != null && sender.getOffice().getDepartment() != null) {
                            yield selectedUsers.stream()
                                    .filter(user -> user.getOffice() != null &&
                                            sender.getOffice().getDepartment().equals(user.getOffice().getDepartment()))
                                    .toList();
                        }
                        yield List.of();
                    }

                    // For Admin: can send to any selected users
                    yield selectedUsers;
                }
                yield List.of();
            }
            default -> List.of();
        };
    }
}
