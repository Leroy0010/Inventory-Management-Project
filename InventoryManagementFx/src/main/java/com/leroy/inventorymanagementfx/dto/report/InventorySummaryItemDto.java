package com.leroy.inventorymanagementfx.dto.report;

import java.math.BigDecimal;

/**
 * DTO for individual item details within an Inventory Summary Report.
 * Mirrors the backend DTO structure.
 */
public class InventorySummaryItemDto {
    private Integer inventoryId;
    private String inventoryName;
    private String unit;

    // Quantity fields (used if reportType == QUANTITY)
    private Integer quantityBroughtForward;
    private Integer quantityReceived;
    private Integer quantityIssued;
    private Integer quantityCarriedForward;

    // Value fields (used if reportType == VALUE)
    private BigDecimal valueBroughtForward;
    private BigDecimal valueReceived;
    private BigDecimal valueIssued;
    private BigDecimal valueCarriedForward;

    // Default constructor for Jackson and JavaFX PropertyValueFactory
    public InventorySummaryItemDto() {
    }

    // Constructor for Quantity report
    public InventorySummaryItemDto(Integer inventoryId, String inventoryName, String unit,
                                   Integer quantityBroughtForward, Integer quantityReceived,
                                   Integer quantityIssued, Integer quantityCarriedForward) {
        this.inventoryId = inventoryId;
        this.inventoryName = inventoryName;
        this.unit = unit;
        this.quantityBroughtForward = quantityBroughtForward;
        this.quantityReceived = quantityReceived;
        this.quantityIssued = quantityIssued;
        this.quantityCarriedForward = quantityCarriedForward;
    }

    // Constructor for Value report
    public InventorySummaryItemDto(Integer inventoryId, String inventoryName, String unit,
                                   BigDecimal valueBroughtForward, BigDecimal valueReceived,
                                   BigDecimal valueIssued, BigDecimal valueCarriedForward) {
        this.inventoryId = inventoryId;
        this.inventoryName = inventoryName;
        this.unit = unit;
        this.valueBroughtForward = valueBroughtForward;
        this.valueReceived = valueReceived;
        this.valueIssued = valueIssued;
        this.valueCarriedForward = valueCarriedForward;
    }

    // Getters
    public Integer getInventoryId() {
        return inventoryId;
    }

    public String getInventoryName() {
        return inventoryName;
    }

    public String getUnit() {
        return unit;
    }

    public Integer getQuantityBroughtForward() {
        return quantityBroughtForward;
    }

    public Integer getQuantityReceived() {
        return quantityReceived;
    }

    public Integer getQuantityIssued() {
        return quantityIssued;
    }

    public Integer getQuantityCarriedForward() {
        return quantityCarriedForward;
    }

    public BigDecimal getValueBroughtForward() {
        return valueBroughtForward;
    }

    public BigDecimal getValueReceived() {
        return valueReceived;
    }

    public BigDecimal getValueIssued() {
        return valueIssued;
    }

    public BigDecimal getValueCarriedForward() {
        return valueCarriedForward;
    }

    // Setters (for PropertyValueFactory or if data is mutable)
    public void setInventoryId(Integer inventoryId) {
        this.inventoryId = inventoryId;
    }

    public void setInventoryName(String inventoryName) {
        this.inventoryName = inventoryName;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public void setQuantityBroughtForward(Integer quantityBroughtForward) {
        this.quantityBroughtForward = quantityBroughtForward;
    }

    public void setQuantityReceived(Integer quantityReceived) {
        this.quantityReceived = quantityReceived;
    }

    public void setQuantityIssued(Integer quantityIssued) {
        this.quantityIssued = quantityIssued;
    }

    public void setQuantityCarriedForward(Integer quantityCarriedForward) {
        this.quantityCarriedForward = quantityCarriedForward;
    }

    public void setValueBroughtForward(BigDecimal valueBroughtForward) {
        this.valueBroughtForward = valueBroughtForward;
    }

    public void setValueReceived(BigDecimal valueReceived) {
        this.valueReceived = valueReceived;
    }

    public void setValueIssued(BigDecimal valueIssued) {
        this.valueIssued = valueIssued;
    }

    public void setValueCarriedForward(BigDecimal valueCarriedForward) {
        this.valueCarriedForward = valueCarriedForward;
    }
}
