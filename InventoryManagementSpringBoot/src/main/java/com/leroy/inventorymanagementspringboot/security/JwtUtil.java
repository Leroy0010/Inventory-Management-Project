package com.leroy.inventorymanagementspringboot.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.PostConstruct;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    @Value("${jwt.refresh.expiration}")
    private long refreshTokenExpirationMs;

    private static final String JWT_ALGORITHM = "HS512";

    private final Logger logger = LogManager.getLogger(JwtUtil.class);

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @PostConstruct
    public void debugKeyLength() {
        try {
            if (secret == null || secret.trim().isEmpty()) {
                logger.error("JWT secret is not configured! Please set jwt.secret property.");
                throw new IllegalStateException("JWT secret is not configured.");
            }

            byte[] keyBytes = Decoders.BASE64.decode(secret);
            logger.info("JWT Key length (decoded): {} bytes", keyBytes.length);

            // Add a check to warn if the key is too short for HS512
            if (keyBytes.length < 64) {
                logger.error("JWT secret key is too short for HS512 algorithm! Expected at least 64 bytes (512 bits), got {} bytes.", keyBytes.length);
                throw new IllegalArgumentException("Secret key must be at least 512 bits (64 bytes) for HS512 algorithm. Current length: " + keyBytes.length);
            }
        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.error("JWT secret configuration error: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Error validating JWT secret: {}", e.getMessage());
            throw new IllegalStateException("Failed to validate JWT secret: " + e.getMessage(), e);
        }
    }


    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        extraClaims.put("roles", roles);

        return Jwts
                .builder()
                .header().add("alg", JWT_ALGORITHM).and()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSignInKey(), Jwts.SIG.HS512)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        logger.debug("Validating token for user: {}. Expected: {}", username, userDetails.getUsername());
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public String generateRefreshToken() {
        return java.util.UUID.randomUUID().toString();
    }

    public int getRefreshTokenExpirationSeconds() {
        return (int) (refreshTokenExpirationMs / 1000);
    }

    public int getJwtExpirationSeconds() {
        return (int) (jwtExpirationMs / 1000);
    }

    private boolean isTokenExpired(String token) {
        try {
            Date expiration = extractExpiration(token);
            boolean expired = expiration.before(new Date());
            if (expired) {
                logger.warn("Token expired at: {}", expiration);
            }
            return expired;
        } catch (ExpiredJwtException e) {
            logger.warn("Token is expired. Message: {}", e.getMessage());
            return true;
        }
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Claims extractAllClaims(String token) {
        try {
            return Jwts
                    .parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (SignatureException | MalformedJwtException e) {
            logger.error("Invalid JWT signature or format: {}", e.getMessage());
            throw e;
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Error parsing JWT: {}", e.getMessage());
            throw new RuntimeException("Error parsing JWT", e);
        }
    }

    private SecretKey getSignInKey() {
        try {
            if (secret == null || secret.trim().isEmpty()) {
                throw new IllegalStateException("JWT secret is not configured.");
            }

            byte[] keyBytes = Decoders.BASE64.decode(secret);
            if (keyBytes.length < 64) {
                throw new IllegalArgumentException("Secret key must be at least 512 bits (64 bytes) for HS512 algorithm. Current length: " + keyBytes.length);
            }
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.error("JWT secret key configuration error: {}", e.getMessage());
            throw e;
        }
    }
}