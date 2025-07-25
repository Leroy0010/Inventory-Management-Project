package com.leroy.inventorymanagementfx.dto.dashboard;

/**
        * DTO for displaying aggregated inventory summary data on the dashboard.
        * This mirrors a potential backend DTO.
        */
public class InventorySummaryDto {
    private long totalItemsInStock;
    private long itemsBelowReorderLevel;
    private long issuedToday;
    private long issuedThisMonth;
    private long receivedToday;
    private long receivedThisMonth;
    private long totalStaffInDepartment; // New field
    private long totalOfficesInDepartment; // New field

    // Default constructor for Jackson and JavaFX PropertyValueFactory
    public InventorySummaryDto() {
    }

    public InventorySummaryDto(long totalItemsInStock, long itemsBelowReorderLevel,
                               long issuedToday, long issuedThisMonth,
                               long receivedToday, long receivedThisMonth,
                               long totalStaffInDepartment, long totalOfficesInDepartment) {
        this.totalItemsInStock = totalItemsInStock;
        this.itemsBelowReorderLevel = itemsBelowReorderLevel;
        this.issuedToday = issuedToday;
        this.issuedThisMonth = issuedThisMonth;
        this.receivedToday = receivedToday;
        this.receivedThisMonth = receivedThisMonth;
        this.totalStaffInDepartment = totalStaffInDepartment;
        this.totalOfficesInDepartment = totalOfficesInDepartment;
    }

    // Getters
    public long getTotalItemsInStock() {
        return totalItemsInStock;
    }

    public long getItemsBelowReorderLevel() {
        return itemsBelowReorderLevel;
    }

    public long getIssuedToday() {
        return issuedToday;
    }

    public long getIssuedThisMonth() {
        return issuedThisMonth;
    }

    public long getReceivedToday() {
        return receivedToday;
    }

    public long getReceivedThisMonth() {
        return receivedThisMonth;
    }

    public long getTotalStaffInDepartment() {
        return totalStaffInDepartment;
    }

    public long getTotalOfficesInDepartment() {
        return totalOfficesInDepartment;
    }

    // Setters (for PropertyValueFactory or if data is mutable)
    public void setTotalItemsInStock(long totalItemsInStock) {
        this.totalItemsInStock = totalItemsInStock;
    }

    public void setItemsBelowReorderLevel(long itemsBelowReorderLevel) {
        this.itemsBelowReorderLevel = itemsBelowReorderLevel;
    }

    public void setIssuedToday(long issuedToday) {
        this.issuedToday = issuedToday;
    }

    public void setIssuedThisMonth(long issuedThisMonth) {
        this.issuedThisMonth = issuedThisMonth;
    }

    public void setReceivedToday(long receivedToday) {
        this.receivedToday = receivedToday;
    }

    public void setReceivedThisMonth(long receivedThisMonth) {
        this.receivedThisMonth = receivedThisMonth;
    }

    public void setTotalStaffInDepartment(long totalStaffInDepartment) {
        this.totalStaffInDepartment = totalStaffInDepartment;
    }

    public void setTotalOfficesInDepartment(long totalOfficesInDepartment) {
        this.totalOfficesInDepartment = totalOfficesInDepartment;
    }
}