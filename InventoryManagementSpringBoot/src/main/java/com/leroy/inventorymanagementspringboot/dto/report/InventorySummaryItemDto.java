package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
public class InventorySummaryItemDto {
    private Integer inventoryId;
    private String inventoryName;
    private String unit;

    // Quantity fields (used if reportType == QUANTITY)
    private Integer quantityBroughtForward;
    private Integer quantityReceived;
    private Integer quantityIssued;
    private Integer quantityCarriedForward;

    // Value fields (used if reportType == VALUE)
    private BigDecimal valueBroughtForward;
    private BigDecimal valueReceived;
    private BigDecimal valueIssued;
    private BigDecimal valueCarriedForward;
}
