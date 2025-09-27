package com.leroy.inventorymanagementspringboot.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "inventory_batches")
public class InventoryBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "item_id")
    private InventoryItem inventoryItem;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, name = "remaining_quantity")
    private int remainingQuantity;

    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "batch_date")
    private LocalDateTime batchDate;

    @Column(name = "supplier_name")
    private String supplierName;

    @Column(name = "invoice_id")
    private String invoiceId;

    public InventoryBatch(InventoryItem inventoryItem, int quantity, BigDecimal unitPrice) {
        this.inventoryItem = inventoryItem;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.batchDate = LocalDateTime.now();
    }

    public InventoryBatch() {
    }

    @Override
    public String toString() {
        return "InventoryBatch{" +
                "id=" + id +
                ", inventoryItem=" + inventoryItem +
                ", quantity=" + quantity +
                ", remainingQuantity=" + remainingQuantity +
                ", unitPrice=" + unitPrice +
                ", batchDate=" + batchDate +
                '}';
    }
}
