package com.leroy.inventorymanagementspringboot.strategy;


import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryItemDto;
import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import com.leroy.inventorymanagementspringboot.repository.InventoryBalanceRepository;
import com.leroy.inventorymanagementspringboot.repository.InventoryItemRepository;
import com.leroy.inventorymanagementspringboot.repository.StockTransactionRepository;
import com.leroy.inventorymanagementspringboot.service.InventorySnapshotService;
import com.leroy.inventorymanagementspringboot.service.report.calculator.AverageCostCalculator;
import com.leroy.inventorymanagementspringboot.service.report.calculator.FifoCostCalculator;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class ValueSummaryStrategy implements InventorySummaryStrategy {

    private final InventoryItemRepository itemRepo;
    private final InventoryBalanceRepository balanceRepo;
    private final StockTransactionRepository txRepo;
    private final FifoCostCalculator fifoCalc;
    private final AverageCostCalculator avgCalc;
    private final InventorySnapshotService snapshotService;

    public ValueSummaryStrategy(
            InventoryItemRepository itemRepo,
            InventoryBalanceRepository balanceRepo,
            StockTransactionRepository txRepo,
            FifoCostCalculator fifoCalc,
            AverageCostCalculator avgCalc,
            InventorySnapshotService snapshotService) {
        this.itemRepo = itemRepo;
        this.balanceRepo = balanceRepo;
        this.txRepo = txRepo;
        this.fifoCalc = fifoCalc;
        this.avgCalc = avgCalc;
        this.snapshotService = snapshotService;
    }

    @Override
    public List<InventorySummaryItemDto> generateReport(LocalDate start, LocalDate end, Department department, CostFlowMethod method) {
        List<InventoryItem> items = itemRepo.findAllByDepartment(department).orElse(List.of());

        List<InventorySummaryItemDto> summaries = new ArrayList<>();

        CostCalculatorStrategy calculator = method == CostFlowMethod.FIFO ? fifoCalc : avgCalc;

        for (InventoryItem item : items) {
            // Brought Forward: Use snapshot if available, otherwise calculate from transactions
            BigDecimal bf = getBroughtForwardValue(item, department, start, method);

            // Received: Sum of (quantity * unit_price) from stock_transactions where type = 'IN'
            BigDecimal received = txRepo.findByInventoryItemAndTransactionDateBetween(item, 
                            Timestamp.valueOf(start.atStartOfDay()), Timestamp.valueOf(end.plusDays(1).atStartOfDay())).stream()
                    .filter(tx -> tx.getTransactionType().name().equals("IN"))
                    .map(tx -> tx.getUnitPrice().multiply(BigDecimal.valueOf(tx.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Issued: FIFO or Average Weighted calculation over inventory_issuance + inventory_batches
            BigDecimal issued = calculator.calculateIssuedValue(item, department, start, end);

            // Carry Forward: Brought Fwd + Received - Issued (using value not quantity)
            BigDecimal cf = bf.add(received).subtract(issued);

            InventorySummaryItemDto dto = new InventorySummaryItemDto();
            dto.setInventoryId(item.getId());
            dto.setInventoryName(item.getName());
            dto.setUnit(item.getUnit());
            dto.setValueBroughtForward(bf);
            dto.setValueReceived(received);
            dto.setValueIssued(issued);
            dto.setValueCarriedForward(cf);

            summaries.add(dto);
        }

        return summaries;
    }
    
    /**
     * Get brought forward value using snapshot if available, otherwise calculate from transactions
     */
    private BigDecimal getBroughtForwardValue(InventoryItem item, Department department, 
                                            LocalDate start, CostFlowMethod method) {
        // Try to find the most recent snapshot before start date with matching method
        InventoryBalance snapshot = balanceRepo
                .findTopByInventoryItemAndDepartmentAndSnapshotDateBeforeOrderBySnapshotDateDesc(
                        item, department, Date.valueOf(start))
                .filter(s -> s.getMethod().equals(method))
                .orElse(null);
        
        if (snapshot != null) {
            // Calculate delta from snapshot date to start date
            BigDecimal delta = snapshotService.calculateValueDelta(item, department, 
                    snapshot.getSnapshotDate().toLocalDate(), start, method);
            return snapshot.getTotalValue().add(delta);
        }
        
        // Fallback to full transaction history calculation
        return calculateValueFromTransactions(item, department, start, method);
    }
    
    /**
     * Calculate value from all transactions before start date
     */
    private BigDecimal calculateValueFromTransactions(InventoryItem item, Department department, 
                                                    LocalDate start, CostFlowMethod method) {
        // This is a simplified fallback - in practice, you'd want more sophisticated calculation
        List<StockTransaction> allTransactions = txRepo.findByInventoryItemAndTransactionDateBetween(
                item,
                Timestamp.valueOf("2000-01-01 00:00:00"),
                Timestamp.valueOf(start.atStartOfDay())
        );
        
        BigDecimal totalValue = BigDecimal.ZERO;
        for (StockTransaction tx : allTransactions) {
            if (tx.getTransactionType().name().equals("IN")) {
                totalValue = totalValue.add(tx.getUnitPrice().multiply(BigDecimal.valueOf(tx.getQuantity())));
            } else if (tx.getTransactionType().name().equals("OUT")) {
                // This is simplified - proper implementation would use the cost calculator
                if (method == CostFlowMethod.FIFO) {
                    totalValue = totalValue.subtract(fifoCalc.calculateIssuedValue(item, department, 
                            LocalDate.of(2000, 1, 1), start));
                } else {
                    totalValue = totalValue.subtract(avgCalc.calculateIssuedValue(item, department, 
                            LocalDate.of(2000, 1, 1), start));
                }
            }
        }
        
        return totalValue.max(BigDecimal.ZERO);
    }
}

