package com.leroy.inventorymanagementspringboot.dto.dashboard;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventorySummaryDto {
    private long totalItemsInStock;
    private long itemsBelowReorderLevel;
    private long issuedToday;
    private long issuedThisMonth;
    private long receivedToday;
    private long receivedThisMonth;
    private long totalStaffInDepartment; // New field
    private long totalOfficesInDepartment; // New field

    // Default constructor for Spring/Jackson
    public InventorySummaryDto() {
    }

    public InventorySummaryDto(long totalItemsInStock, long itemsBelowReorderLevel,
                               long issuedToday, long issuedThisMonth,
                               long receivedToday, long receivedThisMonth,
                               long totalStaffInDepartment, long totalOfficesInDepartment) {
        this.totalItemsInStock = totalItemsInStock;
        this.itemsBelowReorderLevel = itemsBelowReorderLevel;
        this.issuedToday = issuedToday;
        this.issuedThisMonth = issuedThisMonth;
        this.receivedToday = receivedToday;
        this.receivedThisMonth = receivedThisMonth;
        this.totalStaffInDepartment = totalStaffInDepartment;
        this.totalOfficesInDepartment = totalOfficesInDepartment;
    }
}
