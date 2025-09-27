package com.leroy.inventorymanagementspringboot.exception;

/**
 * Custom exception for resource not found errors
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}