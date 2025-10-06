package com.leroy.inventorymanagementspringboot.controller;

import java.util.HashMap;
import java.util.Map;

import lombok.RequiredArgsConstructor;
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
import com.leroy.inventorymanagementspringboot.dto.auth.TwoFactorRequest;
import com.leroy.inventorymanagementspringboot.dto.auth.TwoFactorResponse;
import com.leroy.inventorymanagementspringboot.entity.RefreshToken;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.exception.InvalidTokenException;
import com.leroy.inventorymanagementspringboot.exception.RateLimitExceededException;
import com.leroy.inventorymanagementspringboot.mapper.UserMapper;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.security.JwtUtil;
import com.leroy.inventorymanagementspringboot.service.PasswordResetService;
import com.leroy.inventorymanagementspringboot.service.RefreshTokenService;
import com.leroy.inventorymanagementspringboot.service.OtpService;
import com.leroy.inventorymanagementspringboot.service.UserSettingsService;
import com.leroy.inventorymanagementspringboot.util.CookieUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
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
    private final OtpService otpService;
    private final UserSettingsService userSettingsService;



    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request, HttpServletResponse response) {
        try {
            // First authenticate with username and password
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            final UserDetails userDetails = userDetailsService
                    .loadUserByUsername(request.getEmail());
            var user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

            // Check if user has 2FA enabled
            var userSettings = userSettingsService.getUserSettings(user.getId()).orElse(null);
            boolean twoFactorEnabled = userSettings != null &&
                    userSettings.getTwoFactorEnabled() != null &&
                    userSettings.getTwoFactorEnabled();

            if (twoFactorEnabled) {
                // Generate and send OTP
                boolean otpSent = otpService.generateAndSendOtp(user.getEmail(), user.getFullName());
                if (!otpSent) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("message", "Failed to send verification code. Please try again.");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
                }

                // Return 2FA required response
                return ResponseEntity
                        .ok(TwoFactorResponse.requiresTwoFactor("Please check your email for the verification code."));
            } else {
                // No 2FA required, proceed with normal login
                final String jwt = jwtUtil.generateToken(userDetails);

                // Create refresh token
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

                // Set HTTP-only cookies
                cookieUtil.createJwtCookie(response, jwt, jwtUtil.getJwtExpirationSeconds());
                cookieUtil.createRefreshTokenCookie(response, refreshToken.getToken(),
                        jwtUtil.getRefreshTokenExpirationSeconds());

                var authResponse = userMapper.toAuthenticationResponse(user);
                // Don't include JWT in response body for security
                return ResponseEntity.ok(authResponse);
            }
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing request: " + e.getMessage());
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error resetting password: " + e.getMessage());
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error clearing rate limit: " + e.getMessage());
        }
    }

    @PostMapping("/api/auth/refresh")
    @Transactional
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
            cookieUtil.createRefreshTokenCookie(response, newRefreshToken.getToken(),
                    jwtUtil.getRefreshTokenExpirationSeconds());

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

    @PostMapping("/api/auth/verify-2fa")
    public ResponseEntity<?> verifyTwoFactor(@Valid @RequestBody TwoFactorRequest request,
            HttpServletResponse response) {
        try {
            // Verify OTP
            boolean isValidOtp = otpService.verifyOtp(request.getEmail(), request.getOtp());

            if (!isValidOtp) {
                return ResponseEntity
                        .ok(TwoFactorResponse.failure("Invalid or expired verification code. Please try again."));
            }

            // OTP is valid, proceed with login
            final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            final String jwt = jwtUtil.generateToken(userDetails);

            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("User not found"));

            // Create refresh token
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

            // Set HTTP-only cookies
            cookieUtil.createJwtCookie(response, jwt, jwtUtil.getJwtExpirationSeconds());
            cookieUtil.createRefreshTokenCookie(response, refreshToken.getToken(),
                    jwtUtil.getRefreshTokenExpirationSeconds());

            // Clean up OTP
            otpService.removeOtp(request.getEmail());

            return ResponseEntity.ok(TwoFactorResponse.success(jwt));
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "2FA verification error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/api/auth/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }

            var user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new BadCredentialsException("User not found"));

            // Check if user has 2FA enabled
            var userSettings = userSettingsService.getUserSettings(user.getId()).orElse(null);
            boolean twoFactorEnabled = userSettings != null &&
                    userSettings.getTwoFactorEnabled() != null &&
                    userSettings.getTwoFactorEnabled();

            if (!twoFactorEnabled) {
                return ResponseEntity.badRequest().body(Map.of("message", "2FA is not enabled for this account"));
            }

            // Check if there's already a valid OTP
            if (otpService.hasValidOtp(email)) {
                return ResponseEntity.badRequest().body(Map.of("message",
                        "A verification code was recently sent. Please wait before requesting another."));
            }

            // Generate and send new OTP
            boolean otpSent = otpService.generateAndSendOtp(user.getEmail(), user.getFullName());
            if (!otpSent) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Failed to send verification code. Please try again."));
            }

            return ResponseEntity.ok(Map.of("message", "New verification code sent to your email"));
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error resending OTP: " + e.getMessage());
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
