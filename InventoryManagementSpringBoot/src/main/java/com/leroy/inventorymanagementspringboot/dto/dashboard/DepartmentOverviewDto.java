package com.leroy.inventorymanagementspringboot.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentOverviewDto {
    private Long totalStaff;
    private Long inventoryItems;
    private Long pendingRequests;
    private Long lowStockItems;
}

