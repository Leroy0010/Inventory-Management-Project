package com.leroy.inventorymanagementfx.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.dto.request.PasswordChangeRequest;
import com.leroy.inventorymanagementfx.dto.request.PasswordResetRequest;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

public class PasswordResetService {

    private static final Logger LOGGER = LogManager.getLogger(PasswordResetService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Sends a request to the backend to initiate the password reset process.
     * This will typically send an email with a reset link.
     * @param email The email of the user requesting a password reset.
     * @return A CompletableFuture with the HttpResponse<String> from the backend.
     */
    public CompletableFuture<HttpResponse<String>> forgotPassword(String email) {
        try {
            PasswordResetRequest requestDto = new PasswordResetRequest(email);
            String json = objectMapper.writeValueAsString(requestDto);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/forgot-password")) // Backend endpoint
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            LOGGER.info("Sending forgot password request for email: {}", email);

            return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            LOGGER.error("Failed to prepare forgot password request: {}", e.getMessage(), e);
            return CompletableFuture.failedFuture(e);
        }
    }

    /**
     * Sends a request to the backend to change the password using a reset token.
     * @param token The password reset token received via email.
     * @param newPassword The new password for the user.
     * @return A CompletableFuture with the HttpResponse<String> from the backend.
     */
    public CompletableFuture<HttpResponse<String>> resetPassword(String token, String newPassword) {
        try {
            PasswordChangeRequest requestDto = new PasswordChangeRequest(token, newPassword);
            String json = objectMapper.writeValueAsString(requestDto);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/reset-password")) // Backend endpoint
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            LOGGER.info("Sending reset password request with token...");

            return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            LOGGER.error("Failed to prepare reset password request: {}", e.getMessage(), e);
            return CompletableFuture.failedFuture(e);
        }
    }
}