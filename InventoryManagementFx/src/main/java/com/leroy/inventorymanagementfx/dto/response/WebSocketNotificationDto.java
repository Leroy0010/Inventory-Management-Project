package com.leroy.inventorymanagementfx.dto.response;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.leroy.inventorymanagementfx.enums.NotificationType;

import java.sql.Timestamp; // Or java.time.Instant, or java.util.Date depending on your preference for client-side date handling

@JsonIgnoreProperties(ignoreUnknown = true) // Ignore any fields from backend not in this DTO
public class WebSocketNotificationDto {
    private long id;
    private String title;
    private String message;
    private boolean read; // Using 'read' to avoid clash with 'isRead' getter/setter convention
    private NotificationType type;
    private Long requestId;
    private Integer itemId; // Changed to Long based on your backend InventoryItem id type
    private Timestamp createdAt;

    // Default constructor for Jackson deserialization
    public WebSocketNotificationDto() {}

    // Getters and Setters (Important for Jackson)
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    // Use @JsonProperty to map 'isRead' from backend to 'read' field
    @JsonProperty("read") // Assuming the JSON from backend has a field named "read" or "isRead"
    public boolean isRead() { return read; }
    @JsonProperty("read")
    public void setRead(boolean read) { this.read = read; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public Integer getItemId() { return itemId; }
    public void setItemId(Integer itemId) { this.itemId = itemId; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "WebSocketNotificationDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", message='" + message + '\'' +
                ", read=" + read +
                ", type=" + type +
                ", requestId=" + requestId +
                ", itemId=" + itemId +
                ", createdAt=" + createdAt +
                '}';
    }
}
