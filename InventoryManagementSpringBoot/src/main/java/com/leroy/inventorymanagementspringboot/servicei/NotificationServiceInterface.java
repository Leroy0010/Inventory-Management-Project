package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.response.NotificationResponseDto;
import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.enums.NotificationType;

import java.sql.Timestamp;
import java.util.List;

public interface NotificationServiceInterface {
    void notify(User user, String title, String message, NotificationType type, Timestamp createdAt);
    void notifyWithRequest(User user, String title, String message, NotificationType type, Request request,  Timestamp createdAt);
    void notifyWithItem(User user, String title, String message, NotificationType type, InventoryItem item,  Timestamp createdAt);

    List<NotificationResponseDto> getUnreadNotifications(User user);

    List<NotificationResponseDto> getAllNotifications(User user);

    void markAsRead(Long id);

    void markAllAsRead(User user);
    void notifyLowStockIfNeeded(InventoryItem item);

    Long getUnreadCount(User user);
    List<NotificationResponseDto> getNotificationsByType(int userId, NotificationType type);
}