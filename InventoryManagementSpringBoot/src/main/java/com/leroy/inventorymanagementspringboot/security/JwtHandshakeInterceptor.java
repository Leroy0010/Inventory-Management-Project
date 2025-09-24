package com.leroy.inventorymanagementspringboot.security;

import com.leroy.inventorymanagementspringboot.util.CookieUtil;
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
import java.util.Optional;

public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private static final Logger logger = LogManager.getLogger(JwtHandshakeInterceptor.class);
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;

    public JwtHandshakeInterceptor(JwtUtil jwtUtil, CookieUtil cookieUtil) {
        this.jwtUtil = jwtUtil;
        this.cookieUtil = cookieUtil;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {

        logger.debug("WebSocket handshake attempt from: {}", request.getRemoteAddress());

        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getServletRequest();

            // 1. Try Authorization header
            String token = null;
            String authHeader = httpRequest.getHeader(HttpHeaders.AUTHORIZATION);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                logger.debug("JWT found in Authorization header, length: {}", token.length());
            }

            // 2. If no header, try JWT cookie
            if (token == null) {
                Optional<String> jwtFromCookie = cookieUtil.getJwtFromCookie(httpRequest);
                if (jwtFromCookie.isPresent()) {
                    token = jwtFromCookie.get();
                    logger.debug("JWT found in cookie, length: {}", token.length());
                }
            }

            if (token == null) {
                logger.error("❌ WebSocket handshake failed: No JWT found in header or cookie");
                return false;
            }

            try {
                String username = jwtUtil.extractUsername(token);
                jwtUtil.extractAllClaims(token); // validate (throws if invalid/expired)

                logger.info("✅ WebSocket handshake passed for user: {}", username);
                attributes.put("username", username);
                attributes.put("userId", username); // Add userId for potential use
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
