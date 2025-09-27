package com.leroy.inventorymanagementspringboot.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class InventoryBatchResponseDto {
    private long id;
    private int quantity;
    private BigDecimal unitPrice;
    private int remainingQuantity;
    private int inventoryItemId;
    private String inventoryItemName;
    private String supplierName;
    private String invoiceId;
    private LocalDateTime batchDate;
}
