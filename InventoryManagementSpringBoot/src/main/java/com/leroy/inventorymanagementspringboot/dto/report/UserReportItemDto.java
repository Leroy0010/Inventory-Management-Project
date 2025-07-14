package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserReportItemDto {
    private Integer inventoryCode; // now refers to item ID
    private String inventoryName;
    private int quantityReceived;
    private String unit;

    public UserReportItemDto(int inventoryCode, String inventoryName, String unit, long quantityReceived) {
        this.inventoryCode = inventoryCode;
        this.inventoryName = inventoryName;
        this.unit = unit;
        this.quantityReceived = (int) quantityReceived; // cast if needed
    }
}


