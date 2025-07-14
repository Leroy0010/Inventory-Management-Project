package com.leroy.inventorymanagementfx.service.admin;

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

public class DepartmentService {
    private final Logger logger = LogManager.getLogger(DepartmentService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CompletableFuture<HttpResponse<String>> addDepartment(String name) {
        try {
            String json = objectMapper.writeValueAsString(Map.of("name", name.trim()));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/departments"))  // Note plural
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            logger.info("Sending create department request. Name: {}", name);

            return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenApply(response -> {
                        if (response.statusCode() == 201) {
                            logger.info("Department created successfully: {}", name);
                        } else if (response.statusCode() == 409) {
                            logger.warn("Department already exists: {}", name);
                        } else {
                            logger.error("Failed to create department. Status: {}, Response: {}",
                                    response.statusCode(), response.body());
                        }
                        return response;
                    });
        } catch (JsonProcessingException e) {
            logger.error("Error creating department JSON payload", e);
            return CompletableFuture.failedFuture(e);
        }
    }

    public CompletableFuture<HttpResponse<String>> getAllDepartmentsNames() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/departments/names"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .GET()
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString());
    }

    public CompletableFuture<HttpResponse<String>> getAllDepartments() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/departments"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .GET()
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString());
    }

    public CompletableFuture<HttpResponse<String>> getUserDepartment() {
        try {
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/departments/current-user"))
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .GET()
                    .build();

            logger.info("Fetching user department");

            return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString())
                    .thenApply(response -> {
                        if (response.statusCode() == 200) {
                            logger.info("Successfully fetched user department");
                        } else {
                            logger.error("Failed to fetch department. Status: {}", response.statusCode());
                        }
                        return response;
                    });
        } catch (Exception e) {
            logger.error("Error creating department request", e);
            return CompletableFuture.failedFuture(e);
        }
    }
}