package com.leroy.inventorymanagementspringboot.dto.report;

import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import com.leroy.inventorymanagementspringboot.enums.InventorySummaryType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class InventorySummaryReportRequest {
    // Flexible date options
    private Integer year;               // Optional
    private Integer startYear;          // Optional (for year range)
    private Integer endYear;            // Optional (for year range)
    private LocalDateTime startDate;        // Optional
    private LocalDateTime endDate;          // Optional

    // Required
    private InventorySummaryType inventorySummaryType;      // QUANTITY or VALUE

    // Only required if reportType == VALUE
    private CostFlowMethod costFlowMethod;
}
