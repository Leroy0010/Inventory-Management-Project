package com.leroy.inventorymanagementfx.dto.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.leroy.inventorymanagementfx.enums.NotificationType;

import java.sql.Timestamp;

public class NotificationResponseDto {
    private long id;
    private String title;
    private String message;
    private boolean isRead;
    private NotificationType type;
    private Long requestId;
    private Integer itemId;
    private Timestamp createdAt;

    @JsonCreator
    public NotificationResponseDto(
            @JsonProperty("id") long id,
            @JsonProperty("title") String title,
            @JsonProperty("message") String message,
            @JsonProperty("isRead") boolean isRead,
            @JsonProperty("type") NotificationType type,
            @JsonProperty("requestId") Long requestId,
            @JsonProperty("itemId") Integer itemId,
            @JsonProperty("createdAt") Timestamp createdAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.isRead = isRead;
        this.type = type;
        this.requestId = requestId;
        this.itemId = itemId;
        this.createdAt = createdAt;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
