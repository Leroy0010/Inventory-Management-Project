package com.leroy.inventorymanagementspringboot.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
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

    private static final String JWT_ALGORITHM = "HS512"; // Keep HS512 as your chosen algorithm

    private final Logger logger = LogManager.getLogger(JwtUtil.class);

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @PostConstruct
    public void debugKeyLength() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
//        System.out.println("✅ JWT Key length (decoded): " + keyBytes.length + " bytes");
//        logger.info("JWT Key length (decoded): " + keyBytes.length + " bytes");

        // Add a check to warn if the key is too short for HS512
        if (keyBytes.length < 64) {
            System.err.println("❌ WARNING: JWT secret key is too short for HS512 algorithm! Expected at least 64 bytes (512 bits), got " + keyBytes.length + " bytes.");
            logger.warn("JWT secret key is too short for HS512 algorithm! Expected at least 64 bytes (512 bits), got {} bytes.", keyBytes.length);
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
        // Get all roles as a List
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        extraClaims.put("roles", roles); // Store as List

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
//        System.out.println("Validating token for user: " + username + ". Expected: " + userDetails.getUsername());
        logger.debug("Validating token for user: {}. Expected: {}", username, userDetails.getUsername());
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = extractExpiration(token);
        boolean expired = expiration.before(new Date());
        if (expired) {
            System.err.println("❌ Token expired at: " + expiration);
            logger.warn("Token expired at: {}", expiration);
        }
        return expired;
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
        } catch (io.jsonwebtoken.security.SignatureException e) {
            System.err.println("❌ JWT Signature validation failed: " + e.getMessage());
            logger.error("JWT Signature validation failed: {}", e.getMessage());
            throw new RuntimeException("Invalid JWT signature", e);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            System.err.println("❌ JWT token expired: " + e.getMessage());
            logger.error("JWT token expired: {}", e.getMessage());
            throw new RuntimeException("JWT token expired", e);
        } catch (Exception e) {
            System.err.println("❌ Error parsing JWT: " + e.getMessage());
            logger.error("Error parsing JWT: {}", e.getMessage());
            throw new RuntimeException("Error parsing JWT", e);
        }
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        // Corrected check for HS512: needs at least 64 bytes (512 bits)
        if (keyBytes.length < 64) {
            System.err.println("❌ ERROR: Provided JWT secret key is too short for HS512 algorithm! Expected at least 64 bytes, but got " + keyBytes.length + " bytes.");
            // You might want to throw an exception here to prevent the application from running with an insecure key
            throw new IllegalArgumentException("Secret key must be at least 512 bits (64 bytes) for HS512 algorithm. Current length: " + keyBytes.length);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
