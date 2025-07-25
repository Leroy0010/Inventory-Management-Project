package com.leroy.inventorymanagementfx.service.dashboard;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

/**
 * Service for fetching dashboard-related data from the backend.
 */
public class DashboardService {
    private final Logger logger = LogManager.getLogger(DashboardService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper(); // Not directly used here, but good practice to have

    /**
     * Fetches inventory summary data for the dashboard.
     * Assumes a GET endpoint returning InventorySummaryDto.
     * @return A CompletableFuture containing the HTTP response string.
     */
    public CompletableFuture<HttpResponse<String>> getInventorySummary() {
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/dashboard/inventory-summary"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .GET()
                .build();

        return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());
    }

    // You would add more methods here for other dashboard data, e.g.,
    // public CompletableFuture<HttpResponse<String>> getUserRequestSummary(Integer userId) { ... }
}