package com.leroy.inventorymanagementspringboot.entity;

import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Date;

@Entity
@Table(name = "inventory_balances", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "item_id", "snapshot_date", "method", "department_id"
        })
})

public class InventoryBalance {
    @Getter @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Getter @Setter
    @ManyToOne
    @JoinColumn(name = "item_id")
    private InventoryItem inventoryItem;

    @Getter @Setter
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Getter @Setter
    @Column(name = "snapshot_date", nullable = false)
    private Date snapshotDate;

    @Getter @Setter
    @Column(nullable = false)
    private int quantity;

    @Getter @Setter
    @Column(name = "total_value", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalValue;

    @Getter @Setter
    @Column(nullable = false)
    private CostFlowMethod method;

    public InventoryBalance() {}

    public InventoryBalance(InventoryItem inventoryItem, Department department,  Date snapshotDate, int quantity, BigDecimal totalValue, CostFlowMethod method) {
        this.inventoryItem = inventoryItem;
        this.department = department;
        this.snapshotDate = snapshotDate;
        this.quantity = quantity;
        this.totalValue = totalValue;
        this.method = method;
    }


    public InventoryBalance(InventoryItem item, Department dept, int i, BigDecimal bigDecimal, Date date) {
        this.inventoryItem = item;
        this.department = dept;
        this.quantity = i;
        this.totalValue = bigDecimal;
        this.snapshotDate = date;

    }
}
