package com.leroy.inventorymanagementfx.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.dto.response.AuthenticationResponse;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import com.leroy.inventorymanagementfx.security.UserSession;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;

public class AuthService {

    private static final Logger LOGGER = LogManager.getLogger(AuthService.class);
    private static final String BACKEND_URL = Config.getBackendUrl();

    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Logs in using email and password.
     * On success: sets JWT and initializes user session.
     */
    public CompletableFuture<HttpResponse<String>> login(String email, String password) {
        String json = String.format("{\"email\": \"%s\", \"password\": \"%s\"}", email, password);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/authenticate"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        LOGGER.info("Sending login request for email: {}", email);

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(response -> handleAuthResponse(response, "Standard Login"))
                .exceptionally(ex -> {
                    LOGGER.error("Login request failed: {}", ex.getMessage(), ex);
                    return null;
                });
    }

    /**
     * Exchanges Google OAuth code for a JWT token.
     * On success: sets JWT and initializes user session.
     */
    public CompletableFuture<HttpResponse<String>> exchangeCodeForToken(String code) {
        String redirectUri = Config.getGoogleRedirectUri();

        String requestBody = String.format(
                "code=%s&client_id=%s&client_secret=%s&redirect_uri=%s&grant_type=authorization_code",
                URLEncoder.encode(code, StandardCharsets.UTF_8),
                URLEncoder.encode(Config.getGoogleClientId(), StandardCharsets.UTF_8),
                URLEncoder.encode(Config.getGoogleClientSecret(), StandardCharsets.UTF_8),
                URLEncoder.encode(redirectUri, StandardCharsets.UTF_8)
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_URL + "/api/auth/google"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        LOGGER.info("Sending Google OAuth token exchange request...");

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(response -> handleAuthResponse(response, "Google OAuth"))
                .exceptionally(ex -> {
                    LOGGER.error("Google login request failed: {}", ex.getMessage(), ex);
                    return null;
                });
    }

    /**
     * Clears token and session.
     */
    public void logout() {
        AuthTokenHolder.clearAuth();
        UserSession.getInstance().clearSession();
        LOGGER.info("User logged out. Session and JWT cleared.");
    }

    /**
     * Handles both standard and Google authentication responses.
     */
    private HttpResponse<String> handleAuthResponse(HttpResponse<String> response, String loginType) {
        if (response.statusCode() == 200) {
            try {
                AuthenticationResponse authResponse = objectMapper.readValue(response.body(), AuthenticationResponse.class);

                String jwtToken = authResponse.getJwt();
                Integer userId = authResponse.getUserId();
                String firstName = authResponse.getFirstName();
                String role = authResponse.getRole();

                if (jwtToken == null || userId == null || firstName == null || role == null) {
                    LOGGER.error("{} response missing required fields.", loginType);
                    AuthTokenHolder.clearAuth();
                    return response;
                }

                AuthTokenHolder.setJwtToken(jwtToken);
                UserSession.getInstance().initializeSession(userId, firstName, role);

                LOGGER.info("{} successful. Session initialized: ID={}, Name={}, Role={}",
                        loginType, userId, firstName, role);

            } catch (Exception e) {
                LOGGER.error("Failed to parse {} response: {}", loginType, e.getMessage(), e);
                AuthTokenHolder.clearAuth();
            }
        } else {
            LOGGER.warn("{} failed. Status: {}, Body: {}", loginType, response.statusCode(), response.body());
        }

        return response;
    }
}
