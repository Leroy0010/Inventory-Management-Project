package com.leroy.inventorymanagementspringboot.security;

import java.io.IOException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.leroy.inventorymanagementspringboot.entity.RefreshToken;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.service.CustomUserDetailService;
import com.leroy.inventorymanagementspringboot.service.RefreshTokenService;
import com.leroy.inventorymanagementspringboot.util.CookieUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger logger = LogManager.getLogger(OAuth2AuthenticationSuccessHandler.class);

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final CookieUtil cookieUtil;
    private final CustomUserDetailService userDetailsService;

    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    public OAuth2AuthenticationSuccessHandler(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            RefreshTokenService refreshTokenService,
            CookieUtil cookieUtil,
            CustomUserDetailService userDetailsService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        this.cookieUtil = cookieUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {
        try {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            String email = oauth2User.getAttribute("email");

            logger.info("OAuth2 authentication successful for user: {}", email);

            // Check if user exists in database
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));

            // Load user details properly using CustomUserDetailService
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // Generate JWT token
            String jwt = jwtUtil.generateToken(userDetails);

            // Create refresh token
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

            // Set HTTP-only cookies
            cookieUtil.createJwtCookie(response, jwt, jwtUtil.getJwtExpirationSeconds());
            cookieUtil.createRefreshTokenCookie(response, refreshToken.getToken(), jwtUtil.getRefreshTokenExpirationSeconds());

            // Redirect to React app with success
            String redirectUrl = frontendBaseUrl + "/login?google_auth=success";
            response.sendRedirect(redirectUrl);

            logger.info("OAuth2 authentication completed successfully for user: {}, redirected to: {}", email, redirectUrl);

        } catch (Exception e) {
            logger.error("OAuth2 authentication failed: {}", e.getMessage(), e);

            // Redirect to React app with error
            String redirectUrl = frontendBaseUrl + "/login?google_auth=error&message=" +
                java.net.URLEncoder.encode(e.getMessage(), java.nio.charset.StandardCharsets.UTF_8);
            response.sendRedirect(redirectUrl);
        }
    }
}