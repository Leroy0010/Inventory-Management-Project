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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp; // Using Timestamp as per your User entity
import java.time.LocalDateTime;
import java.time.ZoneOffset; // For converting LocalDateTime to Timestamp
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class PasswordResetService {

    private static final Logger logger = LogManager.getLogger(PasswordResetService.class);

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private final LoadingCache<String, LocalDateTime> resetRequestCache = CacheBuilder.newBuilder()
            .expireAfterWrite(1, TimeUnit.MINUTES) // 1 minute cooldown per email
            .build(new CacheLoader<String, LocalDateTime>() {
                public LocalDateTime load(String key) {
                    return LocalDateTime.now();
                }
            });

    public PasswordResetService(UserRepository userRepository, EmailService emailService,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void createPasswordResetTokenForUser(String userEmail) {
        // Apply rate limiting
        try {
            LocalDateTime lastRequestTime = resetRequestCache.get(userEmail);
            if (LocalDateTime.now().isBefore(lastRequestTime.plusMinutes(1))) {
                throw new RateLimitExceededException("Password reset request limit exceeded for this email. Please try again after 1 minute.");
            }
        } catch (ExecutionException e) {
            logger.error("Error accessing reset request cache for {}: {}", userEmail, e.getMessage());
        }
        resetRequestCache.put(userEmail, LocalDateTime.now()); // Update last request time

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> {
                    logger.warn("Password reset request for non-existent email: {}", userEmail);
                    // Return a generic error message for security, don't reveal if email exists.
                    // Or for this example, throw for explicit handling in controller.
                    return new RuntimeException("No user found with that email address.");
                });

        // Generate a new token
        String newToken = UUID.randomUUID().toString();
        // Set expiry to 15 minutes from now
        Timestamp expiryTime = Timestamp.from(LocalDateTime.now().plusMinutes(15).toInstant(ZoneOffset.UTC));

        user.setPasswordResetToken(newToken);
        user.setResetPasswordExpiresAt(expiryTime);
        userRepository.save(user); // Save the token and expiry on the user entity

        // Send email with the token link
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), newToken);
        logger.info("Password reset token generated and email sent for user: {}", userEmail);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token) // Find user by token
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired password reset token."));

        // Convert Timestamp to LocalDateTime for comparison
        LocalDateTime expiresAt = user.getResetPasswordExpiresAt().toLocalDateTime();

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

//    // Scheduled task to clean up expired tokens periodically
//    @Scheduled(cron = "0 */30 * * * ?") // Every 30 minutes
//    @Transactional
//    public void cleanupExpiredTokens() {
//        Timestamp now = Timestamp.from(LocalDateTime.now().toInstant(ZoneOffset.UTC));
//        userRepository.clearExpiredPasswordResetTokens(now); // New custom method
//        logger.info("Cleaned up expired password reset tokens older than: {}", now);
//    }
}