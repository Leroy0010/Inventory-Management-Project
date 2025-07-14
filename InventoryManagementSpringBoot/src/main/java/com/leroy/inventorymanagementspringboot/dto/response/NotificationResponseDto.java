package com.leroy.inventorymanagementspringboot.dto.response;

import com.leroy.inventorymanagementspringboot.enums.NotificationType;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter @Setter
public class NotificationResponseDto {
    private long id;
    private String title;
    private String message;
    private boolean isRead;
    private NotificationType type;
    private Long requestId;
    private Integer itemId;
    private Timestamp createdAt;
}
