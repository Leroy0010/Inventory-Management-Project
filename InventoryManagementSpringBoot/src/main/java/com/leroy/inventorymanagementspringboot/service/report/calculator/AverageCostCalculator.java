package com.leroy.inventorymanagementspringboot.service.report.calculator;

import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.repository.StockTransactionRepository;
import com.leroy.inventorymanagementspringboot.strategy.CostCalculatorStrategy;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Component
public class AverageCostCalculator implements CostCalculatorStrategy {

    private final StockTransactionRepository transactionRepo;

    public AverageCostCalculator(StockTransactionRepository transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    @Override
    public BigDecimal calculateIssuedValue(InventoryItem item, Department department, LocalDate start, LocalDate end) {
        List<com.leroy.inventorymanagementspringboot.entity.StockTransaction> issued =
                transactionRepo.findByInventoryItemAndTransactionDateBetween(item, Timestamp.valueOf(start.atStartOfDay()), Timestamp.valueOf(end.atStartOfDay()));

        // Compute average price based on all stock received before end
        Timestamp firstTx = transactionRepo.getFirstTransactionDate(item);
        if (firstTx == null) firstTx = Timestamp.valueOf("2000-01-01 00:00:00");

        List<com.leroy.inventorymanagementspringboot.entity.StockTransaction> allBefore =
                transactionRepo.findByInventoryItemAndTransactionDateBetween(item, firstTx, Timestamp.valueOf(end.atStartOfDay()));

        int totalQty = 0;
        BigDecimal totalCost = BigDecimal.ZERO;

        for (var tx : allBefore) {
            if (tx.getTransactionType().name().equals("RECEIVED")) {
                totalQty += tx.getQuantity();
                totalCost = totalCost.add(tx.getUnitPrice().multiply(BigDecimal.valueOf(tx.getQuantity())));
            }
        }

        BigDecimal avgPrice = totalQty > 0 ? totalCost.divide(BigDecimal.valueOf(totalQty), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        int issuedQty = issued.stream()
                .filter(tx -> tx.getTransactionType().name().equals("ISSUED"))
                .mapToInt(com.leroy.inventorymanagementspringboot.entity.StockTransaction::getQuantity)
                .sum();

        return avgPrice.multiply(BigDecimal.valueOf(issuedQty));
    }
}
