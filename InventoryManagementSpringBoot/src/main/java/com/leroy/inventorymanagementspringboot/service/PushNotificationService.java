package com.leroy.inventorymanagementspringboot.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementspringboot.entity.PushSubscription;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.repository.PushSubscriptionRepository;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;

/**
 * Service for managing push notifications.
 * Handles sending push notifications to users' browsers.
 */
@Service
@AllArgsConstructor
@Slf4j
public class PushNotificationService {

    private final PushService pushService;
    private final ObjectMapper objectMapper;
    private final PushSubscriptionRepository pushSubscriptionRepository;
    private final UserRepository userRepository;

    /**
     * Send a push notification to a specific subscription.
     *
     * @param subscription The push subscription to send to
     * @param title        The notification title
     * @param message      The notification message
     * @return true if notification was sent successfully, false otherwise
     */
    public boolean sendNotification(PushSubscription subscription, String title, String message) {
        try {
            log.info("Sending push notification to subscription: {} for user: {}",
                    subscription.getId(), subscription.getUser().getId());

            // Convert our entity to web-push library's Subscription
            Subscription webPushSubscription = new Subscription(
                    subscription.getEndpoint(),
                    new Subscription.Keys(subscription.getP256dhKey(), subscription.getAuthKey()));

            // Create a more detailed payload with notification type and data
            Map<String, Object> payloadData = Map.of(
                    "title", title,
                    "message", message,
                    "url", "/notifications",
                    "icon", "/push-notification.png",
                    "type", "general", // Default type
                    "timestamp", System.currentTimeMillis());

            String payload = objectMapper.writeValueAsString(payloadData);

            log.info("Created payload: {}", payload);
            Notification notification = new Notification(webPushSubscription, payload);

            log.info("Sending notification via push service...");
            pushService.send(notification);
            log.info("Push notification sent successfully to user: {}", subscription.getUser().getId());
            return true;
        } catch (Exception e) {
            log.error("Failed to send push notification to user: {} - Error: {}",
                    subscription.getUser().getId(), e.getMessage(), e);
            return false;
        }
    }

    /**
     * Send a push notification to all active subscriptions of a user.
     *
     * @param userId  The user ID to send notification to
     * @param title   The notification title
     * @param message The notification message
     * @return true if notification was sent successfully, false otherwise
     */
    public boolean sendNotificationToUser(Long userId, String title, String message) {
        List<PushSubscription> subscriptions = pushSubscriptionRepository.findByUserIdAndIsActiveTrue(userId);

        if (subscriptions.isEmpty()) {
            log.warn("No active push subscriptions found for user: {}", userId);
            return false;
        }

        boolean allSuccessful = true;
        for (PushSubscription subscription : subscriptions) {
            boolean success = sendNotification(subscription, title, message);
            if (!success) {
                allSuccessful = false;
            }
        }
        return allSuccessful;
    }

    /**
     * Send a push notification to a specific user entity.
     *
     * @param user    The user to send notification to
     * @param title   The notification title
     * @param message The notification message
     * @return true if notification was sent successfully, false otherwise
     */
    public boolean sendNotificationToUser(User user, String title, String message) {
        return sendNotificationToUser(user.getId().longValue(), title, message);
    }

    /**
     * Send a push notification to all active subscriptions.
     *
     * @param title   The notification title
     * @param message The notification message
     */
    public void sendNotificationToAll(String title, String message) {
        List<PushSubscription> subscriptions = pushSubscriptionRepository.findByIsActiveTrue();

        for (PushSubscription subscription : subscriptions) {
            sendNotification(subscription, title, message);
        }
    }

    /**
     * Test push notification functionality.
     *
     * @param userId The user ID to test with
     * @return true if notification was sent successfully
     */
    public boolean testNotification(Long userId) {
        try {
            return sendNotificationToUser(userId, "Test Notification",
                    "This is a test notification from the inventory management system");
        } catch (Exception e) {
            log.error("Failed to send test notification to user: {}", userId, e);
            return false;
        }
    }

    /**
     * Send a push notification with specific type and data.
     *
     * @param subscription The push subscription to send to
     * @param title        The notification title
     * @param message      The notification message
     * @param type         The notification type (e.g., 'request', 'inventory',
     *                     'cart')
     * @param data         Additional data for the notification
     * @return true if notification was sent successfully, false otherwise
     */
    public boolean sendNotification(PushSubscription subscription, String title, String message, String type,
            Map<String, Object> data) {
        try {
            log.info("Sending push notification to subscription: {} for user: {} with type: {}",
                    subscription.getId(), subscription.getUser().getId(), type);

            // Convert our entity to web-push library's Subscription
            Subscription webPushSubscription = new Subscription(
                    subscription.getEndpoint(),
                    new Subscription.Keys(subscription.getP256dhKey(), subscription.getAuthKey()));

            // Create a more detailed payload with notification type and data
            Map<String, Object> payloadData = Map.of(
                    "title", title,
                    "message", message,
                    "url", "/notifications",
                    "icon", "/push-notification.png",
                    "type", type != null ? type : "general",
                    "timestamp", System.currentTimeMillis(),
                    "data", data != null ? data : Map.of());

            String payload = objectMapper.writeValueAsString(payloadData);

            log.info("Created payload: {}", payload);
            Notification notification = new Notification(webPushSubscription, payload);

            log.info("Sending notification via push service...");
            pushService.send(notification);
            log.info("Push notification sent successfully to user: {}", subscription.getUser().getId());
            return true;
        } catch (Exception e) {
            log.error("Failed to send push notification to user: {} - Error: {}",
                    subscription.getUser().getId(), e.getMessage(), e);
            return false;
        }
    }

    /**
     * Test push notification functionality using UserDetails.
     *
     * @param userDetails The authenticated user details
     * @return true if notification was sent successfully
     */
    public boolean testNotification(UserDetails userDetails) {
        try {
            log.info("Starting test notification for user: {}", userDetails.getUsername());
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            log.info("Found user: {} with ID: {}", user.getEmail(), user.getId());
            boolean result = testNotification(user.getId().longValue());
            log.info("Test notification result for user {}: {}", user.getEmail(), result);
            return result;
        } catch (Exception e) {
            log.error("Failed to send test notification to user: {}", userDetails.getUsername(), e);
            return false;
        }
    }
}
