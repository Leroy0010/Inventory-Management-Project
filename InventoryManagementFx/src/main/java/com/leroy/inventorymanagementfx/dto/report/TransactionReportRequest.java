package com.leroy.inventorymanagementfx.dto.report;

import com.leroy.inventorymanagementfx.enums.StockTransactionType;

import java.time.LocalDate;

/**
 * DTO for requesting transaction reports.
 * Mirrors the backend DTO structure.
 */
public class TransactionReportRequest {
    private Integer itemId;
    private Integer year;
    private Integer month; // optional
    private StockTransactionType transactionType; // optional
    private LocalDate startDate; // optional
    private LocalDate endDate; // optional but required if startDate is present

    // Default constructor
    public TransactionReportRequest() {
    }
    
    public TransactionReportRequest(Integer itemId, Integer year, Integer month, StockTransactionType type, LocalDate startDate, LocalDate endDate){
        this.itemId = itemId;
        this.year = year;
        this.month = month;
        this.transactionType = type;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters
    public Integer getItemId() {
        return itemId;
    }

    public Integer getYear() {
        return year;
    }

    public Integer getMonth() {
        return month;
    }

    public StockTransactionType getTransactionType() {
        return transactionType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    // Setters
    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public void setTransactionType(StockTransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}