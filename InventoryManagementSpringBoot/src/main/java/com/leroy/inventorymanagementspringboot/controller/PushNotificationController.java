package com.leroy.inventorymanagementspringboot.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leroy.inventorymanagementspringboot.dto.request.PushSubscriptionRequest;
import com.leroy.inventorymanagementspringboot.dto.response.PushSubscriptionResponse;
import com.leroy.inventorymanagementspringboot.entity.PushSubscription;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.repository.PushSubscriptionRepository;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.service.PushNotificationService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for managing push notification subscriptions.
 * Handles subscription creation, testing, and management.
 */
@RestController
@RequestMapping("/api/notifications")
@AllArgsConstructor
@Slf4j
public class PushNotificationController {

    private final PushNotificationService pushNotificationService;
    private final PushSubscriptionRepository pushSubscriptionRepository;
    private final UserRepository userRepository;

    /**
     * Subscribe a user to push notifications.
     *
     * @param request     The subscription request containing endpoint and keys
     * @param userDetails The authenticated user details
     * @return Response indicating success or failure
     */
    @PostMapping("/subscribe")
    public ResponseEntity<PushSubscriptionResponse> subscribe(
            @Valid @RequestBody PushSubscriptionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Get the authenticated user
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            // Check if subscription already exists for this endpoint
            Optional<PushSubscription> existingSubscription = pushSubscriptionRepository.findByEndpointAndUserId(
                    request.getSubscription().getEndpoint(),
                    user.getId());

            if (existingSubscription.isPresent()) {
                // Update existing subscription
                PushSubscription subscription = existingSubscription.get();
                subscription.setP256dhKey(request.getSubscription().getKeys().getP256dh());
                subscription.setAuthKey(request.getSubscription().getKeys().getAuth());
                subscription.setIsActive(true);

                PushSubscription savedSubscription = pushSubscriptionRepository.save(subscription);
                log.info("Updated push subscription for user: {}", user.getId());

                return ResponseEntity.ok(PushSubscriptionResponse.success(savedSubscription.getId()));
            } else {
                // Create new subscription
                PushSubscription subscription = new PushSubscription(
                        user,
                        request.getSubscription().getEndpoint(),
                        request.getSubscription().getKeys().getP256dh(),
                        request.getSubscription().getKeys().getAuth());

                PushSubscription savedSubscription = pushSubscriptionRepository.save(subscription);
                log.info("Created new push subscription for user: {}", user.getId());

                return ResponseEntity.ok(PushSubscriptionResponse.success(savedSubscription.getId()));
            }
        } catch (Exception e) {
            log.error("Failed to create push subscription", e);
            return ResponseEntity.badRequest()
                    .body(PushSubscriptionResponse.failure("Failed to create push subscription: " + e.getMessage()));
        }
    }

    /**
     * Test push notification for the authenticated user.
     *
     * @param userDetails The authenticated user details
     * @return Response indicating success or failure
     */
    @PostMapping("/test")
    public ResponseEntity<PushSubscriptionResponse> testNotification(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            boolean success = pushNotificationService.testNotification(userDetails);

            if (success) {
                return ResponseEntity.ok(PushSubscriptionResponse.success("Test notification sent successfully"));
            } else {
                return ResponseEntity.badRequest()
                        .body(PushSubscriptionResponse.failure("Failed to send test notification"));
            }
        } catch (Exception e) {
            log.error("Failed to send test notification", e);
            return ResponseEntity.badRequest()
                    .body(PushSubscriptionResponse.failure("Failed to send test notification: " + e.getMessage()));
        }
    }

    /**
     * Get all push subscriptions for the authenticated user.
     *
     * @param userDetails The authenticated user details
     * @return List of user's push subscriptions
     */
    @GetMapping("/subscriptions")
    public ResponseEntity<List<PushSubscription>> getUserSubscriptions(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            List<PushSubscription> subscriptions = pushSubscriptionRepository
                    .findByUserIdAndIsActiveTrue(user.getId().longValue());
            return ResponseEntity.ok(subscriptions);
        } catch (Exception e) {
            log.error("Failed to get user subscriptions", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Unsubscribe from push notifications by subscription ID.
     *
     * @param subscriptionId The subscription ID to remove
     * @param userDetails    The authenticated user details
     * @return Response indicating success or failure
     */
    @DeleteMapping("/subscriptions/{subscriptionId}")
    public ResponseEntity<PushSubscriptionResponse> unsubscribe(
            @PathVariable Long subscriptionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            Optional<PushSubscription> subscription = pushSubscriptionRepository.findById(subscriptionId);

            if (subscription.isPresent()
                    && subscription.get().getUser().getId().longValue() == user.getId().longValue()) {
                subscription.get().setIsActive(false);
                pushSubscriptionRepository.save(subscription.get());
                log.info("Deactivated push subscription {} for user: {}", subscriptionId, user.getId());
                return ResponseEntity.ok(PushSubscriptionResponse.success("Unsubscribed successfully"));
            } else {
                return ResponseEntity.badRequest()
                        .body(PushSubscriptionResponse.failure("Subscription not found or access denied"));
            }
        } catch (Exception e) {
            log.error("Failed to unsubscribe", e);
            return ResponseEntity.badRequest()
                    .body(PushSubscriptionResponse.failure("Failed to unsubscribe: " + e.getMessage()));
        }
    }
}