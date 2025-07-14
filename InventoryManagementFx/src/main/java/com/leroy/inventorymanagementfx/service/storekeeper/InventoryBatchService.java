package com.leroy.inventorymanagementfx.service.storekeeper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.dto.request.CreateBatchRequest;
import com.leroy.inventorymanagementfx.dto.request.CreateInventoryItemRequest;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

public class InventoryBatchService {
    private final Logger logger = LogManager.getLogger(InventoryBatchService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CompletableFuture<HttpResponse<String>> addBatch(String itemName, int quantity, BigDecimal totalPrice, String invoiceId, String supplierName) {
        CreateBatchRequest request = new CreateBatchRequest(itemName, quantity, totalPrice, invoiceId, supplierName);
        try {
            String json = objectMapper.writeValueAsString(request);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/batch"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            logger.info("Creating inventory item");

            return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString())
                    .thenApply(response -> {
                        if (response.statusCode() == 201) logger.info("Inventory batch created successfully");
                        else {
                            try {
                                logger.error("Failed to create batch. Status: {}, Response: {}",
                                        response.statusCode(), objectMapper.readTree(response.body()).findValue("message").asText());
                            } catch (JsonProcessingException e) {
                                throw new RuntimeException(e);
                            }
                        }
                        return response;
                    });
        } catch (JsonProcessingException exception){
            logger.error("Error creating inventory batch JSON payload", exception);
            return CompletableFuture.failedFuture(exception);
        }
    }


}
