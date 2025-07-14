package com.leroy.inventorymanagementspringboot.dto.websocket;

import com.leroy.inventorymanagementspringboot.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class WebSocketNotificationDto {
    private long id;
    private String title;
    private String message;
    private boolean isRead;
    private NotificationType type;
    private Long requestId;
    private Integer itemId;
    private Timestamp createdAt;
}