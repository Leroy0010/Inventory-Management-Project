package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserReportItemDto {
    private Integer itemId;
    private String itemName;
    private int quantityReceived;
    private String unit;

    public UserReportItemDto(int itemId, String itemName, String unit, long quantityReceived) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.unit = unit;
        this.quantityReceived = (int) quantityReceived; // cast if needed
    }
}
