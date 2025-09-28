package com.leroy.inventorymanagementspringboot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for push subscription responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PushSubscriptionResponse {

    private boolean success;
    private String message;
    private Long subscriptionId;

    public static PushSubscriptionResponse success(Long subscriptionId) {
        return new PushSubscriptionResponse(true, "Push subscription created successfully", subscriptionId);
    }

    public static PushSubscriptionResponse success(String message) {
        return new PushSubscriptionResponse(true, message, null);
    }

    public static PushSubscriptionResponse failure(String message) {
        return new PushSubscriptionResponse(false, message, null);
    }
}
