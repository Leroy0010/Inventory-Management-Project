package com.leroy.inventorymanagementfx.service.staff;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.dto.request.CartItemRequest;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

public class CartService {
    private final Logger logger = LogManager.getLogger(CartService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    
    public CompletableFuture<HttpResponse<String>> addItem(int id, int quantity){
        CartItemRequest request = new CartItemRequest(id, quantity);
        
        try {
            String json = objectMapper.writeValueAsString(request);
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/cart/add-item"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            logger.info("Adding Item to cart {}", json);

            return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());

        } catch (JsonProcessingException exception){
            logger.error("Error creating cart item JSON payload", exception);
            return CompletableFuture.failedFuture(exception);
        }
    }

    public CompletableFuture<HttpResponse<String>> removeItem(int id, int quantity){
        CartItemRequest request = new CartItemRequest(id, quantity);

        try {
            String json = objectMapper.writeValueAsString(request);
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/cart/remove-item"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            logger.info("Removing Item from cart");

            return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());

        } catch (JsonProcessingException exception){
            logger.error("Error creating cart item JSON payload", exception);
            return CompletableFuture.failedFuture(exception);
        }
    }

    public CompletableFuture<HttpResponse<String>> updateItem(int id, int quantity){
        CartItemRequest request = new CartItemRequest(id, quantity);

        try {
            String json = objectMapper.writeValueAsString(request);
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + "/api/cart/update-item"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                    .PUT(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            logger.info("Updating Item in cart");

            return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());

        } catch (JsonProcessingException exception){
            logger.error("Error creating cart item JSON payload", exception);
            return CompletableFuture.failedFuture(exception);
        }
    }

    public CompletableFuture<HttpResponse<String>> clearCart(){

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/cart/clear"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .DELETE()
                .build();

        logger.info("Clearing cart");

        return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());

    }

    public CompletableFuture<HttpResponse<String>> getCart(){

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/cart/get"))
                .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken())
                .GET()
                .build();

        logger.info("Fetching cart");

        return httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString());

    }
    
}
