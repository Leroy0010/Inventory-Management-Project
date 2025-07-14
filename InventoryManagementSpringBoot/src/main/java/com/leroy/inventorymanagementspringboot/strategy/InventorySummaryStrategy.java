package com.leroy.inventorymanagementspringboot.strategy;

import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryItemDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;

import java.time.LocalDate;
import java.util.List;

public interface InventorySummaryStrategy {
    List<InventorySummaryItemDto> generateReport(LocalDate startDate, LocalDate endDate, Department department, CostFlowMethod method);
}

