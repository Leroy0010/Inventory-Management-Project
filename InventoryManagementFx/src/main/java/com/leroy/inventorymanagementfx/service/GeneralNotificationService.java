package com.leroy.inventorymanagementfx.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.dto.request.GeneralNotificationRequest;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

public class GeneralNotificationService {
    private static final Logger LOGGER = LogManager.getLogger(GeneralNotificationService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CompletableFuture<HttpResponse<String>> sendNotification(GeneralNotificationRequest requestDto) {
        try {
            String json = objectMapper.writeValueAsString(requestDto);
            String jwtToken = AuthTokenHolder.getJwtToken();

            if (jwtToken == null) {
                LOGGER.error("JWT token is missing. Cannot send general notification.");
                return CompletableFuture.failedFuture(new IllegalStateException("Authentication required."));
            }

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/general-notifications/send"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + jwtToken)
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            LOGGER.info("Sending general notification request with subject: {}", requestDto.getSubject());

            return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            LOGGER.error("Failed to prepare general notification request: {}", e.getMessage(), e);
            return CompletableFuture.failedFuture(e);
        }
    }

    // Helper method to parse error messages from response body (re-added for convenience)
    public String parseErrorMessage(HttpResponse<String> response) {
        try {
            JsonNode root = objectMapper.readTree(response.body());
            // Prioritize "message" or "error_description" as per your requirement
            if (root.has("message")) {
                return root.path("message").asText("An unknown error occurred.");
            } else if (root.has("error_description")) {
                return root.path("error_description").asText("An unknown error occurred.");
            }
            return "An unknown error occurred.";
        } catch (Exception e) {
            LOGGER.error("Error parsing error response: {}", e.getMessage());
            return "Failed to parse error message from server response.";
        }
    }
}