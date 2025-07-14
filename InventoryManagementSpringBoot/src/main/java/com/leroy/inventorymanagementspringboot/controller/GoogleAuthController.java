package com.leroy.inventorymanagementspringboot.controller;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementspringboot.dto.response.AuthenticationResponse;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.mapper.UserMapper;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.security.JwtUtil;
import com.leroy.inventorymanagementspringboot.service.CustomUserDetailService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.HttpClientErrorException; // Import for client errors
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Optional;

@Controller
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

    public GoogleAuthController(RestTemplate restTemplate, ObjectMapper objectMapper, UserRepository userRepository, JwtUtil jwtUtil, CustomUserDetailService userDetailsService, UserMapper userMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userMapper = userMapper;
    }

    @PostMapping("/api/auth/google")
    public ResponseEntity<?> exchangeCode(@RequestParam("code") String code) {
        String tokenEndpoint = "https://www.googleapis.com/oauth2/v4/token";

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
            ResponseEntity<String> response = restTemplate.postForEntity(tokenEndpoint, new org.springframework.http.HttpEntity<>(body, headers), String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode tokenInfo = objectMapper.readTree(response.getBody());
                String accessToken = tokenInfo.get("access_token").asText();

                // 2. Fetch user info from Google using the access token
                HttpHeaders userInfoHeaders = new HttpHeaders();
                userInfoHeaders.setBearerAuth(accessToken);
                ResponseEntity<String> userInfoResponse = restTemplate.exchange(
                        "https://www.googleapis.com/oauth2/v3/userinfo",
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
                        // User not found in your database, return an error
                        System.err.println("Google login failed: User with email " + email + " not found in database.");
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found in application database.");
                    }

                    User user = userOptional.get();

                    // 4. Load UserDetails for JWT generation and generate JWT
                    UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                    final String jwt = jwtUtil.generateToken(userDetails);
                    user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new BadCredentialsException("Invalid username or password"));
                    var authResponse = userMapper.toAuthenticationResponse(user);
                    authResponse.setJwt(jwt);


                    // 5. Return success response with JWT
                    return ResponseEntity.ok(authResponse);

                } else {
                    System.err.println("Failed to retrieve user info from Google: " + userInfoResponse.getStatusCode() + " - " + userInfoResponse.getBody());
                    logger.error("Failed to retrieve user info from Google: {} - {}", userInfoResponse.getStatusCode(), userInfoResponse.getBody());
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to retrieve user information from Google.");
                }

            } else {
                System.err.println("Failed to exchange code for token with Google: " + response.getStatusCode() + " - " + response.getBody());
                logger.error("Failed to exchange code for token with Google: {} - {}", response.getStatusCode(), response.getBody());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to exchange authorization code with Google.");
            }
        } catch (HttpClientErrorException e) {
            // Catch specific HTTP client errors (e.g., 400 Bad Request from Google)
            System.err.println("HTTP Client Error during Google OAuth: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            logger.error("HTTP Client Error during Google OAuth: {}", e.getResponseBodyAsString());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Google OAuth error: " + e.getResponseBodyAsString());
        } catch (IOException e) {
            // Catch JSON parsing errors or other IO issues

            logger.error("IO Error during Google OAuth: {}\n{}", e.getMessage(),  e.getStackTrace());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error during Google authentication process.");
        } catch (Exception e) {
            // Catch any other unexpected exceptions
            logger.error("Unexpected error during Google OAuth: {}\n{}", e.getMessage(),  e.getStackTrace());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred during Google authentication.");
        }
    }
}
