package com.leroy.inventorymanagementspringboot.exception;

public class DepartmentCreationException extends RuntimeException {
    public DepartmentCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}