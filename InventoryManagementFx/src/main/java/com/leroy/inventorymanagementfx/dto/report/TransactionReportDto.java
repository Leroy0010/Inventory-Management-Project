package com.leroy.inventorymanagementfx.dto.report;

import java.util.List;

/**
 * DTO for aggregated transaction report data per item.
 * Mirrors the backend DTO structure.
 */
public class TransactionReportDto {
    private Integer itemId;
    private String itemName;
    private String unitOfMeasurement;
    private List<TransactionDto> transactions; // List of individual transactions for this item
    private int totalReceived;
    private int totalIssued;
    private int netChange;

    // Default constructor for JavaFX PropertyValueFactory
    public TransactionReportDto() {
    }

    public TransactionReportDto(Integer itemId, String itemName, String unitOfMeasurement,
                                List<TransactionDto> transactions, int totalReceived, int totalIssued, int netChange) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.unitOfMeasurement = unitOfMeasurement;
        this.transactions = transactions;
        this.totalReceived = totalReceived;
        this.totalIssued = totalIssued;
        this.netChange = netChange;
    }

    // Getters
    public Integer getItemId() {
        return itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public String getUnitOfMeasurement() {
        return unitOfMeasurement;
    }

    public List<TransactionDto> getTransactions() {
        return transactions;
    }

    public int getTotalReceived() {
        return totalReceived;
    }

    public int getTotalIssued() {
        return totalIssued;
    }

    public int getNetChange() {
        return netChange;
    }

    // Setters (needed for PropertyValueFactory if not using constructor)
    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public void setUnitOfMeasurement(String unitOfMeasurement) {
        this.unitOfMeasurement = unitOfMeasurement;
    }

    public void setTransactions(List<TransactionDto> transactions) {
        this.transactions = transactions;
    }

    public void setTotalReceived(int totalReceived) {
        this.totalReceived = totalReceived;
    }

    public void setTotalIssued(int totalIssued) {
        this.totalIssued = totalIssued;
    }

    public void setNetChange(int netChange) {
        this.netChange = netChange;
    }
}