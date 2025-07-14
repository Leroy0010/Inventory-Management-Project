package com.leroy.inventorymanagementfx.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RequestFulfillmentDto {
    @JsonProperty("requestId")
    private long requestId;
    @JsonProperty("requestStatus")
    private String requestStatus; // e.g., "FULFILLED"
    @JsonProperty("fulfilled")
    private boolean fulfilled; // true for fulfilled

    public RequestFulfillmentDto(long requestId, String requestStatus, boolean fulfilled) {
        this.requestId = requestId;
        this.requestStatus = requestStatus;
        this.fulfilled = fulfilled;
    }

    // Getters and Setters for ObjectMapper
    public long getRequestId() {
        return requestId;
    }

    public void setRequestId(long requestId) {
        this.requestId = requestId;
    }

    public String getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(String requestStatus) {
        this.requestStatus = requestStatus;
    }

    public boolean isFulfilled() {
        return fulfilled;
    }

    public void setFulfilled(boolean fulfilled) {
        this.fulfilled = fulfilled;
    }
}