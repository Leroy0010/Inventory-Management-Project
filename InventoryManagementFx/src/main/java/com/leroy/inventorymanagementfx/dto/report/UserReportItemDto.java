package com.leroy.inventorymanagementfx.dto.report;

/**
 * DTO for individual item details within a user report.
 * Mirrors the backend DTO structure.
 */
public class UserReportItemDto {
    private Integer inventoryCode; // now refers to item ID
    private String inventoryName;
    private int quantityReceived;
    private String unit;

    // Default constructor for Jackson and JavaFX PropertyValueFactory
    public UserReportItemDto() {
    }

    public UserReportItemDto(Integer inventoryCode, String inventoryName, String unit, int quantityReceived) {
        this.inventoryCode = inventoryCode;
        this.inventoryName = inventoryName;
        this.unit = unit;
        this.quantityReceived = quantityReceived;
    }

    // Getters
    public Integer getInventoryCode() {
        return inventoryCode;
    }

    public String getInventoryName() {
        return inventoryName;
    }

    public int getQuantityReceived() {
        return quantityReceived;
    }

    public String getUnit() {
        return unit;
    }

    // Setters
    public void setInventoryCode(Integer inventoryCode) {
        this.inventoryCode = inventoryCode;
    }

    public void setInventoryName(String inventoryName) {
        this.inventoryName = inventoryName;
    }

    public void setQuantityReceived(int quantityReceived) {
        this.quantityReceived = quantityReceived;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}