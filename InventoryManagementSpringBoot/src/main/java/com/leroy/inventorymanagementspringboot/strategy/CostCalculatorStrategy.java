package com.leroy.inventorymanagementspringboot.strategy;

import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.entity.Department;
import java.math.BigDecimal;
import java.time.LocalDate;

public interface CostCalculatorStrategy {
    BigDecimal calculateIssuedValue(InventoryItem item, Department department, LocalDate start, LocalDate end);
}
