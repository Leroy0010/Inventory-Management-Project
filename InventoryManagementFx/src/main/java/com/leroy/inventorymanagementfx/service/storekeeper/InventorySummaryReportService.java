package com.leroy.inventorymanagementfx.service.storekeeper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule; // For LocalDate serialization
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.dto.report.InventorySummaryReportRequest;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

/**
 * Service for fetching Inventory Summary Report data from the backend.
 */
public class InventorySummaryReportService {
    private final Logger logger = LogManager.getLogger(InventorySummaryReportService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper;

    public InventorySummaryReportService() {
        this.objectMapper = new ObjectMapper();
        // Register JavaTimeModule to handle LocalDate serialization/deserialization
        this.objectMapper.registerModule(new JavaTimeModule());
        // Disable WRITE_DATES_AS_TIMESTAMPS to serialize LocalDate as "YYYY-MM-DD" string
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    /**
     * Generates an Inventory Summary Report by sending a request to the backend.
     *
     * @param request The InventorySummaryReportRequest containing filter criteria.
     * @return A CompletableFuture containing the HTTP response string, which should
     * be a JSON list of InventorySummaryItemDto.
     */
    public CompletableFuture<HttpResponse<String>> generateSummaryReport(InventorySummaryReportRequest request) {
        try {
            String requestJson = objectMapper.writeValueAsString(request);
            logger.debug("Sending Inventory Summary Report request: " + requestJson);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/reports/inventory-summary"))
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                    .build();

            return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());
        } catch (JsonProcessingException e) {
            logger.error("Error creating JSON request for Inventory Summary Report: " + e.getMessage(), e);
            return CompletableFuture.failedFuture(e); // Return a failed future
        }
    }
}
