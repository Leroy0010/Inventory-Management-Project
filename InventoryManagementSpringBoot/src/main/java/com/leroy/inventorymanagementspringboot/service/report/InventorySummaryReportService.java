package com.leroy.inventorymanagementspringboot.service.report;

import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryItemDto;
import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryReportRequest;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import com.leroy.inventorymanagementspringboot.enums.InventorySummaryType;
import com.leroy.inventorymanagementspringboot.strategy.InventorySummaryStrategy;
import com.leroy.inventorymanagementspringboot.strategy.QuantitySummaryStrategy;
import com.leroy.inventorymanagementspringboot.strategy.ValueSummaryStrategy;
import com.leroy.inventorymanagementspringboot.util.DateRangeUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class InventorySummaryReportService {
    private final QuantitySummaryStrategy quantityStrategy;
    private final ValueSummaryStrategy valueStrategy;

    public InventorySummaryReportService(QuantitySummaryStrategy quantityStrategy,
                                         ValueSummaryStrategy valueStrategy) {
        this.quantityStrategy = quantityStrategy;
        this.valueStrategy = valueStrategy;
    }

    public List<InventorySummaryItemDto> generateReport(InventorySummaryReportRequest request, Department department, CostFlowMethod method) {
        LocalDate[] range = DateRangeUtil.resolveDateRange(request);
        LocalDate start = range[0];
        LocalDate end = range[1];

        InventorySummaryStrategy strategy;

        if (request.getInventorySummaryType() == InventorySummaryType.BY_QUANTITY) {
            strategy = quantityStrategy;
            method = null;
        } else {
            strategy = valueStrategy;
        }

        return strategy.generateReport(start, end, department, method);
    }
}

