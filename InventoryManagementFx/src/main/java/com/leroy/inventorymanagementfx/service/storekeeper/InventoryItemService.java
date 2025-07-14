package com.leroy.inventorymanagementfx.service.storekeeper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.dto.request.CreateInventoryItemRequest;
import com.leroy.inventorymanagementfx.dto.request.UpdateInventoryItemRequest; // Import the new DTO
import com.leroy.inventorymanagementfx.dto.response.InventoryItemResponse;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

public class InventoryItemService {
    private final Logger logger = LogManager.getLogger(InventoryItemService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();


    public CompletableFuture<HttpResponse<String>> createInventoryItem(String name, String unit, String description, Integer reorderLevel, String imagePath) {
        CreateInventoryItemRequest request = new CreateInventoryItemRequest(name.trim(), unit.trim(), description.trim(), reorderLevel, imagePath.trim());

        try {
            String json = objectMapper.writeValueAsString(request);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/inventory-items"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            logger.info("Creating inventory item");

            return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString())
                    .thenApply(response -> {
                        if (response.statusCode() == 201) logger.info("Inventory item created successfully: {}", name);
                        else {
                            try {
                                logger.error("Failed to create item. Status: {}, Response: {}",
                                        response.statusCode(), objectMapper.readTree(response.body()).findValue("message").asText());
                            } catch (JsonProcessingException e) {
                                throw new RuntimeException(e);
                            }
                        }
                        return response;
                    });
        } catch (JsonProcessingException exception){
            logger.error("Error creating inventory item JSON payload", exception);
            return CompletableFuture.failedFuture(exception);
        }
    }

    public CompletableFuture<HttpResponse<String>> getInventoryItemsByDepartment(){
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/inventory-items/get-all-department"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .GET()
                .build();

        return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());

    }

    public CompletableFuture<HttpResponse<String>> getInventoryItemNamesByDepartment(){
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/inventory-items/get-all-department-names"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .GET()
                .build();

        return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());

    }

    public CompletableFuture<HttpResponse<String>> getInventoryItemById(int id){
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/inventory-items/get-by-id/" + id))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .GET()
                .build();

        return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());

    }

    /**
     * Sends a PUT request to update an existing inventory item.
     * @param item The InventoryItemResponse object containing updated details.
     * @return A CompletableFuture with the HttpResponse from the backend.
     */
    public CompletableFuture<HttpResponse<String>> updateInventoryItem(InventoryItemResponse item) {
        UpdateInventoryItemRequest request = new UpdateInventoryItemRequest(
                item.getId(),
                item.getName().trim(),
                item.getDescription() != null ? item.getDescription().trim() : null, // Handle null description
                item.getUnit().trim(),
                item.getImagePath().trim(),
                item.getReorderLevel()
        );

        try {
            String json = objectMapper.writeValueAsString(request);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/inventory-items")) // Assuming PUT to base URL
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .PUT(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            logger.info("Updating inventory item with ID: {}", item.getId());

            return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString())
                    .thenApply(response -> {
                        if (response.statusCode() == 200) { // HTTP 200 OK for successful update
                            logger.info("Inventory item with ID {} updated successfully.", item.getId());
                        } else {
                            try {
                                JsonNode errorNode = objectMapper.readTree(response.body());
                                String errorMessage = errorNode.has("message") ? errorNode.get("message").asText() : "Unknown error";
                                logger.error("Failed to update item ID {}. Status: {}, Response: {}",
                                        item.getId(), response.statusCode(), errorMessage);
                            } catch (JsonProcessingException e) {
                                logger.error("Failed to update item ID {}. Status: {}, Could not parse error response: {}",
                                        item.getId(), response.statusCode(), e.getMessage(), e);
                            }
                        }
                        return response;
                    });
        } catch (JsonProcessingException exception) {
            logger.error("Error creating update inventory item JSON payload for ID {}: {}", item.getId(), exception.getMessage(), exception);
            return CompletableFuture.failedFuture(exception);
        }
        
    }

    public CompletableFuture<HttpResponse<String>> getInventoryItemsNamesAndIdsByDepartment(){
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/inventory-items/get-all-department"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .GET()
                .build();

        return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());

    }
}

// Toner Cartridge is an essential printing the component for laser printers, producing high-quality text and images. Designed for the the HP Laser Jet Pro, this toner cartridge ensures crisp, precise prints with vibrant colors or sharp blacks.
