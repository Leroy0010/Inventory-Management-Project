package com.leroy.inventorymanagementfx.dto.response;

import java.sql.Timestamp;

public class RequestStatusHistoryDto {
    private Long id;
    private String statusName; // Name of the status (e.g., "PENDING", "APPROVED")
    private User changedBy; // User who changed the status
    private Timestamp timestamp; // When the status change occurred

    // Getters and Setters (add these manually as Lombok isn't assumed in frontend)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    public User getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(User changedBy) {
        this.changedBy = changedBy;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}