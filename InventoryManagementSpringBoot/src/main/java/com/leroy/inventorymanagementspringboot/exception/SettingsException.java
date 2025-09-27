package com.leroy.inventorymanagementspringboot.exception;

/**
 * Custom exception for settings-related errors
 */
public class SettingsException extends RuntimeException {

    public SettingsException(String message) {
        super(message);
    }

    public SettingsException(String message, Throwable cause) {
        super(message, cause);
    }
}
