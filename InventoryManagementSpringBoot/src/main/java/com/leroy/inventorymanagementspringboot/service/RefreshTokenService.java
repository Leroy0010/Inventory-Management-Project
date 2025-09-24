package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.entity.RefreshToken;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.exception.InvalidTokenException;
import com.leroy.inventorymanagementspringboot.repository.RefreshTokenRepository;
import com.leroy.inventorymanagementspringboot.security.JwtUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RefreshTokenService {
    
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    
    @Value("${jwt.refresh.max-tokens-per-user:5}")
    private int maxTokensPerUser;
    
    private static final Logger logger = LogManager.getLogger(RefreshTokenService.class);
    
    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, JwtUtil jwtUtil) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtUtil = jwtUtil;
    }
    
    /**
     * Create a new refresh token for a user
     */
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Clean up old tokens if user has too many
        cleanupOldTokensForUser(user);
        
        // Generate new refresh token
        String tokenValue = jwtUtil.generateRefreshToken();
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(jwtUtil.getRefreshTokenExpirationSeconds());
        
        RefreshToken refreshToken = new RefreshToken(user, expiresAt);
        refreshToken.setToken(tokenValue);
        
        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        logger.debug("Created refresh token for user: {}", user.getEmail());
        
        return savedToken;
    }
    
    /**
     * Validate and retrieve a refresh token
     */
    @Transactional
    public RefreshToken validateRefreshToken(String token) {
        Optional<RefreshToken> refreshTokenOpt = refreshTokenRepository.findByToken(token);
        
        if (refreshTokenOpt.isEmpty()) {
            logger.warn("Refresh token not found: {}", token);
            throw new InvalidTokenException("Invalid refresh token");
        }
        
        RefreshToken refreshToken = refreshTokenOpt.get();
        
        if (refreshToken.getIsRevoked()) {
            logger.warn("Refresh token is revoked: {}", token);
            throw new InvalidTokenException("Refresh token has been revoked");
        }
        
        if (refreshToken.isExpired()) {
            logger.warn("Refresh token is expired: {}", token);
            // Clean up expired token
            refreshTokenRepository.delete(refreshToken);
            throw new InvalidTokenException("Refresh token has expired");
        }
        
        return refreshToken;
    }
    
    /**
     * Revoke a specific refresh token
     */
    @Transactional
    public void revokeRefreshToken(String token) {
        refreshTokenRepository.revokeTokenByValue(token);
        logger.debug("Revoked refresh token: {}", token);
    }
    
    /**
     * Revoke all refresh tokens for a user
     */
    @Transactional
    public void revokeAllRefreshTokensForUser(User user) {
        refreshTokenRepository.revokeAllTokensByUser(user);
        logger.debug("Revoked all refresh tokens for user: {}", user.getEmail());
    }
    
    /**
     * Clean up old tokens for a user to maintain max token limit
     */
    @Transactional
    public void cleanupOldTokensForUser(User user) {
        List<RefreshToken> validTokens = refreshTokenRepository.findValidTokensByUser(user, LocalDateTime.now());
        
        if (validTokens.size() >= maxTokensPerUser) {
            // Sort by creation date and remove oldest tokens
            validTokens.sort((t1, t2) -> t1.getCreatedAt().compareTo(t2.getCreatedAt()));
            
            int tokensToRemove = validTokens.size() - maxTokensPerUser + 1;
            // Batch revoke tokens for better performance
            List<String> tokensToRevoke = validTokens.stream()
                .limit(tokensToRemove)
                .map(RefreshToken::getToken)
                .toList();
            
            refreshTokenRepository.revokeTokensByValues(tokensToRevoke);
            logger.debug("Cleaned up {} old refresh tokens for user: {}", tokensToRevoke.size(), user.getEmail());
        }
    }
    
    /**
     * Clean up all expired tokens (scheduled task)
     */
    @Scheduled(fixedRate = 3600000) // Run every hour
    @Transactional
    public void cleanupExpiredTokens() {
        // Count tokens before deletion
        long countBefore = refreshTokenRepository.count();
        
        // Delete expired tokens
        refreshTokenRepository.deleteExpiredTokens(LocalDateTime.now());
        
        // Count tokens after deletion
        long countAfter = refreshTokenRepository.count();
        long deletedCount = countBefore - countAfter;
        
        if (deletedCount > 0) {
            logger.info("Cleaned up {} expired refresh tokens", deletedCount);
        }
    }
    
    /**
     * Get all valid refresh tokens for a user
     */
    public List<RefreshToken> getValidTokensForUser(User user) {
        return refreshTokenRepository.findValidTokensByUser(user, LocalDateTime.now());
    }
    
    /**
     * Check if user has reached maximum token limit
     */
    public boolean hasReachedTokenLimit(User user) {
        long tokenCount = refreshTokenRepository.countValidTokensByUser(user, LocalDateTime.now());
        return tokenCount >= maxTokensPerUser;
    }
}
