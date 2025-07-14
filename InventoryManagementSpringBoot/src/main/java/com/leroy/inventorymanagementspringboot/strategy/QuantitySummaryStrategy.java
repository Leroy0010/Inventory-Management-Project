package com.leroy.inventorymanagementspringboot.strategy;

import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryItemDto;
import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import com.leroy.inventorymanagementspringboot.repository.InventoryBalanceRepository;
import com.leroy.inventorymanagementspringboot.repository.InventoryItemRepository;
import com.leroy.inventorymanagementspringboot.repository.StockTransactionRepository;
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

    public QuantitySummaryStrategy(InventoryItemRepository itemRepository,
                                   InventoryBalanceRepository balanceRepository,
                                   StockTransactionRepository transactionRepository) {
        this.itemRepository = itemRepository;
        this.balanceRepository = balanceRepository;
        this.transactionRepository = transactionRepository;
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

            // Brought Forward: Use snapshot if available
            InventoryBalance balance = balanceRepository
                    .findTopByInventoryItemAndDepartmentAndSnapshotDateBeforeOrderBySnapshotDateDesc(
                            item, department, Date.valueOf(start))
                    .orElse(null);

            int broughtForward = (balance != null)
                    ? balance.getQuantity()
                    : transactionRepository.getBalanceBefore(item.getId(), Timestamp.valueOf(start.atStartOfDay()));

            dto.setQuantityBroughtForward(broughtForward);

            // Received
            int received = transactionRepository.findByInventoryItemAndTransactionDateBetween(item,
                            Timestamp.valueOf(start.atStartOfDay()), Timestamp.valueOf(end.plusDays(1).atStartOfDay()))
                    .stream()
                    .filter(tx -> tx.getTransactionType().name().equals("RECEIVED"))
                    .mapToInt(StockTransaction::getQuantity)
                    .sum();

            // Issued
            int issued = transactionRepository.findByInventoryItemAndTransactionDateBetween(item,
                            Timestamp.valueOf(start.atStartOfDay()), Timestamp.valueOf(end.plusDays(1).atStartOfDay()))
                    .stream()
                    .filter(tx -> tx.getTransactionType().name().equals("ISSUED"))
                    .mapToInt(StockTransaction::getQuantity)
                    .sum();

            dto.setQuantityReceived(received);
            dto.setQuantityIssued(issued);
            dto.setQuantityCarriedForward(broughtForward + received - issued);

            result.add(dto);
        }

        return result;
    }
}
