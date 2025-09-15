package com.leroy.inventorymanagementspringboot.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementspringboot.dto.response.AuthenticationResponse;
import com.leroy.inventorymanagementspringboot.entity.RefreshToken;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.mapper.UserMapper;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.security.JwtUtil;
import com.leroy.inventorymanagementspringboot.service.CustomUserDetailService;
import com.leroy.inventorymanagementspringboot.service.RefreshTokenService;
import com.leroy.inventorymanagementspringboot.util.CookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
public class GoogleAuthController {

    private static final Logger logger = LogManager.getLogger(GoogleAuthController.class);

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String googleRedirectUri;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailService userDetailsService;
    private final UserMapper userMapper;
    private final RefreshTokenService refreshTokenService;
    private final CookieUtil cookieUtil;

    public GoogleAuthController(RestTemplate restTemplate, ObjectMapper objectMapper, UserRepository userRepository, 
                               JwtUtil jwtUtil, CustomUserDetailService userDetailsService, UserMapper userMapper,
                               RefreshTokenService refreshTokenService, CookieUtil cookieUtil) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userMapper = userMapper;
        this.refreshTokenService = refreshTokenService;
        this.cookieUtil = cookieUtil;
    }

    @PostMapping("/api/auth/google")
    public ResponseEntity<?> exchangeCode(@RequestParam("code") String code, HttpServletResponse response) {
        String tokenEndpoint = "https://oauth2.googleapis.com/token";

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", googleClientId);
        body.add("client_secret", googleClientSecret);
        body.add("redirect_uri", googleRedirectUri);
        body.add("grant_type", "authorization_code");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        try {
            // 1. Exchange authorization code for access token with Google
            ResponseEntity<String> tokenResponse = restTemplate.postForEntity(tokenEndpoint, new org.springframework.http.HttpEntity<>(body, headers), String.class);

            if (tokenResponse.getStatusCode() == HttpStatus.OK) {
                JsonNode tokenInfo = objectMapper.readTree(tokenResponse.getBody());
                String accessToken = tokenInfo.get("access_token").asText();

                // 2. Fetch user info from Google using the access token
                HttpHeaders userInfoHeaders = new HttpHeaders();
                userInfoHeaders.setBearerAuth(accessToken);
                ResponseEntity<String> userInfoResponse = restTemplate.exchange(
                        "https://www.googleapis.com/oauth2/v2/userinfo",
                        org.springframework.http.HttpMethod.GET,
                        new org.springframework.http.HttpEntity<>(userInfoHeaders),
                        String.class
                );

                if (userInfoResponse.getStatusCode() == HttpStatus.OK) {
                    JsonNode userInfo = objectMapper.readTree(userInfoResponse.getBody());
                    String email = userInfo.get("email").asText();
                    
                    // 3. Check if the user exists in your database
                    Optional<User> userOptional = userRepository.findByEmail(email);

                    if (userOptional.isEmpty()) {
                        logger.warn("Google login failed: User with email {} not found in database.", email);
                        Map<String, String> errorResponse = new HashMap<>();
                        errorResponse.put("error", "user_not_found");
                        errorResponse.put("message", "User not found in application database.");
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
                    }

                    User user = userOptional.get();

                    // 4. Load UserDetails for JWT generation and generate JWT
                    UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                    final String jwt = jwtUtil.generateToken(userDetails);

                    // 5. Create refresh token
                    RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

                    // 6. Set HTTP-only cookies for security
                    cookieUtil.createJwtCookie(response, jwt, jwtUtil.getJwtExpirationSeconds());
                    cookieUtil.createRefreshTokenCookie(response, refreshToken.getToken(), jwtUtil.getRefreshTokenExpirationSeconds());

                    // 7. Return success response without JWT in body (security best practice)
                    var authResponse = userMapper.toAuthenticationResponse(user);
                    
                    // Add security headers
                    response.setHeader("X-Content-Type-Options", "nosniff");
                    response.setHeader("X-Frame-Options", "DENY");
                    response.setHeader("X-XSS-Protection", "1; mode=block");
                    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

                    return ResponseEntity.ok(authResponse);

                } else {
                    logger.error("Failed to retrieve user info from Google: {} - {}", userInfoResponse.getStatusCode(), userInfoResponse.getBody());
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "user_info_failed");
                    errorResponse.put("message", "Failed to retrieve user information from Google.");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
                }

            } else {
                logger.error("Failed to exchange code for token with Google: {} - {}", tokenResponse.getStatusCode(), tokenResponse.getBody());
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "token_exchange_failed");
                errorResponse.put("message", "Failed to exchange authorization code with Google.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
        } catch (HttpClientErrorException e) {
            logger.error("HTTP Client Error during Google OAuth: {}", e.getResponseBodyAsString());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "oauth_error");
            errorResponse.put("message", "Google OAuth error: " + e.getResponseBodyAsString());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (IOException e) {
            logger.error("IO Error during Google OAuth: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "internal_error");
            errorResponse.put("message", "Internal server error during Google authentication process.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error during Google OAuth: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "unexpected_error");
            errorResponse.put("message", "An unexpected error occurred during Google authentication.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
