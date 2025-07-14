package com.leroy.inventorymanagementfx.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ApproveRequestDto {
    @JsonProperty("id")
    private long id;
    @JsonProperty("requestStatus")
    private String requestStatus; // e.g., "APPROVED", "REJECTED"
    @JsonProperty("approve")
    private boolean approve; // true for approve, false for reject

    public ApproveRequestDto(long id, String requestStatus, boolean approve) {
        this.id = id;
        this.requestStatus = requestStatus;
        this.approve = approve;
    }

    // Getters and Setters for ObjectMapper
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(String requestStatus) {
        this.requestStatus = requestStatus;
    }

    public boolean isApprove() {
        return approve;
    }

    public void setApprove(boolean approve) {
        this.approve = approve;
    }
}