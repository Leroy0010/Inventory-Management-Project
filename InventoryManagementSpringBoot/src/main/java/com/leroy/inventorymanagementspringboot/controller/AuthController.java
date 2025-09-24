package com.leroy.inventorymanagementspringboot.controller;


import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.leroy.inventorymanagementspringboot.dto.request.AuthenticationRequest;
import com.leroy.inventorymanagementspringboot.dto.request.PasswordChangeRequest;
import com.leroy.inventorymanagementspringboot.dto.request.PasswordResetRequest;
import com.leroy.inventorymanagementspringboot.entity.RefreshToken;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.exception.InvalidTokenException;
import com.leroy.inventorymanagementspringboot.exception.RateLimitExceededException;
import com.leroy.inventorymanagementspringboot.mapper.UserMapper;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.security.JwtUtil;
import com.leroy.inventorymanagementspringboot.service.PasswordResetService;
import com.leroy.inventorymanagementspringboot.service.RefreshTokenService;
import com.leroy.inventorymanagementspringboot.util.CookieUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordResetService passwordResetService;
    private final RefreshTokenService refreshTokenService;
    private final CookieUtil cookieUtil;

    public AuthController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JwtUtil jwtUtil, UserRepository userRepository, UserMapper userMapper, PasswordResetService passwordResetService, RefreshTokenService refreshTokenService, CookieUtil cookieUtil) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordResetService = passwordResetService;
        this.refreshTokenService = refreshTokenService;
        this.cookieUtil = cookieUtil;
    }


    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request, HttpServletResponse response) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            final UserDetails userDetails = userDetailsService
                    .loadUserByUsername(request.getEmail());
            final String jwt = jwtUtil.generateToken(userDetails);

            var user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new BadCredentialsException("Invalid username or password"));
            
            // Create refresh token
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
            
            // Set HTTP-only cookies
            cookieUtil.createJwtCookie(response, jwt, jwtUtil.getJwtExpirationSeconds());
            cookieUtil.createRefreshTokenCookie(response, refreshToken.getToken(), jwtUtil.getRefreshTokenExpirationSeconds());
            
            var authResponse = userMapper.toAuthenticationResponse(user);
            // Don't include JWT in response body for security
            return ResponseEntity.ok(authResponse);
        } catch (BadCredentialsException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Authentication error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/api/auth/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody PasswordResetRequest request) {
        try {
            passwordResetService.createPasswordResetTokenForUser(request.getEmail());
            // Return a generic success message to prevent email enumeration attacks
            return ResponseEntity.ok("If an account with that email exists, a password reset link has been sent.");
        } catch (RateLimitExceededException e) {
            // Handle rate limiting specifically
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(e.getMessage());
        } catch (RuntimeException e) { // Catch the generic exception for non-existent users
            return ResponseEntity.ok("If an account with that email exists, a password reset link has been sent.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing request: " + e.getMessage());
        }
    }

    @PostMapping("/api/auth/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody PasswordChangeRequest request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("Password has been reset successfully.");
        } catch (InvalidTokenException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error resetting password: " + e.getMessage());
        }
    }

    @PostMapping("/api/auth/clear-rate-limit")
    public ResponseEntity<String> clearRateLimit(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            passwordResetService.clearRateLimit(email);
            return ResponseEntity.ok("Rate limit cleared for email: " + email);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error clearing rate limit: " + e.getMessage());
        }
    }

    @PostMapping("/api/auth/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        try {
            // Get refresh token from cookie
            String refreshTokenValue = cookieUtil.getRefreshTokenFromCookie(request)
                    .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));

            // Validate refresh token
            RefreshToken refreshToken = refreshTokenService.validateRefreshToken(refreshTokenValue);
            User user = refreshToken.getUser();

            // Generate new JWT token
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String newJwt = jwtUtil.generateToken(userDetails);

            // Create new refresh token (rotate refresh token for security)
            refreshTokenService.revokeRefreshToken(refreshTokenValue);
            RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);

            // Set new cookies
            cookieUtil.createJwtCookie(response, newJwt, jwtUtil.getJwtExpirationSeconds());
            cookieUtil.createRefreshTokenCookie(response, newRefreshToken.getToken(), jwtUtil.getRefreshTokenExpirationSeconds());

            var authResponse = userMapper.toAuthenticationResponse(user);
            return ResponseEntity.ok(authResponse);
        } catch (InvalidTokenException e) {
            // Clear invalid cookies
            cookieUtil.clearAllAuthCookies(response);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid refresh token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Token refresh error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            // Get refresh token from cookie and revoke it
            cookieUtil.getRefreshTokenFromCookie(request)
                    .ifPresent(refreshTokenService::revokeRefreshToken);

            // Clear all authentication cookies
            cookieUtil.clearAllAuthCookies(response);

            Map<String, String> successResponse = new HashMap<>();
            successResponse.put("message", "Logged out successfully");
            return ResponseEntity.ok(successResponse);
        } catch (Exception e) {
            // Even if there's an error, clear the cookies
            cookieUtil.clearAllAuthCookies(response);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Logout error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
