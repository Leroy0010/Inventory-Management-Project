package com.leroy.inventorymanagementspringboot.report;

import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.service.report.calculator.FifoCostCalculator;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.ArgumentMatchers.eq;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

@ExtendWith(MockitoExtension.class)
class FifoCostCalculatorTest {

    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private FifoCostCalculator calculator;

    @Test
    void testCalculateIssuedValue() {
        InventoryItem item = new InventoryItem();
        item.setId(1);
        Department dept = new Department();
        dept.setId(10);
        LocalDate start = LocalDate.of(2024, 1, 1);
        LocalDate end = LocalDate.of(2024, 1, 31);

        Query mockQuery = Mockito.mock(Query.class);
        Mockito.when(entityManager.createNativeQuery(anyString())).thenReturn(mockQuery);

        Mockito.when(mockQuery.setParameter(eq("itemId"), eq(item.getId()))).thenReturn(mockQuery);
        Mockito.when(mockQuery.setParameter(eq("deptId"), eq(dept.getId()))).thenReturn(mockQuery);
        Mockito.when(mockQuery.setParameter(eq("start"), any())).thenReturn(mockQuery);
        Mockito.when(mockQuery.setParameter(eq("end"), any())).thenReturn(mockQuery);

        List<Object[]> results = List.of(
                new Object[]{3, new BigDecimal("5.00")}, // 3 * 5 = 15
                new Object[]{2, new BigDecimal("10.00")} // 2 * 10 = 20
        );

        Mockito.when(mockQuery.getResultList()).thenReturn(results);

        BigDecimal result = calculator.calculateIssuedValue(item, dept, start, end);
        assertEquals(new BigDecimal("35.00"), result);
    }
}

