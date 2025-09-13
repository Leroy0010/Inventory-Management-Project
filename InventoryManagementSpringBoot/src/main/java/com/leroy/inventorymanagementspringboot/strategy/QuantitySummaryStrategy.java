package com.leroy.inventorymanagementspringboot.strategy;

import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryItemDto;
import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import com.leroy.inventorymanagementspringboot.repository.InventoryBalanceRepository;
import com.leroy.inventorymanagementspringboot.repository.InventoryItemRepository;
import com.leroy.inventorymanagementspringboot.repository.StockTransactionRepository;
import com.leroy.inventorymanagementspringboot.service.InventorySnapshotService;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class QuantitySummaryStrategy implements InventorySummaryStrategy {

    private final InventoryItemRepository itemRepository;
    private final InventoryBalanceRepository balanceRepository;
    private final StockTransactionRepository transactionRepository;
    private final InventorySnapshotService snapshotService;

    public QuantitySummaryStrategy(InventoryItemRepository itemRepository,
                                   InventoryBalanceRepository balanceRepository,
                                   StockTransactionRepository transactionRepository,
                                   InventorySnapshotService snapshotService) {
        this.itemRepository = itemRepository;
        this.balanceRepository = balanceRepository;
        this.transactionRepository = transactionRepository;
        this.snapshotService = snapshotService;
    }

    @Override
    public List<InventorySummaryItemDto> generateReport(LocalDate start, LocalDate end, Department department, CostFlowMethod method) {
        List<InventoryItem> items = itemRepository.findAllByDepartment(department).orElse(List.of());
        List<InventorySummaryItemDto> result = new ArrayList<>();

        for (InventoryItem item : items) {
            InventorySummaryItemDto dto = new InventorySummaryItemDto();
            dto.setInventoryId(item.getId());
            dto.setInventoryName(item.getName());
            dto.setUnit(item.getUnit());

            // Brought Forward: Use snapshot if available, otherwise calculate from transactions
            int broughtForward = getBroughtForwardQuantity(item, department, start);
            dto.setQuantityBroughtForward(broughtForward);

            // Received: Sum of all INs within date range
            int received = transactionRepository.findByInventoryItemAndTransactionDateBetween(item,
                            Timestamp.valueOf(start.atStartOfDay()), Timestamp.valueOf(end.plusDays(1).atStartOfDay()))
                    .stream()
                    .filter(tx -> tx.getTransactionType().name().equals("IN"))
                    .mapToInt(StockTransaction::getQuantity)
                    .sum();

            // Issued: Sum of all OUTs within date range
            int issued = transactionRepository.findByInventoryItemAndTransactionDateBetween(item,
                            Timestamp.valueOf(start.atStartOfDay()), Timestamp.valueOf(end.plusDays(1).atStartOfDay()))
                    .stream()
                    .filter(tx -> tx.getTransactionType().name().equals("OUT"))
                    .mapToInt(StockTransaction::getQuantity)
                    .sum();

            dto.setQuantityReceived(received);
            dto.setQuantityIssued(issued);
            dto.setQuantityCarriedForward(broughtForward + received - issued);

            result.add(dto);
        }

        return result;
    }
    
    /**
     * Get brought forward quantity using snapshot if available, otherwise calculate from transactions
     */
    private int getBroughtForwardQuantity(InventoryItem item, Department department, LocalDate start) {
        // Try to find the most recent snapshot before start date
        InventoryBalance snapshot = balanceRepository
                .findTopByInventoryItemAndDepartmentAndSnapshotDateBeforeOrderBySnapshotDateDesc(
                        item, department, Date.valueOf(start))
                .orElse(null);
        
        if (snapshot != null) {
            // Calculate delta from snapshot date to start date
            int delta = snapshotService.calculateQuantityDelta(item, 
                    snapshot.getSnapshotDate().toLocalDate(), start);
            return snapshot.getQuantity() + delta;
        }
        
        // Fallback to full transaction history calculation
        return transactionRepository.getBalanceBefore(item.getId(), Timestamp.valueOf(start.atStartOfDay()));
    }
}
