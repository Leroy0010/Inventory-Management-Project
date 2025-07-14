package com.leroy.inventorymanagementspringboot.report;

import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.entity.StockTransaction;
import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import com.leroy.inventorymanagementspringboot.repository.StockTransactionRepository;
import com.leroy.inventorymanagementspringboot.service.report.calculator.AverageCostCalculator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

@ExtendWith(MockitoExtension.class)
class AverageCostCalculatorTest {

    @Mock
    private StockTransactionRepository transactionRepo;

    @InjectMocks
    private AverageCostCalculator calculator;

    @Test
    void testCalculateIssuedValue() {
        InventoryItem item = new InventoryItem();
        Department dept = new Department();
        LocalDate start = LocalDate.of(2024, 1, 1);
        LocalDate end = LocalDate.of(2024, 1, 31);

        List<StockTransaction> issued = List.of(
                createTx("ISSUED", 3, new BigDecimal("10")),
                createTx("ISSUED", 2, new BigDecimal("10"))
        );

        List<StockTransaction> allBefore = List.of(
                createTx("RECEIVED", 5, new BigDecimal("10")),
                createTx("RECEIVED", 5, new BigDecimal("20"))
        );

        Mockito.when(transactionRepo.findByInventoryItemAndTransactionDateBetween(
                        eq(item), any(), any()))
                .thenReturn(issued) // for issued
                .thenReturn(allBefore); // for allBefore

        BigDecimal result = calculator.calculateIssuedValue(item, dept, start, end);

        // avg = (5×10 + 5×20) / 10 = 15
        // total issued qty = 5, value = 5×15 = 75
        assertEquals(new BigDecimal("75.00"), result);
    }

    private StockTransaction createTx(String type, int qty, BigDecimal price) {
        StockTransaction tx = new StockTransaction();
        tx.setTransactionType(StockTransactionType.valueOf(type));
        tx.setQuantity(qty);
        tx.setUnitPrice(price);
        return tx;
    }
}

