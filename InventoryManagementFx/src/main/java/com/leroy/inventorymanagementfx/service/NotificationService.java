package com.leroy.inventorymanagementfx.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.dto.response.NotificationResponseDto;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class NotificationService {
    private static final Logger logger = LogManager.getLogger(NotificationService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Existing: Fetches ONLY unread notifications (used for initial topbar count perhaps, or a quick refresh of unread)
    public CompletableFuture<List<NotificationResponseDto>> fetchUnreadNotifications(int userId) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/notifications/unread?userId=" + userId))
                .GET()
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(response -> {
                    if (response.statusCode() == 200) {
                        try {
                            return objectMapper.readValue(response.body(), new TypeReference<>() {
                            });
                        } catch (Exception e) {
                            logger.error("Error parsing unread notifications: {}", e.getMessage(), e);
                            return List.of(); // Return empty list on parse error
                        }
                    } else {
                        logger.error("Failed to fetch unread notifications. Status: {}, Body: {}", response.statusCode(), response.body());
                        return List.of(); // Return empty list on HTTP error
                    }
                });
    }

    // NEW: Fetches ALL notifications (read and unread) for the display page
    public CompletableFuture<List<NotificationResponseDto>> fetchAllNotificationsForUser(int userId) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/notifications?userId=" + userId)) // Calls the new backend endpoint
                .GET()
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(response -> {
                    if (response.statusCode() == 200) {
                        try {
                            return objectMapper.readValue(response.body(), new TypeReference<List<NotificationResponseDto>>() {});
                        } catch (Exception e) {
                            logger.error("Error parsing all notifications: {}", e.getMessage(), e);
                            return List.of();
                        }
                    } else {
                        logger.error("Failed to fetch all notifications. Status: {}, Body: {}", response.statusCode(), response.body());
                        return List.of();
                    }
                });
    }

    public CompletableFuture<Boolean> markAllAsRead(int userId) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/notifications/mark-all-read?userId=" + userId))
                .PUT(HttpRequest.BodyPublishers.noBody())
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.discarding())
                .thenApply(response -> {
                    if (response.statusCode() == 200) {
                        return true;
                    } else {
                        logger.error("Failed to mark all notifications as read. Status: {}", response.statusCode());
                        return false;
                    }
                });
    }

    // You might also want a mark single as read method here for backend consistency
    public CompletableFuture<Boolean> markNotificationAsRead(long notificationId) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/notifications/" + notificationId + "/mark-read"))
                .PUT(HttpRequest.BodyPublishers.noBody())
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.discarding())
                .thenApply(response -> {
                    if (response.statusCode() == 200) {
                        return true;
                    } else {
                        logger.error("Failed to mark notification {} as read. Status: {}", notificationId, response.statusCode());
                        return false;
                    }
                });
    }
}

