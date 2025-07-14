package com.leroy.inventorymanagementfx.security;

import com.leroy.inventorymanagementfx.config.Config;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Base64;
import java.security.Key;

public class JwtDecoder {

    private static final String SECRET = Config.getJwtTSecret();
    private static Key signingKey;
    private static final Logger logger = LogManager.getLogger(JwtDecoder.class);

    private static Key getSigningKey() {
        if (signingKey == null) {
            if (SECRET == null || SECRET.isEmpty()) {
                logger.error("JWT secret not configured or is empty.");
                return null;
            }
            try {
                byte[] keyBytes = Base64.getDecoder().decode(SECRET);
                signingKey = Keys.hmacShaKeyFor(keyBytes);
            } catch (IllegalArgumentException e) {
                logger.error("Failed to decode JWT secret: {}", e.getMessage());
                return null;
            }
        }
        return signingKey;
    }

    public static Claims decode(String token) {
        if (token == null || token.isEmpty()) {
            logger.error("Attempted to decode a null or empty JWT token.");
            return null;
        }

        Key key = getSigningKey();
        if (key == null) return null;

        try {
            JwtParser parser = Jwts.parserBuilder().setSigningKey(key).build();
            return parser.parseClaimsJws(token).getBody();
        } catch (SignatureException e) {
            logger.error("JWT signature validation failed: {}", e.getMessage());
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            logger.error("JWT has expired: {}", e.getMessage());
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            logger.error("JWT is malformed: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("General JWT decoding error: {} - {}", e.getClass().getSimpleName(), e.getMessage());
        }
        return null;
    }

    public static String getUsername(String token) {
        Claims claims = decode(token);
        return (claims != null) ? claims.getSubject() : null;
    }
}
