package com.leroy.inventorymanagementfx.service.admin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.dto.request.CreateStaffRequest;
import com.leroy.inventorymanagementfx.dto.request.CreateStoreKeeperRequest;
import com.leroy.inventorymanagementfx.dto.request.UpdatePasswordRequest; // New import
import com.leroy.inventorymanagementfx.dto.response.User;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public class UserService {
    private final Logger logger = LogManager.getLogger(UserService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CompletableFuture<HttpResponse<String>> createStoreKeeperOrAdmin(
            String email,
            String firstName,
            String lastName,
            String password,
            String role,
            String department) {

        CreateStoreKeeperRequest request = null;

        if ("STOREKEEPER".equals(role)) {
            request = new CreateStoreKeeperRequest(email, firstName, lastName, password, role, department);
        } else if ("ADMIN".equals(role)) {
            request = new CreateStoreKeeperRequest(email, firstName, lastName, password, role);
        }

        try {
            String json = objectMapper.writeValueAsString(request);
            logger.debug("Payload: {}", json);


            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/admin/register-user"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            logger.info("Creating user with role: {}", role);

            return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString())
                    .thenApply(response -> {
                        System.out.println("Status: " + response.statusCode());
                        System.out.println("Body: " + response.body());
                        if (response.statusCode() == 201) {
                            logger.info("User created successfully: {}", email);
                        } else {
                            logger.error("Failed to create user. Status: {}, Response: {}",
                                    response.statusCode(), response.body());
                        }
                        return response;
                    });
        } catch (JsonProcessingException e) {
            logger.error("Error creating user JSON payload", e);
            return CompletableFuture.failedFuture(e);
        }
    }

    public CompletableFuture<HttpResponse<String>> createStaff(
            String email,
            String firstName,
            String lastName,
            String password,
            String office) {

        CreateStaffRequest request = new CreateStaffRequest(email.trim(), firstName.trim(), lastName.trim(), password.trim(), office);

        try {
            String json = objectMapper.writeValueAsString(request);
            logger.debug("Payload: {}", json);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/storekeeper/register-staff"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            logger.info("Creating staff");

            return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString())
                    .thenApply(response -> {
                        if (response.statusCode() == 201) logger.info("Staff created successfully: {}", email);
                        else {
                            logger.error("Failed to create user. Status: {}, Response: {}",
                                    response.statusCode(), response.body());
                        }
                        return response;
                    });
        } catch (JsonProcessingException e) {
            logger.error("Error creating user JSON payload", e);
            return CompletableFuture.failedFuture(e);
        }
    }

    public CompletableFuture<List<String>> getGeneralNotificationServiceEmails() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/users/get-general-notification-service-emails"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .GET()
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(response -> {
                    if (response.statusCode() == 200) {
                        try {
                            // Use Jackson to unwrap Optional<List<String>>
                            return objectMapper.convertValue(
                                    objectMapper.readTree(response.body()),
                                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class)
                            );

                        } catch (Exception e) {
                            logger.error("Failed to parse response: {}", e.getMessage());
                        }
                    } else {
                        logger.error("Failed to fetch emails. Status: {}, Body: {}", response.statusCode(), response.body());
                    }
                    return Collections.emptyList();
                });
    }


    public CompletableFuture<User> getUserProfile() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/users/get-profile"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .GET()
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(response -> {
                    if (response.statusCode() == 200) {
                        try {
                            // Correct way to deserialize to a User object
                            return objectMapper.readValue(response.body(), User.class);
                        } catch (Exception e) {
                            logger.error("Failed to parse user profile response: {}", e.getMessage(), e);
                            // Return null or throw a specific exception if parsing fails
                            return null;
                        }
                    } else {
                        logger.error("Failed to fetch user profile. Status: {}, Body: {}", response.statusCode(), response.body());
                        return null; // Return null if API call fails
                    }
                })
                .exceptionally(ex -> {
                    logger.error("Network or service error fetching user profile: {}", ex.getMessage(), ex);
                    return null; // Return null on network/service exception
                });
    }

    /**
     * Sends a request to the backend to change the user's password.
     * @param request The UpdatePasswordRequest DTO containing old and new passwords.
     * @return A CompletableFuture representing the HTTP response.
     */
    public CompletableFuture<HttpResponse<String>> changePassword(UpdatePasswordRequest request) {
        try {
            String json = objectMapper.writeValueAsString(request);
            logger.debug("Change Password Payload: {}", json);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/users/change-password"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            logger.info("Sending password change request.");

            return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());
        } catch (JsonProcessingException e) {
            logger.error("Error creating change password JSON payload", e);
            return CompletableFuture.failedFuture(e);
        }
    }

    /**
     * Fetches a list of usernames and IDs from the backend.
     * Assumes an endpoint like /api/users/get-all-names-and-ids that returns JSON:
     * [{"id": 1, "email": "userone@gmail.com"}, {"id": 2, "email": "usertwo@gmail.com"}]
     * @return A CompletableFuture containing the HTTP response string.
     */
    public CompletableFuture<HttpResponse<String>> getUsersEmailsAndIds() {
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/users/get-all-emails-and-ids"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .GET()
                .build();

        return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());
    }
}
