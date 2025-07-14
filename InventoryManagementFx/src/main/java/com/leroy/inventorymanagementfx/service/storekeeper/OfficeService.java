package com.leroy.inventorymanagementfx.service.storekeeper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public class OfficeService {
    private final Logger logger = LogManager.getLogger(OfficeService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CompletableFuture<HttpResponse<String>> addOffice(String name) {
        try {
            String json = objectMapper.writeValueAsString(Map.of("name", name.trim()));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/offices"))  // Note plural
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            logger.info("Sending create office request. Name: {}", name);

            return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenApply(response -> {
                        if (response.statusCode() == 201) {
                            logger.info("Office created successfully: {}", name);
                        } else if (response.statusCode() == 409) {
                            logger.warn("Office already exists: {}", name);
                        } else {
                            logger.error("Failed to create office. Status: {}, Response: {}",
                                    response.statusCode(), response.body());
                        }
                        return response;
                    });
        } catch (JsonProcessingException e) {
            logger.error("Error creating office JSON payload", e);
            return CompletableFuture.failedFuture(e);
        }
    }

    public CompletableFuture<HttpResponse<String>> getAllOfficesNames() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/offices/names"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .GET()
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString());
    }

    public CompletableFuture<HttpResponse<String>> getAllOffices() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/offices"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .GET()
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString());
    }
}