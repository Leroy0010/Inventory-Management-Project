package com.leroy.inventorymanagementspringboot.dto;

import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionReportRequest {
    private Integer itemId;
    private Integer year;
    private Integer month; // optional
    private StockTransactionType transactionType; // optional
    private LocalDateTime startDate; // optional
    private LocalDateTime endDate; // optional but required if startDate is present

}