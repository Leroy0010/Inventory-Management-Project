package com.leroy.inventorymanagementspringboot.dto.report;

import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionDto {
    private LocalDateTime date;
    private StockTransactionType transactionType;
    private int quantity;
    private String supplier;
    private String invoiceId;
    private String receiver;
    private int balance;
}