package com.leroy.inventorymanagementfx.dto.response;

import java.sql.Timestamp;
import java.util.List;

public class RequestResponseDto {
    private long id;
    private int user_id;
    private List<RequestItemResponseDto> items;
    private String status;
    private Timestamp submittedAt;
    private Timestamp approvedAt;
    private User approver; // This maps to backend's UserResponseDto

    // NEW: Fields for fulfillment and history
    private Timestamp fulfilledAt;
    private User fulfiller; // This maps to backend's UserResponseDto
    private List<RequestStatusHistoryDto> statusHistory;

    // Getters and Setters for existing fields
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public List<RequestItemResponseDto> getItems() {
        return items;
    }

    public void setItems(List<RequestItemResponseDto> items) {
        this.items = items;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Timestamp submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Timestamp getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(Timestamp approvedAt) {
        this.approvedAt = approvedAt;
    }

    public User getApprover() {
        return approver;
    }

    public void setApprover(User approver) {
        this.approver = approver;
    }

    // NEW: Getters and Setters for new fields
    public Timestamp getFulfilledAt() {
        return fulfilledAt;
    }

    public void setFulfilledAt(Timestamp fulfilledAt) {
        this.fulfilledAt = fulfilledAt;
    }

    public User getFulfiller() {
        return fulfiller;
    }

    public void setFulfiller(User fulfiller) {
        this.fulfiller = fulfiller;
    }

    public List<RequestStatusHistoryDto> getStatusHistory() {
        return statusHistory;
    }

    public void setStatusHistory(List<RequestStatusHistoryDto> statusHistory) {
        this.statusHistory = statusHistory;
    }
}