package com.leroy.inventorymanagementspringboot.report;

import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryItemDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.InventoryBalance;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.entity.StockTransaction;
import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import com.leroy.inventorymanagementspringboot.repository.InventoryBalanceRepository;
import com.leroy.inventorymanagementspringboot.repository.InventoryItemRepository;
import com.leroy.inventorymanagementspringboot.repository.StockTransactionRepository;
import com.leroy.inventorymanagementspringboot.service.report.calculator.AverageCostCalculator;
import com.leroy.inventorymanagementspringboot.service.report.calculator.FifoCostCalculator;
import com.leroy.inventorymanagementspringboot.strategy.ValueSummaryStrategy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ValueSummaryStrategyTest {

    @Mock
    InventoryItemRepository itemRepo;
    @Mock
    InventoryBalanceRepository balanceRepo;
    @Mock
    StockTransactionRepository txRepo;
    @Mock
    FifoCostCalculator fifoCalc;
    @Mock
    AverageCostCalculator avgCalc;

    @InjectMocks
    ValueSummaryStrategy strategy;

    @Test
    void testGenerateReport_withFIFO() {
        Department dept = new Department();
        dept.setId(1);
        LocalDate start = LocalDate.of(2024, 1, 1);
        LocalDate end = LocalDate.of(2024, 1, 31);

        InventoryItem item = new InventoryItem();
        item.setId(1);
        item.setName("Microscope");
        item.setUnit("pieces");

        when(itemRepo.findAllByDepartment(dept)).thenReturn(Optional.of(List.of(item)));
        when(balanceRepo.findTopByInventoryItemAndDepartmentAndSnapshotDateBeforeOrderBySnapshotDateDesc(any(), any(), any()))
                .thenReturn(Optional.of(new InventoryBalance(item, dept, 5, new BigDecimal("5000"), Date.valueOf("2023-12-31"))));
        when(txRepo.findByInventoryItemAndTransactionDateBetween(any(), any(), any()))
                .thenReturn(List.of(
                        new StockTransaction(item, StockTransactionType.RECEIVED, 10, new BigDecimal("900"), Timestamp.valueOf("2024-01-10 00:00:00"))));


        when(fifoCalc.calculateIssuedValue(item, dept, start, end)).thenReturn(new BigDecimal("4800"));

        List<InventorySummaryItemDto> report = strategy.generateReport(start, end, dept, CostFlowMethod.FIFO);

        assertEquals(1, report.size());
        InventorySummaryItemDto dto = report.getFirst();
        assertEquals(new BigDecimal("5000"), dto.getValueBroughtForward());
        assertEquals(new BigDecimal("9000"), dto.getValueReceived());
        assertEquals(new BigDecimal("4800"), dto.getValueIssued());
        assertEquals(new BigDecimal("9200"), dto.getValueCarriedForward());
    }
}

