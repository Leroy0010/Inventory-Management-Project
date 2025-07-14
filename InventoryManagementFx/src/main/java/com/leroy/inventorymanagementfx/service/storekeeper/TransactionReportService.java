package com.leroy.inventorymanagementfx.service.storekeeper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.dto.report.TransactionReportRequest;
import com.leroy.inventorymanagementfx.enums.StockTransactionType;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.concurrent.CompletableFuture;

public class TransactionReportService {
    private final Logger logger = LogManager.getLogger(TransactionReportService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public CompletableFuture<HttpResponse<String>> getReport(Integer itemId, Integer year, Integer month, StockTransactionType type, LocalDate startDate, LocalDate endDate) throws JsonProcessingException {
        TransactionReportRequest request = new TransactionReportRequest(itemId, year, month, type, startDate, endDate);
        String json = objectMapper.writeValueAsString(request);
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/reports/transactions"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());

    }
}
