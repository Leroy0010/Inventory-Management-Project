package com.leroy.inventorymanagementspringboot.report;

import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryItemDto;
import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryReportRequest;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import com.leroy.inventorymanagementspringboot.enums.InventorySummaryType;
import com.leroy.inventorymanagementspringboot.service.report.InventorySummaryReportService;
import com.leroy.inventorymanagementspringboot.strategy.QuantitySummaryStrategy;
import com.leroy.inventorymanagementspringboot.strategy.ValueSummaryStrategy;
import com.leroy.inventorymanagementspringboot.util.DateRangeUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InventorySummaryReportServiceTest {

    @Mock
    private QuantitySummaryStrategy quantityStrategy;

    @Mock
    private ValueSummaryStrategy valueStrategy;

    @InjectMocks
    private InventorySummaryReportService reportService;

    private Department department;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<InventorySummaryItemDto> mockResults;

    @BeforeEach
    void setUp() {
        department = new Department();
        department.setId(1);
        department.setName("Test Department");

        startDate = LocalDate.of(2024, 1, 1);
        endDate = LocalDate.of(2024, 1, 31);

        // Create mock results
        mockResults = new ArrayList<>();
        InventorySummaryItemDto dto = new InventorySummaryItemDto();
        dto.setInventoryId(1);
        dto.setInventoryName("Test Item");
        dto.setUnit("pieces");
        mockResults.add(dto);
    }

    @Test
    @DisplayName("Should use quantity strategy when report type is BY_QUANTITY")
    void testGenerateReport_QuantityType() {
        // Arrange
        InventorySummaryReportRequest request = new InventorySummaryReportRequest();
        request.setInventorySummaryType(InventorySummaryType.BY_QUANTITY);
        request.setStartDate(startDate);
        request.setEndDate(endDate);

        // Mock DateRangeUtil to return our test dates
        try (MockedStatic<DateRangeUtil> mockedStatic = Mockito.mockStatic(DateRangeUtil.class)) {
            mockedStatic.when(() -> DateRangeUtil.resolveDateRange(request))
                    .thenReturn(new LocalDate[]{startDate, endDate});

            // Mock the strategy response
            when(quantityStrategy.generateReport(eq(startDate), eq(endDate), eq(department), isNull()))
                    .thenReturn(mockResults);

            // Act
            List<InventorySummaryItemDto> result = reportService.generateReport(request, department, CostFlowMethod.FIFO);

            // Assert
            assertEquals(mockResults, result);
            verify(quantityStrategy, times(1)).generateReport(eq(startDate), eq(endDate), eq(department), isNull());
            verify(valueStrategy, times(0)).generateReport(any(), any(), any(), any());
        }
    }

    @Test
    @DisplayName("Should use value strategy with FIFO method when report type is BY_VALUE and cost flow method is FIFO")
    void testGenerateReport_ValueType_FIFO() {
        // Arrange
        InventorySummaryReportRequest request = new InventorySummaryReportRequest();
        request.setInventorySummaryType(InventorySummaryType.BY_VALUE);
        request.setCostFlowMethod(CostFlowMethod.FIFO);
        request.setStartDate(startDate);
        request.setEndDate(endDate);

        // Mock DateRangeUtil to return our test dates
        try (MockedStatic<DateRangeUtil> mockedStatic = Mockito.mockStatic(DateRangeUtil.class)) {
            mockedStatic.when(() -> DateRangeUtil.resolveDateRange(request))
                    .thenReturn(new LocalDate[]{startDate, endDate});

            // Mock the strategy response
            when(valueStrategy.generateReport(eq(startDate), eq(endDate), eq(department), eq(CostFlowMethod.FIFO)))
                    .thenReturn(mockResults);

            // Act
            List<InventorySummaryItemDto> result = reportService.generateReport(request, department, CostFlowMethod.FIFO);

            // Assert
            assertEquals(mockResults, result);
            verify(valueStrategy, times(1)).generateReport(eq(startDate), eq(endDate), eq(department), eq(CostFlowMethod.FIFO));
            verify(quantityStrategy, times(0)).generateReport(any(), any(), any(), any());
        }
    }

    @Test
    @DisplayName("Should use value strategy with AVG method when report type is BY_VALUE and cost flow method is AVG")
    void testGenerateReport_ValueType_AVG() {
        // Arrange
        InventorySummaryReportRequest request = new InventorySummaryReportRequest();
        request.setInventorySummaryType(InventorySummaryType.BY_VALUE);
        request.setCostFlowMethod(CostFlowMethod.AVG);
        request.setStartDate(startDate);
        request.setEndDate(endDate);

        // Mock DateRangeUtil to return our test dates
        try (MockedStatic<DateRangeUtil> mockedStatic = Mockito.mockStatic(DateRangeUtil.class)) {
            mockedStatic.when(() -> DateRangeUtil.resolveDateRange(request))
                    .thenReturn(new LocalDate[]{startDate, endDate});

            // Mock the strategy response
            when(valueStrategy.generateReport(eq(startDate), eq(endDate), eq(department), eq(CostFlowMethod.AVG)))
                    .thenReturn(mockResults);

            // Act
            List<InventorySummaryItemDto> result = reportService.generateReport(request, department, CostFlowMethod.AVG);

            // Assert
            assertEquals(mockResults, result);
            verify(valueStrategy, times(1)).generateReport(eq(startDate), eq(endDate), eq(department), eq(CostFlowMethod.AVG));
            verify(quantityStrategy, times(0)).generateReport(any(), any(), any(), any());
        }
    }

    @Test
    @DisplayName("Should propagate IllegalArgumentException when DateRangeUtil throws it")
    void testGenerateReport_DateRangeUtilException() {
        // Arrange
        InventorySummaryReportRequest request = new InventorySummaryReportRequest();
        request.setInventorySummaryType(InventorySummaryType.BY_VALUE);
        request.setCostFlowMethod(CostFlowMethod.FIFO);
        // Not setting dates to trigger the exception

        // Mock DateRangeUtil to throw an exception
        try (MockedStatic<DateRangeUtil> mockedStatic = Mockito.mockStatic(DateRangeUtil.class)) {
            mockedStatic.when(() -> DateRangeUtil.resolveDateRange(request))
                    .thenThrow(new IllegalArgumentException("You must provide either a year, a year range, or a custom date range."));

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
                reportService.generateReport(request, department, CostFlowMethod.FIFO);
            });

            assertEquals("You must provide either a year, a year range, or a custom date range.", exception.getMessage());

            // Verify that neither strategy was called
            verify(valueStrategy, times(0)).generateReport(any(), any(), any(), any());
            verify(quantityStrategy, times(0)).generateReport(any(), any(), any(), any());
        }
    }
}
