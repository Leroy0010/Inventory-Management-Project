package com.leroy.inventorymanagementspringboot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "inventory_issuance")
public class InventoryIssuance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "requested_item_id")
    private RequestItem requestedItem;

    @ManyToOne
    @JoinColumn(name = "batch_id")
    private InventoryBatch batch;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "issued_at")
    private Timestamp issuedAt;

    public InventoryIssuance() {}

    public InventoryIssuance(RequestItem requestedItem, InventoryBatch batch, int quantity) {
        this.requestedItem = requestedItem;
        this.batch = batch;
        this.quantity = quantity;
        this.issuedAt = new Timestamp(System.currentTimeMillis());
    }

    @Override
    public String toString() {
        return "< Requested Item: " + requestedItem +
                ", Batch ID: " + batch +
                ", Quantity: " + quantity + " > ";
    }
}
