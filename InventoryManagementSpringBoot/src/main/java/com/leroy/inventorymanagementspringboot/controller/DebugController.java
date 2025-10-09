package com.leroy.inventorymanagementspringboot.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class DebugController {

    private static final Logger logger = LogManager.getLogger(DebugController.class);
    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/session")
    public Map<String, Object> getSessionInfo(HttpServletRequest request) {
        String sessionId = request.getSession(false) != null ? request.getSession(false).getId() : "no-session";

        // Check sessions in database
        List<Map<String, Object>> sessions = jdbcTemplate.queryForList(
                "SELECT session_id, creation_time, last_access_time, principal_name FROM spring_session ORDER BY last_access_time DESC LIMIT 10"
        );

        List<Map<String, Object>> sessionAttributes = jdbcTemplate.queryForList(
                "SELECT s.session_id, a.attribute_name FROM spring_session s " +
                        "LEFT JOIN spring_session_attributes a ON s.primary_id = a.session_primary_id " +
                        "ORDER BY s.last_access_time DESC LIMIT 10"
        );

        logger.info("Current session ID: {}", sessionId);
        logger.info("Sessions in database: {}", sessions.size());

        return Map.of(
                "currentSessionId", sessionId,
                "sessionsInDatabase", sessions,
                "sessionAttributes", sessionAttributes
        );
    }

    @GetMapping("/cleanup-sessions")
    public Map<String, String> cleanupSessions() {
        int deleted = jdbcTemplate.update("DELETE FROM spring_session WHERE expiry_time < ?",
                System.currentTimeMillis());
        logger.info("Cleaned up {} expired sessions", deleted);
        return Map.of("message", "Cleaned up " + deleted + " expired sessions");
    }
}