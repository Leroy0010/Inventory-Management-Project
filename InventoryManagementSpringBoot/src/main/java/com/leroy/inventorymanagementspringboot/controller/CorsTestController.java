package com.leroy.inventorymanagementspringboot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cors-test")
public class CorsTestController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> testCorsGet(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "CORS GET request successful");
        response.put("method", request.getMethod());
        response.put("origin", request.getHeader("Origin"));
        response.put("userAgent", request.getHeader("User-Agent"));
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> testCorsPost(
            @RequestBody(required = false) Map<String, Object> body,
            HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "CORS POST request successful");
        response.put("method", request.getMethod());
        response.put("origin", request.getHeader("Origin"));
        response.put("contentType", request.getContentType());
        response.put("body", body);
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}


