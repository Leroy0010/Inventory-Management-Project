package com.leroy.inventorymanagementfx.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode; // Import JsonNode for error parsing
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.dto.request.ApproveRequestDto;
import com.leroy.inventorymanagementfx.dto.request.RequestFulfillmentDto;
import com.leroy.inventorymanagementfx.dto.response.RequestResponseDto;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class RequestService {
    private static final Logger logger = LogManager.getLogger(RequestService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Existing getUserRequests method (no changes needed)
    public CompletableFuture<List<RequestResponseDto>> getUserRequests() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/requests"))
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
                            logger.error("Error parsing user requests: {}", e.getMessage(), e);
                        }
                    } else {
                        try {
                            JsonNode rootNode = objectMapper.readTree(response.body());
                            String errorMessage = rootNode.has("message") ? rootNode.get("message").asText() : "Unknown error";
                            logger.error("Failed to fetch user requests. Status: {}, Body: {}", response.statusCode(), errorMessage);
                        } catch (JsonProcessingException e) {
                            logger.error("Error parsing error response for user requests: {}", e.getMessage(), e);
                        }
                    }
                    return List.of();
                });
    }

    // Existing getRequestById method (no changes needed)
    public CompletableFuture<RequestResponseDto> getRequestById(Long id) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/requests/" + id))
                .GET()
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(response -> {
                    if (response.statusCode() == 200) {
                        try {
                            return objectMapper.readValue(response.body(), RequestResponseDto.class);
                        } catch (Exception e) {
                            logger.error("Error parsing single request: {}", e.getMessage(), e);
                        }
                    } else {
                        logger.error("Failed to fetch request {}. Status: {}, Body: {}", id, response.statusCode(), response.body());
                    }
                    return null;
                });
    }

    // Existing: Method to approve or reject a request
    public CompletableFuture<RequestResponseDto> approveOrRejectRequest(ApproveRequestDto approveDto) {
        try {
            String requestBody = objectMapper.writeValueAsString(approveDto);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/requests/approve"))
                    .PUT(HttpRequest.BodyPublishers.ofString(requestBody))
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .header("Content-Type", "application/json")
                    .build();

            return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenApply(response -> {
                        if (response.statusCode() == 200 || response.statusCode() == 202) {
                            try {
                                return objectMapper.readValue(response.body(), RequestResponseDto.class);
                            } catch (Exception e) {
                                logger.error("Error parsing approve/reject response: {}", e.getMessage(), e);
                                return null; // Return null on parsing error
                            }
                        } else {
                            String errorMessage = "Failed to approve/reject request.";
                            try {
                                JsonNode rootNode = objectMapper.readTree(response.body());
                                errorMessage = rootNode.has("message") ? rootNode.get("message").asText() : errorMessage;
                                errorMessage = rootNode.has("error_description") ? rootNode.get("error_description").asText() : errorMessage;
                            } catch (JsonProcessingException ex) {
                                logger.error("Error parsing error response for approve/reject: {}", ex.getMessage(), ex);
                            }
                            logger.error("Failed to approve/reject request {}. Status: {}, Body: {}", approveDto.getId(), response.statusCode(), response.body());
                            throw new RuntimeException(errorMessage); // Throw exception with meaningful message
                        }
                    });
        } catch (JsonProcessingException e) {
            logger.error("Error creating JSON for approve/reject request: {}", e.getMessage(), e);
            return CompletableFuture.failedFuture(new RuntimeException("Error preparing request body for approve/reject."));
        }
    }

    // Existing: Method to fulfill a request
    public CompletableFuture<RequestResponseDto> fulfillRequest(RequestFulfillmentDto fulfillDto) {
        try {
            String requestBody = objectMapper.writeValueAsString(fulfillDto);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/requests/fulfil"))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .header("Content-Type", "application/json")
                    .build();

            return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenApply(response -> {
                        if (response.statusCode() == 200 || response.statusCode() == 201) {
                            try {
                                return objectMapper.readValue(response.body(), RequestResponseDto.class);
                            } catch (Exception e) {
                                logger.error("Error parsing fulfill response: {}", e.getMessage(), e);
                                return null; // Return null on parsing error
                            }
                        } else {
                            String errorMessage = "Failed to fulfill request.";
                            try {
                                JsonNode rootNode = objectMapper.readTree(response.body());
                                errorMessage = rootNode.has("message") ? rootNode.get("message").asText() : errorMessage;
                                errorMessage = rootNode.has("error_description") ? rootNode.get("error_description").asText() : errorMessage;
                            } catch (JsonProcessingException ex) {
                                logger.error("Error parsing error response for fulfill: {}", ex.getMessage(), ex);
                            }
                            logger.error("Failed to fulfill request {}. Status: {}, Body: {}", fulfillDto.getRequestId(), response.statusCode(), response.body());
                            throw new RuntimeException(errorMessage); // Throw exception with meaningful message
                        }
                    });
        } catch (JsonProcessingException e) {
            logger.error("Error creating JSON for fulfill request: {}", e.getMessage(), e);
            return CompletableFuture.failedFuture(new RuntimeException("Error preparing request body for fulfill."));
        }
    }

    // NEW METHOD: Submits the user's cart as a new request
    public CompletableFuture<RequestResponseDto> submitCartAsRequest() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/requests")) // Backend @PostMapping is at /api/requests
                .POST(HttpRequest.BodyPublishers.noBody()) // Backend receives user from @AuthenticationPrincipal, cart from session
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .header("Content-Type", "application/json") // Good practice, though body is empty
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(response -> {
                    if (response.statusCode() == 201) { // Expect 201 Created for successful submission
                        try {
                            return objectMapper.readValue(response.body(), RequestResponseDto.class);
                        } catch (Exception e) {
                            logger.error("Error parsing submit cart as request response: {}", e.getMessage(), e);
                            return null; // Return null on parsing error
                        }
                    } else {
                        String errorMessage = "Failed to submit request.";
                        try {
                            JsonNode rootNode = objectMapper.readTree(response.body());
                            // Prioritize "message" or "error_description" for user-friendly error
                            errorMessage = rootNode.has("message") ? rootNode.get("message").asText() : errorMessage;
                            errorMessage = rootNode.has("error_description") ? rootNode.get("error_description").asText() : errorMessage;
                            errorMessage = rootNode.has("error") ? rootNode.get("error").asText() : errorMessage; // Fallback
                        } catch (JsonProcessingException ex) {
                            logger.error("Error parsing error response for submit cart: {}", ex.getMessage(), ex);
                        }
                        logger.error("Failed to submit cart as request. Status: {}, Body: {}", response.statusCode(), response.body());
                        throw new RuntimeException(errorMessage); // Propagate the error message
                    }
                });
    }
}