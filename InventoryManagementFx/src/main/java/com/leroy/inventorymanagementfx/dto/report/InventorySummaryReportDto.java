package com.leroy.inventorymanagementfx.dto.report;

import java.util.List;

/**
 * DTO for the overall Inventory Summary Report.
 * Mirrors the backend DTO structure.
 */
public class InventorySummaryReportDto {
    private String departmentName;
    private String reportPeriod; // e.g., "2023", "2020 - 2023", "Jan 1 - Mar 31"
    private String reportType;   // "Quantity" or "Value (FIFO)"
    private List<InventorySummaryItemDto> summaryItems;

    // Default constructor for Jackson and JavaFX PropertyValueFactory
    public InventorySummaryReportDto() {
    }

    public InventorySummaryReportDto(String departmentName, String reportPeriod, String reportType,
                                     List<InventorySummaryItemDto> summaryItems) {
        this.departmentName = departmentName;
        this.reportPeriod = reportPeriod;
        this.reportType = reportType;
        this.summaryItems = summaryItems;
    }

    // Getters
    public String getDepartmentName() {
        return departmentName;
    }

    public String getReportPeriod() {
        return reportPeriod;
    }

    public String getReportType() {
        return reportType;
    }

    public List<InventorySummaryItemDto> getSummaryItems() {
        return summaryItems;
    }

    // Setters
    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public void setReportPeriod(String reportPeriod) {
        this.reportPeriod = reportPeriod;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public void setSummaryItems(List<InventorySummaryItemDto> summaryItems) {
        this.summaryItems = summaryItems;
    }
}
