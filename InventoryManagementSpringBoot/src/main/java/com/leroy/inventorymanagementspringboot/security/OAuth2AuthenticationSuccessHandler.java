package com.leroy.inventorymanagementspringboot.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementspringboot.entity.RefreshToken;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.mapper.UserMapper;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.service.RefreshTokenService;
import com.leroy.inventorymanagementspringboot.util.CookieUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger logger = LogManager.getLogger(OAuth2AuthenticationSuccessHandler.class);

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final CookieUtil cookieUtil;
    private final UserMapper userMapper;
    private final ObjectMapper objectMapper;

    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    public OAuth2AuthenticationSuccessHandler(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            RefreshTokenService refreshTokenService,
            CookieUtil cookieUtil,
            UserMapper userMapper,
            ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        this.cookieUtil = cookieUtil;
        this.userMapper = userMapper;
        this.objectMapper = objectMapper;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, 
                                      Authentication authentication) throws IOException, ServletException {
        try {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            String picture = oauth2User.getAttribute("picture");

            logger.info("OAuth2 authentication successful for user: {}", email);

            // Check if user exists in database
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));

            // Generate JWT token
            String jwt = jwtUtil.generateToken(user);

            // Create refresh token
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

            // Set HTTP-only cookies
            cookieUtil.createJwtCookie(response, jwt, jwtUtil.getJwtExpirationSeconds());
            cookieUtil.createRefreshTokenCookie(response, refreshToken.getToken(), jwtUtil.getRefreshTokenExpirationSeconds());

            // Create response data
            Map<String, Object> responseData = Map.of(
                    "success", true,
                    "message", "Authentication successful",
                    "user", userMapper.toAuthenticationResponse(user)
            );

            // Set response headers for security
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            
            // Add security headers
            response.setHeader("X-Content-Type-Options", "nosniff");
            response.setHeader("X-Frame-Options", "DENY");
            response.setHeader("X-XSS-Protection", "1; mode=block");
            response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

            // Write response
            objectMapper.writeValue(response.getWriter(), responseData);

            logger.info("OAuth2 authentication completed successfully for user: {}", email);

        } catch (Exception e) {
            logger.error("OAuth2 authentication failed: {}", e.getMessage(), e);
            
            // Create error response
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Authentication failed: " + e.getMessage()
            );

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            objectMapper.writeValue(response.getWriter(), errorResponse);
        }
    }
}