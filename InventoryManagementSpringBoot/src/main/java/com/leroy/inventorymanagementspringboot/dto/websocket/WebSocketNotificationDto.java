package com.leroy.inventorymanagementspringboot.dto.websocket;

import com.leroy.inventorymanagementspringboot.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class WebSocketNotificationDto {
    private Long id;
    private String title;
    private String message;
    private boolean isRead;
    private NotificationType type;
    private Integer requestId;
    private Integer itemId;
    private LocalDateTime createdAt;
}