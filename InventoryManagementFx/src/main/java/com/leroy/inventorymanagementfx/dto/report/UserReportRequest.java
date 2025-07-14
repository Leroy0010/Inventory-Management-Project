package com.leroy.inventorymanagementfx.dto.report;

import java.time.LocalDate; // Keep LocalDate for consistency with other reports if needed, though not directly used here.

/**
 * DTO for requesting user reports.
 * Mirrors the backend DTO structure.
 */
public class UserReportRequest {
    private Integer userId;
    private Integer year;

    // Default constructor for Jackson
    public UserReportRequest() {
    }

    // All-args constructor for convenience in controller
    public UserReportRequest(Integer userId, Integer year) {
        this.userId = userId;
        this.year = year;
    }

    // Getters
    public Integer getUserId() {
        return userId;
    }

    public Integer getYear() {
        return year;
    }

    // Setters
    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public void setYear(Integer year) {
        this.year = year;
    }
}