package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class InventorySummaryReportDto {
    private String departmentName;
    private String reportPeriod; // e.g., "2023", "2020 - 2023", "Jan 1 - Mar 31"
    private String reportType;   // "Quantity" or "Value (FIFO)"
    private List<InventorySummaryItemDto> summaryItems;
}
