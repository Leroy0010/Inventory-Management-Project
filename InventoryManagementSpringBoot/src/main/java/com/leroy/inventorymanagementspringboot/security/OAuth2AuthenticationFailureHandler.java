package com.leroy.inventorymanagementspringboot.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class OAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {

    private static final Logger logger = LogManager.getLogger(OAuth2AuthenticationFailureHandler.class);
    private final ObjectMapper objectMapper;

    public OAuth2AuthenticationFailureHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, 
                                      AuthenticationException exception) throws IOException, ServletException {
        
        logger.error("OAuth2 authentication failed: {}", exception.getMessage(), exception);

        // Create error response
        Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "OAuth2 authentication failed: " + exception.getMessage(),
                "error", "authentication_failed"
        );

        // Set response headers for security
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("X-XSS-Protection", "1; mode=block");
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

        // Write error response
        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
