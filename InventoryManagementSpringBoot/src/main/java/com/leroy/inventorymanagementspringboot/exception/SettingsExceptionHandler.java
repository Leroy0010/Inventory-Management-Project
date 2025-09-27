package com.leroy.inventorymanagementspringboot.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for User Settings API
 * Provides consistent error responses and proper HTTP status codes
 */
@RestControllerAdvice
@Slf4j
public class SettingsExceptionHandler {

    /**
     * Handle validation errors from @Valid annotations
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {

        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        response.put("error", "Validation Failed");
        response.put("message", "Invalid input data");
        response.put("validationErrors", errors);
        response.put("timestamp", LocalDateTime.now());
        response.put("path", request.getDescription(false).replace("uri=", ""));

        log.warn("Validation error: {}", errors);
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handle illegal argument exceptions
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Bad Request");
        response.put("message", ex.getMessage());
        response.put("timestamp", LocalDateTime.now());
        response.put("path", request.getDescription(false).replace("uri=", ""));

        log.warn("Illegal argument: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handle authentication exceptions
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(
            AuthenticationException ex, WebRequest request) {

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Unauthorized");
        response.put("message", "Authentication required");
        response.put("timestamp", LocalDateTime.now());
        response.put("path", request.getDescription(false).replace("uri=", ""));

        log.warn("Authentication error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /**
     * Handle access denied exceptions
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(
            AccessDeniedException ex, WebRequest request) {

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Forbidden");
        response.put("message", "Access denied. Insufficient permissions.");
        response.put("timestamp", LocalDateTime.now());
        response.put("path", request.getDescription(false).replace("uri=", ""));

        log.warn("Access denied: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    /**
     * Handle resource not found exceptions
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Not Found");
        response.put("message", ex.getMessage());
        response.put("timestamp", LocalDateTime.now());
        response.put("path", request.getDescription(false).replace("uri=", ""));

        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.notFound().build();
    }

    /**
     * Handle settings-specific exceptions
     */
    @ExceptionHandler(SettingsException.class)
    public ResponseEntity<Map<String, Object>> handleSettingsException(
            SettingsException ex, WebRequest request) {

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Settings Error");
        response.put("message", ex.getMessage());
        response.put("timestamp", LocalDateTime.now());
        response.put("path", request.getDescription(false).replace("uri=", ""));

        log.error("Settings error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle generic runtime exceptions
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex, WebRequest request) {

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Internal Server Error");
        response.put("message", "An unexpected error occurred");
        response.put("timestamp", LocalDateTime.now());
        response.put("path", request.getDescription(false).replace("uri=", ""));

        log.error("Runtime error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(
            Exception ex, WebRequest request) {

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Internal Server Error");
        response.put("message", "An unexpected error occurred");
        response.put("timestamp", LocalDateTime.now());
        response.put("path", request.getDescription(false).replace("uri=", ""));

        log.error("Unexpected error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
