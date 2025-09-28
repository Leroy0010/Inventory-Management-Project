package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for push subscription requests from the frontend.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PushSubscriptionRequest {

    @NotNull(message = "Subscription data is required")
    private SubscriptionData subscription;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubscriptionData {
        @NotBlank(message = "Endpoint is required")
        private String endpoint;

        @NotNull(message = "Keys are required")
        private Keys keys;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Keys {
            @NotBlank(message = "P256DH key is required")
            private String p256dh;

            @NotBlank(message = "Auth key is required")
            private String auth;
        }
    }
}
