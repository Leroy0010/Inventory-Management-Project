package com.leroy.inventorymanagementspringboot.security;

import jakarta.servlet.http.HttpServletRequest;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private static final Logger logger = LogManager.getLogger(JwtHandshakeInterceptor.class);
    private final JwtUtil jwtUtil;

    public JwtHandshakeInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {

        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getServletRequest();
            String authHeader = httpRequest.getHeader(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.error("❌ WebSocket handshake failed: Missing or malformed Authorization header");
                return false;
            }

            String token = authHeader.substring(7);

            try {
                String username = jwtUtil.extractUsername(token);
                // Just check if it's valid — no UserDetails needed here
                jwtUtil.extractAllClaims(token); // Ensures token is valid and not expired

                logger.info("✅ WebSocket handshake passed for user: {}", username);
                attributes.put("username", username);
                return true;

            } catch (Exception e) {
                logger.error("❌ Invalid JWT during WebSocket handshake: {}", e.getMessage());
                return false;
            }
        }

        logger.error("❌ WebSocket handshake failed: Not a ServletServerHttpRequest");
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {
        // No action needed
    }
}
