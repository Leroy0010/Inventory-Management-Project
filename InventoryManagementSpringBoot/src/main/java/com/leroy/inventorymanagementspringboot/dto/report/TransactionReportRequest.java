package com.leroy.inventorymanagementspringboot.dto.report;

import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TransactionReportRequest {
    private Integer itemId;
    private Integer year;
    private Integer month; // optional
    private StockTransactionType transactionType; // optional
    private LocalDate startDate; // optional
    private LocalDate endDate; // optional but required if startDate is present

}