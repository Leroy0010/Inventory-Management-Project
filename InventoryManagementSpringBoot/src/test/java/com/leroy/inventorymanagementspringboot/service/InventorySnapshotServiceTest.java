package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import com.leroy.inventorymanagementspringboot.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventorySnapshotServiceTest {

    @Mock
    private InventoryBalanceRepository balanceRepository;
    
    @Mock
    private InventoryItemRepository itemRepository;
    
    @Mock
    private StockTransactionRepository transactionRepository;
    
    @Mock
    private FifoCostCalculator fifoCalculator;
    
    @Mock
    private AverageCostCalculator avgCalculator;
    
    private InventorySnapshotService snapshotService;
    
    private InventoryItem testItem;
    private Department testDepartment;
    
    @BeforeEach
    void setUp() {
        snapshotService = new InventorySnapshotService(
            balanceRepository, itemRepository, transactionRepository, 
            fifoCalculator, avgCalculator
        );
        
        // Setup test data
        testDepartment = new Department();
        testDepartment.setId(1);
        testDepartment.setName("Test Department");
        
        testItem = new InventoryItem();
        testItem.setId(1);
        testItem.setName("Test Item");
        testItem.setUnit("pieces");
        testItem.setDepartment(testDepartment);
    }
    
    @Test
    void testCalculateQuantityDelta() {
        // Given
        LocalDate snapshotDate = LocalDate.of(2024, 1, 1);
        LocalDate startDate = LocalDate.of(2024, 2, 1);
        
        StockTransaction inTransaction = new StockTransaction();
        inTransaction.setTransactionType(StockTransactionType.IN);
        inTransaction.setQuantity(100);
        
        StockTransaction outTransaction = new StockTransaction();
        outTransaction.setTransactionType(StockTransactionType.OUT);
        outTransaction.setQuantity(30);
        
        when(transactionRepository.findByInventoryItemAndTransactionDateBetween(
            eq(testItem), any(Timestamp.class), any(Timestamp.class)
        )).thenReturn(Arrays.asList(inTransaction, outTransaction));
        
        // When
        int delta = snapshotService.calculateQuantityDelta(testItem, snapshotDate, startDate);
        
        // Then
        assertEquals(70, delta); // 100 - 30 = 70
    }
    
    @Test
    void testCalculateValueDelta() {
        // Given
        LocalDate snapshotDate = LocalDate.of(2024, 1, 1);
        LocalDate startDate = LocalDate.of(2024, 2, 1);
        CostFlowMethod method = CostFlowMethod.FIFO;
        
        StockTransaction inTransaction = new StockTransaction();
        inTransaction.setTransactionType(StockTransactionType.IN);
        inTransaction.setQuantity(100);
        inTransaction.setUnitPrice(new BigDecimal("10.00"));
        
        when(transactionRepository.findByInventoryItemAndTransactionDateBetween(
            eq(testItem), any(Timestamp.class), any(Timestamp.class)
        )).thenReturn(Arrays.asList(inTransaction));
        
        // No need to mock this for the test
        
        // When
        BigDecimal delta = snapshotService.calculateValueDelta(
            testItem, testDepartment, snapshotDate, startDate, method
        );
        
        // Then
        assertEquals(new BigDecimal("1000.00"), delta); // 100 * 10.00 = 1000.00
    }
    
    @Test
    void testGenerateSnapshotsForDate() {
        // Given
        LocalDate snapshotDate = LocalDate.of(2024, 12, 31);
        List<InventoryItem> items = Arrays.asList(testItem);
        
        when(itemRepository.findAll()).thenReturn(items);
        when(transactionRepository.getBalanceBefore(
            eq(testItem.getId()), any(Timestamp.class)
        )).thenReturn(500);
        
        when(transactionRepository.findByInventoryItemAndTransactionDateBetween(
            eq(testItem), any(Timestamp.class), any(Timestamp.class)
        )).thenReturn(Arrays.asList());
        
        when(balanceRepository.existsByInventoryItemAndDepartmentAndSnapshotDateAndMethod(
            eq(testItem), eq(testDepartment), eq(java.sql.Date.valueOf(snapshotDate)), any(CostFlowMethod.class)
        )).thenReturn(false);
        
        // When
        snapshotService.generateSnapshotsForDate(snapshotDate);
        
        // Then
        verify(balanceRepository, times(2)).save(any(InventoryBalance.class)); // FIFO + AVG
    }
    
    @Test
    void testCalculateQuantitySnapshot() {
        // Given
        LocalDate snapshotDate = LocalDate.of(2024, 12, 31);
        
        when(transactionRepository.getBalanceBefore(
            eq(testItem.getId()), any(Timestamp.class)
        )).thenReturn(1000);
        
        // When
        int quantity = snapshotService.calculateQuantitySnapshot(testItem, snapshotDate);
        
        // Then
        assertEquals(1000, quantity);
    }
    
    @Test
    void testCalculateValueSnapshotFifo() {
        // Given
        LocalDate snapshotDate = LocalDate.of(2024, 12, 31);
        CostFlowMethod method = CostFlowMethod.FIFO;
        
        StockTransaction transaction = new StockTransaction();
        transaction.setTransactionType(StockTransactionType.IN);
        transaction.setQuantity(100);
        transaction.setUnitPrice(new BigDecimal("5.00"));
        
        when(transactionRepository.findByInventoryItemAndTransactionDateBetween(
            eq(testItem), any(Timestamp.class), any(Timestamp.class)
        )).thenReturn(Arrays.asList(transaction));
        
        // When
        BigDecimal value = snapshotService.calculateValueSnapshot(testItem, testDepartment, snapshotDate, method);
        
        // Then
        assertEquals(new BigDecimal("500.00"), value); // 100 * 5.00 = 500.00
    }
    
    @Test
    void testCalculateValueSnapshotAverage() {
        // Given
        LocalDate snapshotDate = LocalDate.of(2024, 12, 31);
        CostFlowMethod method = CostFlowMethod.AVG;
        
        StockTransaction transaction1 = new StockTransaction();
        transaction1.setTransactionType(StockTransactionType.IN);
        transaction1.setQuantity(100);
        transaction1.setUnitPrice(new BigDecimal("5.00"));
        
        StockTransaction transaction2 = new StockTransaction();
        transaction2.setTransactionType(StockTransactionType.IN);
        transaction2.setQuantity(200);
        transaction2.setUnitPrice(new BigDecimal("7.00"));
        
        when(transactionRepository.findByInventoryItemAndTransactionDateBetween(
            eq(testItem), any(Timestamp.class), any(Timestamp.class)
        )).thenReturn(Arrays.asList(transaction1, transaction2));
        
        // When
        BigDecimal value = snapshotService.calculateValueSnapshot(testItem, testDepartment, snapshotDate, method);
        
        // Then
        // Average price = (100*5 + 200*7) / (100+200) = 1900/300 = 6.33
        // Total quantity = 300, so value should be 6.33 * 300 = 1900
        assertEquals(new BigDecimal("1900.00"), value);
    }
}
