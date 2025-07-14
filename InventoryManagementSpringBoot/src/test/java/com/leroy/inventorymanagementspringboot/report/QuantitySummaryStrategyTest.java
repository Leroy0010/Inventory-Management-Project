package com.leroy.inventorymanagementspringboot.report;

import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryItemDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.InventoryBalance;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.entity.StockTransaction;
import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import com.leroy.inventorymanagementspringboot.repository.InventoryBalanceRepository;
import com.leroy.inventorymanagementspringboot.repository.InventoryItemRepository;
import com.leroy.inventorymanagementspringboot.repository.StockTransactionRepository;
import com.leroy.inventorymanagementspringboot.strategy.QuantitySummaryStrategy;
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
class QuantitySummaryStrategyTest {

    @Mock
    InventoryItemRepository itemRepo;

    @Mock
    InventoryBalanceRepository balanceRepo;

    @Mock
    StockTransactionRepository txRepo;

    @InjectMocks
    QuantitySummaryStrategy strategy;

    @Test
    void testGenerateReport_whenSnapshotExists() {
        Department dept = new Department();
        LocalDate start = LocalDate.of(2024, 1, 1);
        LocalDate end = LocalDate.of(2024, 1, 31);

        InventoryItem item = new InventoryItem();
        item.setId(1);
        item.setName("Microscope");
        item.setUnit("pcs");

        // Mock items for department
        when(itemRepo.findAllByDepartment(dept)).thenReturn(Optional.of(List.of(item)));

        // Mock snapshot (brought forward = 5)
        InventoryBalance balance = new InventoryBalance(item, dept, 5, new BigDecimal("5000"), Date.valueOf("2023-12-31"));
        when(balanceRepo.findTopByInventoryItemAndDepartmentAndSnapshotDateBeforeOrderBySnapshotDateDesc(any(), any(), any()))
                .thenReturn(Optional.of(balance));

        // Mock transactions: RECEIVED = 10, ISSUED = 3 + 2 = 5
        List<StockTransaction> transactions = List.of(
                new StockTransaction(item, StockTransactionType.RECEIVED, 10, BigDecimal.ZERO, Timestamp.valueOf("2024-01-10 00:00:00")),
                new StockTransaction(item, StockTransactionType.ISSUED, 3, BigDecimal.ZERO, Timestamp.valueOf("2024-01-20 00:00:00")),
                new StockTransaction(item, StockTransactionType.ISSUED, 2, BigDecimal.ZERO, Timestamp.valueOf("2024-01-25 00:00:00"))
        );
        when(txRepo.findByInventoryItemAndTransactionDateBetween(any(), any(), any()))
                .thenReturn(transactions);

        // Act
        List<InventorySummaryItemDto> report = strategy.generateReport(start, end, dept, null);

        // Assert
        assertEquals(1, report.size());
        InventorySummaryItemDto dto = report.getFirst();
        assertEquals(5, dto.getQuantityBroughtForward());
        assertEquals(10, dto.getQuantityReceived());
        assertEquals(5, dto.getQuantityIssued());
        assertEquals(10, dto.getQuantityCarriedForward()); // 5 + 10 - 5 = 10
    }

    @Test
    void testGenerateReport_whenSnapshotMissing_fallbackToBalanceBefore() {
        Department dept = new Department();
        LocalDate start = LocalDate.of(2024, 1, 1);
        LocalDate end = LocalDate.of(2024, 1, 31);

        InventoryItem item = new InventoryItem();
        item.setId(2);
        item.setName("Beaker");
        item.setUnit("pcs");

        when(itemRepo.findAllByDepartment(dept)).thenReturn(Optional.of(List.of(item)));

        // No snapshot returned
        when(balanceRepo.findTopByInventoryItemAndDepartmentAndSnapshotDateBeforeOrderBySnapshotDateDesc(any(), any(), any()))
                .thenReturn(Optional.empty());

        // Fallback: getBalanceBefore returns 7
        when(txRepo.getBalanceBefore(item.getId(), Timestamp.valueOf(start.atStartOfDay())))
                .thenReturn(7);

        // Transactions
        List<StockTransaction> transactions = List.of(
                new StockTransaction(item, StockTransactionType.RECEIVED, 5, BigDecimal.ZERO, Timestamp.valueOf("2024-01-15 00:00:00")),
                new StockTransaction(item, StockTransactionType.ISSUED, 2, BigDecimal.ZERO, Timestamp.valueOf("2024-01-18 00:00:00"))
        );
        when(txRepo.findByInventoryItemAndTransactionDateBetween(any(), any(), any()))
                .thenReturn(transactions);

        // Act
        List<InventorySummaryItemDto> report = strategy.generateReport(start, end, dept, null);

        // Assert
        assertEquals(1, report.size());
        InventorySummaryItemDto dto = report.getFirst();
        assertEquals(7, dto.getQuantityBroughtForward());
        assertEquals(5, dto.getQuantityReceived());
        assertEquals(2, dto.getQuantityIssued());
        assertEquals(10, dto.getQuantityCarriedForward()); // 7 + 5 - 2 = 10
    }
}
