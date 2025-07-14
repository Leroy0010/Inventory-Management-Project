package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TransactionReportDto {
    private Integer itemId;
    private String itemName;
    private String unitOfMeasurement;
    private List<TransactionDto> transactions;
    private int totalReceived;
    private int totalIssued;
    private int netChange;
}
