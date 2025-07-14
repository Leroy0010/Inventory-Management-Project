package com.leroy.inventorymanagementfx.dto.report;

import com.leroy.inventorymanagementfx.enums.StockTransactionType;

import java.sql.Timestamp; // Changed from java.time.LocalDate

/**
 * DTO for individual transaction details.
 */
public class TransactionDto {
    private Timestamp date; // Changed from transactionDate and type LocalDate
    private StockTransactionType transactionType;
    private int quantity;
    private String supplier; // New field
    private String invoiceId; // New field
    private String receiver; // New field
    private int balance; // New field

    // Default constructor for JavaFX PropertyValueFactory
    public TransactionDto() {
    }

    public TransactionDto(Timestamp date, StockTransactionType transactionType, int quantity,
                          String supplier, String invoiceId, String receiver, int balance) {
        this.date = date;
        this.transactionType = transactionType;
        this.quantity = quantity;
        this.supplier = supplier;
        this.invoiceId = invoiceId;
        this.receiver = receiver;
        this.balance = balance;
    }

    // Getters
    public Timestamp getDate() {
        return date;
    }

    public StockTransactionType getTransactionType() {
        return transactionType;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getSupplier() {
        return supplier;
    }

    public String getInvoiceId() {
        return invoiceId;
    }

    public String getReceiver() {
        return receiver;
    }

    public int getBalance() {
        return balance;
    }

    // Setters
    public void setDate(Timestamp date) {
        this.date = date;
    }

    public void setTransactionType(StockTransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

    public void setInvoiceId(String invoiceId) {
        this.invoiceId = invoiceId;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public void setBalance(int balance) {
        this.balance = balance;
    }
}