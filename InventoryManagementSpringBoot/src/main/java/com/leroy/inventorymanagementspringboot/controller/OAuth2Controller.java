package com.leroy.inventorymanagementspringboot.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class OAuth2Controller {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String googleRedirectUri;

    @GetMapping("/google/url")
    public ResponseEntity<Map<String, String>> getGoogleAuthUrl() {
        String googleAuthUrl = String.format(
                "https://accounts.google.com/o/oauth2/v2/auth?client_id=%s&redirect_uri=%s&response_type=code&scope=email profile openid&access_type=offline",
                googleClientId,
                googleRedirectUri
        );

        return ResponseEntity.ok(Map.of("authUrl", googleAuthUrl));
    }

    @GetMapping("/google/callback")
    public ResponseEntity<Map<String, String>> handleGoogleCallback() {
        // This endpoint is handled by Spring Security OAuth2
        // It will redirect to the success handler
        return ResponseEntity.ok(Map.of("message", "OAuth2 callback handled by Spring Security"));
    }
}
