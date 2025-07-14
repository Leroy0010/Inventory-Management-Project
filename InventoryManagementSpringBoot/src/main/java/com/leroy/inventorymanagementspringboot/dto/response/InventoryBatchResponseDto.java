package com.leroy.inventorymanagementspringboot.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter @Setter
public class InventoryBatchResponseDto {
    private long id;
    private int quantity;
    private BigDecimal totalPrice;
    private int remainingQuantity;
    private int inventoryItemId;
    private String inventoryItemName;
    private Timestamp batchDate;
}
