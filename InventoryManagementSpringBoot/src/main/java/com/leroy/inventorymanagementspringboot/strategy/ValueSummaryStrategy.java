package com.leroy.inventorymanagementspringboot.strategy;


import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryItemDto;
import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import com.leroy.inventorymanagementspringboot.repository.InventoryBalanceRepository;
import com.leroy.inventorymanagementspringboot.repository.InventoryItemRepository;
import com.leroy.inventorymanagementspringboot.repository.StockTransactionRepository;
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

    public ValueSummaryStrategy(
            InventoryItemRepository itemRepo,
            InventoryBalanceRepository balanceRepo,
            StockTransactionRepository txRepo,
            FifoCostCalculator fifoCalc,
            AverageCostCalculator avgCalc) {
        this.itemRepo = itemRepo;
        this.balanceRepo = balanceRepo;
        this.txRepo = txRepo;
        this.fifoCalc = fifoCalc;
        this.avgCalc = avgCalc;
    }

    @Override
    public List<InventorySummaryItemDto> generateReport(LocalDate start, LocalDate end, Department department, CostFlowMethod method) {
        List<InventoryItem> items = itemRepo.findAllByDepartment(department).orElse(List.of());

        List<InventorySummaryItemDto> summaries = new ArrayList<>();

        CostCalculatorStrategy calculator = method == CostFlowMethod.FIFO ? fifoCalc : avgCalc;

        for (InventoryItem item : items) {
            // B/F
            BigDecimal bf = balanceRepo
                    .findTopByInventoryItemAndDepartmentAndSnapshotDateBeforeOrderBySnapshotDateDesc(item, department, Date.valueOf(start))
                    .map(InventoryBalance::getTotalValue)
                    .orElse(BigDecimal.ZERO);

            // Received
            BigDecimal received = txRepo.findByInventoryItemAndTransactionDateBetween(item, Timestamp.valueOf(start.atStartOfDay()), Timestamp.valueOf(end.atStartOfDay())).stream()
                    .filter(tx -> tx.getTransactionType().name().equals("RECEIVED"))
                    .map(tx -> tx.getUnitPrice().multiply(BigDecimal.valueOf(tx.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Issued
            BigDecimal issued = calculator.calculateIssuedValue(item, department, start, end);

            // Carry Forward
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
}

