package com.leroy.inventorymanagementspringboot.entity;

import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Setter @Getter
@Entity
@Table(name = "stock_transactions")
public class StockTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private InventoryItem inventoryItem;


    @Enumerated(EnumType.STRING)
    private StockTransactionType transactionType;


    @Column(nullable = false)
    private int quantity;


    @Column(nullable = false, name = "unit_price")
    private BigDecimal unitPrice;


    @Column(nullable = false, name = "transaction_date")
    private Timestamp transactionDate;

    @ManyToOne
    @JoinColumn(name = "related_request_id")
    private Request request;


    private String supplier;


    @Size(min = 1, max = 20)
    @Column(name = "invoice_id")
    private String invoiceId;


    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;


    @ManyToOne
    @JoinColumn(name = "batch_id")
    private InventoryBatch batch;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    public StockTransaction() {}

    public StockTransaction(InventoryItem item, StockTransactionType transactionType, int quantity, BigDecimal unitPrice, Request request,  String supplier, String invoiceId, InventoryBatch batch, User createdBy) {
        inventoryItem = item;
        this.transactionType = transactionType;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        transactionDate = new Timestamp(System.currentTimeMillis());
        this.request = request;
        this.supplier = supplier;
        this.invoiceId = invoiceId;
        this.batch = batch;
        this.createdBy = createdBy;
        department = createdBy.getRole().getName().equals("STOREKEEPER") ? createdBy.getDepartment() : createdBy.getOffice().getDepartment();

    }

    public StockTransaction(InventoryItem item, StockTransactionType type, int qty, BigDecimal unitPrice, Timestamp date) {
        this.inventoryItem = item;
        this.transactionType = type;
        this.quantity = qty;
        this.unitPrice = unitPrice;
        this.transactionDate = date;
    }


    @Override
    public String toString() {
        return "Item: " + inventoryItem + "Transaction Type: " +
                transactionType + " Quantity: " + quantity +
                " Unit Price: " + unitPrice + " Request: " + request +
                " Batch: " + batch + " Date: " + transactionDate + "Created by: " + createdBy;
    }
}
