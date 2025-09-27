package com.leroy.inventorymanagementspringboot.service;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.exception.InvalidTokenException;
import com.leroy.inventorymanagementspringboot.exception.RateLimitExceededException;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp; // Using Timestamp as per your User entity
import java.time.LocalDateTime;
import java.time.ZoneOffset; // For converting LocalDateTime to Timestamp
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class PasswordResetService {

    private static final Logger logger = LogManager.getLogger(PasswordResetService.class);

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    // Rate limiting: allow 1 request per minute per email
    private final LoadingCache<String, Integer> resetRequestCache = CacheBuilder.newBuilder()
            .expireAfterWrite(1, TimeUnit.MINUTES) // Cache expires after 1 minute
            .build(new CacheLoader<String, Integer>() {
                @Override
                public Integer load(@org.springframework.lang.NonNull String key) {
                    return 0; // Start with 0 requests
                }
            });

    public PasswordResetService(UserRepository userRepository, EmailService emailService,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * For password reset requests (rate limited).
     */
    public Map<String, Object> generateTokenForUser(String userEmail) {
        try {
            // Check if user has already made a request in the last minute
            Integer requestCount = resetRequestCache.get(userEmail);
            if (requestCount > 0) {
                logger.warn("Rate limit exceeded for password reset request from email: {}", userEmail);
                throw new RateLimitExceededException(
                        "Too many password reset requests. Please wait 1 minute before trying again.");
            }

            // Increment the request count for this email
            resetRequestCache.put(userEmail, 1);
            logger.info("Password reset request allowed for email: {}", userEmail);
        } catch (ExecutionException e) {
            // If there's an error getting from cache, allow the request but still increment
            resetRequestCache.put(userEmail, 1);
            logger.info("Password reset request allowed for email: {} (cache error)", userEmail);
        }

        return createAndSaveToken(userEmail);
    }

    /**
     * For new user registration (no rate limit).
     */
    public Map<String, Object> generateTokenForNewUser(String userEmail) {
        return createAndSaveToken(userEmail);
    }

    /**
     * Shared logic to create token + save on user.
     */
    private Map<String, Object> createAndSaveToken(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("No user found with that email address."));

        String newToken = UUID.randomUUID().toString();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(15);

        user.setPasswordResetToken(newToken);
        user.setResetPasswordExpiresAt(expiryTime);
        userRepository.save(user);

        Map<String, Object> map = new HashMap<>();
        map.put("token", newToken);
        map.put("user", user);
        return map;
    }

    @Transactional
    public void createPasswordResetTokenForUser(String userEmail) {
        var map = generateTokenForUser(userEmail);
        User user = (User) map.get("user");
        String newToken = (String) map.get("token");
        // Send email with the token link
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), newToken);
        logger.info("Password reset token generated and email sent for user: {}", userEmail);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token) // Find user by token
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired password reset token."));

        // Get LocalDateTime for comparison
        LocalDateTime expiresAt = user.getResetPasswordExpiresAt();

        if (expiresAt == null || LocalDateTime.now().isAfter(expiresAt)) {
            // Token is expired, clear it
            user.setPasswordResetToken(null);
            user.setResetPasswordExpiresAt(null);
            userRepository.save(user);
            throw new InvalidTokenException("Invalid or expired password reset token.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null); // Clear token after successful reset
        user.setResetPasswordExpiresAt(null); // Clear expiry
        userRepository.save(user);
        logger.info("Password successfully reset for user: {}", user.getEmail());
    }

    /**
     * Check if an email is currently rate limited
     */
    public boolean isRateLimited(String userEmail) {
        try {
            Integer requestCount = resetRequestCache.get(userEmail);
            return requestCount > 0;
        } catch (ExecutionException e) {
            return false;
        }
    }

    /**
     * Clear rate limit for a specific email (useful for testing)
     */
    public void clearRateLimit(String userEmail) {
        resetRequestCache.invalidate(userEmail);
        logger.info("Rate limit cleared for email: {}", userEmail);
    }

    /**
     * Get remaining time until rate limit expires (in seconds)
     */
    public long getRemainingRateLimitTime(String userEmail) {
        try {
            if (!isRateLimited(userEmail)) {
                return 0;
            }
            // Since we're using expireAfterWrite, we can't get exact remaining time
            // This is a simplified implementation
            return 60; // Assume 1 minute remaining
        } catch (Exception e) {
            return 0;
        }
    }

    // // Scheduled task to clean up expired tokens periodically
    // @Scheduled(cron = "0 */30 * * * ?") // Every 30 minutes
    // @Transactional
    // public void cleanupExpiredTokens() {
    // Timestamp now =
    // Timestamp.from(LocalDateTime.now().toInstant(ZoneOffset.UTC));
    // userRepository.clearExpiredPasswordResetTokens(now); // New custom method
    // logger.info("Cleaned up expired password reset tokens older than: {}", now);
    // }
}