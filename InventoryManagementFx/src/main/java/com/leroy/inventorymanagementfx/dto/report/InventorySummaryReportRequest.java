package com.leroy.inventorymanagementfx.dto.report;

import com.leroy.inventorymanagementfx.enums.CostFlowMethod;
import com.leroy.inventorymanagementfx.enums.InventorySummaryType;

import java.time.LocalDate;

/**
 * DTO for requesting an Inventory Summary Report.
 * Mirrors the backend DTO structure.
 */
public class InventorySummaryReportRequest {
    // Flexible date options
    private Integer year;               // Optional
    private Integer startYear;          // Optional (for year range)
    private Integer endYear;            // Optional (for year range)
    private LocalDate startDate;        // Optional
    private LocalDate endDate;          // Optional

    // Required
    private InventorySummaryType inventorySummaryType;      // QUANTITY or VALUE

    // Only required if reportType == VALUE
    private CostFlowMethod costFlowMethod;

    // Default constructor for Jackson
    public InventorySummaryReportRequest() {
    }

    // All-args constructor for convenience
    public InventorySummaryReportRequest(Integer year, Integer startYear, Integer endYear,
                                         LocalDate startDate, LocalDate endDate,
                                         InventorySummaryType inventorySummaryType, CostFlowMethod costFlowMethod) {
        this.year = year;
        this.startYear = startYear;
        this.endYear = endYear;
        this.startDate = startDate;
        this.endDate = endDate;
        this.inventorySummaryType = inventorySummaryType;
        this.costFlowMethod = costFlowMethod;
    }

    // Getters
    public Integer getYear() {
        return year;
    }

    public Integer getStartYear() {
        return startYear;
    }

    public Integer getEndYear() {
        return endYear;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public InventorySummaryType getInventorySummaryType() {
        return inventorySummaryType;
    }

    public CostFlowMethod getCostFlowMethod() {
        return costFlowMethod;
    }

    // Setters
    public void setYear(Integer year) {
        this.year = year;
    }

    public void setStartYear(Integer startYear) {
        this.startYear = startYear;
    }

    public void setEndYear(Integer endYear) {
        this.endYear = endYear;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public void setInventorySummaryType(InventorySummaryType inventorySummaryType) {
        this.inventorySummaryType = inventorySummaryType;
    }

    public void setCostFlowMethod(CostFlowMethod costFlowMethod) {
        this.costFlowMethod = costFlowMethod;
    }
}
