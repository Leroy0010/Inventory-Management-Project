package com.leroy.inventorymanagementspringboot.dto.response;

import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter @Setter
public class StockTransactionResponseDto {
    private long id;
    private int itemId;
    private String itemName;
    private StockTransactionType transactionType;
    private int quantity;
    private BigDecimal unitPrice;
    private Timestamp transactionDate;
    private Long requestId;
    private String supplier;
    private String invoiceId;
    private Long batchId;
    private String createdBy;
}