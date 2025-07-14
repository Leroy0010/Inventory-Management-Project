package com.leroy.inventorymanagementfx.security;

import java.io.IOException;
import java.nio.file.*;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.http.HttpClient;
import java.time.Duration;

public class AuthTokenHolder {

    private static String jwtToken;

    private static final Path JWT_FILE_PATH = Paths.get(System.getProperty("user.home"), ".inventory_app_jwt");

    private static final CookieManager cookieManager = new CookieManager(null, CookiePolicy.ACCEPT_ALL);

    private static final HttpClient client = HttpClient.newBuilder()
            .cookieHandler(cookieManager)
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private AuthTokenHolder() {
        // Prevent instantiation
    }

    public static String getJwtToken() {
        if (jwtToken == null || jwtToken.isEmpty()) {
            jwtToken = loadTokenFromFile();
        }
        return jwtToken;
    }

    public static void setJwtToken(String newJwtToken) {
        jwtToken = newJwtToken;
        saveTokenToFile(newJwtToken);
    }

    public static void clearAuth() {
        jwtToken = null;
        cookieManager.getCookieStore().removeAll();
        try {
            Files.deleteIfExists(JWT_FILE_PATH);
        } catch (IOException e) {
            System.err.println("Failed to delete JWT token file: " + e.getMessage());
        }
        System.out.println("JWT token and cookies cleared.");
    }

    public static CookieManager getCookieManager() {
        return cookieManager;
    }

    public static HttpClient getHttpClient() {
        return client;
    }

    public static boolean isTokenPresent() {
        return getJwtToken() != null && !getJwtToken().isEmpty();
    }

    private static void saveTokenToFile(String token) {
        try {
            Files.writeString(JWT_FILE_PATH, token, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
        } catch (IOException e) {
            System.err.println("Failed to save JWT token to file: " + e.getMessage());
        }
    }

    private static String loadTokenFromFile() {
        try {
            if (Files.exists(JWT_FILE_PATH)) {
                return Files.readString(JWT_FILE_PATH).trim();
            }
        } catch (IOException e) {
            System.err.println("Failed to load JWT token from file: " + e.getMessage());
        }
        return null;
    }
}
