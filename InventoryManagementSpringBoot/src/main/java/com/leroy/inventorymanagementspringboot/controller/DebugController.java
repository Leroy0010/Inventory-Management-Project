package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    private final CookieUtil cookieUtil;
    private static final Logger logger = LogManager.getLogger(DebugController.class);

    public DebugController(CookieUtil cookieUtil) {
        this.cookieUtil = cookieUtil;
    }

    @GetMapping("/cookies")
    public ResponseEntity<Map<String, Object>> debugCookies(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();

        // Check if cookies are present
        String jwt = cookieUtil.getJwtFromCookie(request).orElse("NOT_FOUND");
        String refreshToken = cookieUtil.getRefreshTokenFromCookie(request).orElse("NOT_FOUND");

        response.put("jwt_cookie_present", !"NOT_FOUND".equals(jwt));
        response.put("refresh_token_cookie_present", !"NOT_FOUND".equals(refreshToken));
        response.put("jwt_length", jwt.length());
        response.put("refresh_token_length", refreshToken.length());
        response.put("headers", getHeadersInfo(request));

        logger.info("Cookie debug - JWT: {}, Refresh: {}",
                !"NOT_FOUND".equals(jwt), !"NOT_FOUND".equals(refreshToken));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/test-cookies")
    public ResponseEntity<Map<String, Object>> testCookies(HttpServletResponse response) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Test setting cookies
            cookieUtil.createJwtCookie(response, "test_jwt_token", 300);
            cookieUtil.createRefreshTokenCookie(response, "test_refresh_token", 600);

            result.put("success", true);
            result.put("message", "Test cookies set successfully");
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }

        return ResponseEntity.ok(result);
    }

    private Map<String, String> getHeadersInfo(HttpServletRequest request) {
        Map<String, String> headers = new HashMap<>();
        headers.put("User-Agent", request.getHeader("User-Agent"));
        headers.put("Origin", request.getHeader("Origin"));
        headers.put("Cookie", request.getHeader("Cookie"));
        return headers;
    }
}