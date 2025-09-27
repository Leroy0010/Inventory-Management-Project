package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import com.leroy.inventorymanagementspringboot.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.math.RoundingMode;

@Service
public class InventorySnapshotService {

    private static final Logger logger = LoggerFactory.getLogger(InventorySnapshotService.class);

    private final InventoryBalanceRepository balanceRepository;
    private final InventoryItemRepository itemRepository;
    private final StockTransactionRepository transactionRepository;
    private final FifoCostCalculator fifoCalculator;
    private final AverageCostCalculator avgCalculator;

    public InventorySnapshotService(
            InventoryBalanceRepository balanceRepository,
            InventoryItemRepository itemRepository,
            StockTransactionRepository transactionRepository,
            FifoCostCalculator fifoCalculator,
            AverageCostCalculator avgCalculator) {
        this.balanceRepository = balanceRepository;
        this.itemRepository = itemRepository;
        this.transactionRepository = transactionRepository;
        this.fifoCalculator = fifoCalculator;
        this.avgCalculator = avgCalculator;
    }

    /**
     * Generate monthly snapshots on the 1st of each month at midnight
     */
    @Scheduled(cron = "0 0 0 1 * ?")
    @Transactional
    public void generateMonthlySnapshots() {
        LocalDate lastMonth = LocalDate.now().minusMonths(1);
        LocalDate snapshotDate = lastMonth.withDayOfMonth(lastMonth.lengthOfMonth());

        logger.info("Generating monthly snapshots for date: {}", snapshotDate);
        generateSnapshotsForDate(snapshotDate);
    }

    /**
     * Generate yearly snapshots on January 1st at midnight
     */
    @Scheduled(cron = "0 0 0 1 1 ?")
    @Transactional
    public void generateYearlySnapshots() {
        LocalDate lastYear = LocalDate.now().minusYears(1);
        LocalDate snapshotDate = LocalDate.of(lastYear.getYear(), 12, 31);

        logger.info("Generating yearly snapshots for date: {}", snapshotDate);
        generateSnapshotsForDate(snapshotDate);
    }

    /**
     * Generate snapshots for a specific date
     */
    @Transactional
    public void generateSnapshotsForDate(LocalDate snapshotDate) {
        List<InventoryItem> allItems = itemRepository.findAll();

        for (InventoryItem item : allItems) {
            Department department = item.getDepartment();
            if (department == null)
                continue;

            // Calculate quantity snapshot
            int quantity = calculateQuantitySnapshot(item, snapshotDate);

            // Calculate value snapshots for both FIFO and AVG methods
            BigDecimal fifoValue = calculateValueSnapshot(item, department, snapshotDate, CostFlowMethod.FIFO);
            BigDecimal avgValue = calculateValueSnapshot(item, department, snapshotDate, CostFlowMethod.AVG);

            // Save FIFO snapshot
            saveSnapshot(item, department, snapshotDate, quantity, fifoValue, CostFlowMethod.FIFO);

            // Save AVG snapshot
            saveSnapshot(item, department, snapshotDate, quantity, avgValue, CostFlowMethod.AVG);
        }

        logger.info("Completed generating snapshots for date: {}", snapshotDate);
    }

    /**
     * Calculate quantity snapshot for an item at a specific date
     */
    int calculateQuantitySnapshot(InventoryItem item, LocalDate snapshotDate) {
        return transactionRepository.getBalanceBefore(
                item.getId(),
                Timestamp.valueOf(snapshotDate.plusDays(1).atStartOfDay()));
    }

    /**
     * Calculate value snapshot for an item at a specific date
     */
    BigDecimal calculateValueSnapshot(InventoryItem item, Department department,
            LocalDate snapshotDate, CostFlowMethod method) {
        // Get all transactions before snapshot date
        List<StockTransaction> allTransactions = transactionRepository
                .findByInventoryItemAndTransactionDateBetween(
                        item,
                        Timestamp.valueOf("2000-01-01 00:00:00"),
                        Timestamp.valueOf(snapshotDate.plusDays(1).atStartOfDay()));

        // Calculate total value using the specified method
        if (method == CostFlowMethod.FIFO) {
            return calculateFifoValue(item, department, allTransactions, snapshotDate);
        } else {
            return calculateAverageValue(allTransactions);
        }
    }

    /**
     * Calculate FIFO value for transactions
     */
    private BigDecimal calculateFifoValue(InventoryItem item, Department department,
            List<StockTransaction> transactions, LocalDate snapshotDate) {
        // For FIFO, we need to calculate based on actual batch usage
        // This is a simplified version - in practice, you'd need to track batch usage
        BigDecimal totalValue = BigDecimal.ZERO;
        int totalQuantity = 0;

        for (StockTransaction tx : transactions) {
            if (tx.getTransactionType().name().equals("IN")) {
                totalQuantity += tx.getQuantity();
                totalValue = totalValue.add(tx.getUnitPrice().multiply(BigDecimal.valueOf(tx.getQuantity())));
            } else if (tx.getTransactionType().name().equals("OUT")) {
                // For FIFO, we'd need to track which batches were used
                // This is a simplified calculation
                if (totalQuantity > 0) {
                    BigDecimal avgPrice = totalValue.divide(BigDecimal.valueOf(totalQuantity), 2, RoundingMode.HALF_UP);
                    totalValue = totalValue.subtract(avgPrice.multiply(BigDecimal.valueOf(tx.getQuantity())));
                    totalQuantity -= tx.getQuantity();
                }
            }
        }

        return totalValue.max(BigDecimal.ZERO);
    }

    /**
     * Calculate average weighted value for transactions
     */
    private BigDecimal calculateAverageValue(List<StockTransaction> transactions) {
        int totalQuantity = 0;
        BigDecimal totalCost = BigDecimal.ZERO;

        for (StockTransaction tx : transactions) {
            if (tx.getTransactionType().name().equals("IN")) {
                totalQuantity += tx.getQuantity();
                totalCost = totalCost.add(tx.getUnitPrice().multiply(BigDecimal.valueOf(tx.getQuantity())));
            } else if (tx.getTransactionType().name().equals("OUT")) {
                if (totalQuantity > 0) {
                    BigDecimal avgPrice = totalCost.divide(BigDecimal.valueOf(totalQuantity), 2, RoundingMode.HALF_UP);
                    totalCost = totalCost.subtract(avgPrice.multiply(BigDecimal.valueOf(tx.getQuantity())));
                    totalQuantity -= tx.getQuantity();
                }
            }
        }

        return totalCost.max(BigDecimal.ZERO);
    }

    /**
     * Save snapshot to database
     */
    private void saveSnapshot(InventoryItem item, Department department, LocalDate snapshotDate,
            int quantity, BigDecimal value, CostFlowMethod method) {
        // Check if snapshot already exists
        boolean exists = balanceRepository.existsByInventoryItemAndDepartmentAndSnapshotDateAndMethod(
                item, department, Date.valueOf(snapshotDate), method);

        if (!exists) {
            InventoryBalance snapshot = new InventoryBalance();
            snapshot.setInventoryItem(item);
            snapshot.setDepartment(department);
            snapshot.setSnapshotDate(snapshotDate.atStartOfDay());
            snapshot.setQuantity(quantity);
            snapshot.setTotalValue(value);
            snapshot.setMethod(method);

            balanceRepository.save(snapshot);
            logger.debug("Saved snapshot for item {} on {} with method {}",
                    item.getName(), snapshotDate, method);
        }
    }

    /**
     * Calculate delta from snapshot to start date
     */
    public int calculateQuantityDelta(InventoryItem item, LocalDate snapshotDate, LocalDate startDate) {
        if (snapshotDate.isAfter(startDate) || snapshotDate.equals(startDate)) {
            return 0;
        }

        return transactionRepository.findByInventoryItemAndTransactionDateBetween(
                item,
                Timestamp.valueOf(snapshotDate.plusDays(1).atStartOfDay()),
                Timestamp.valueOf(startDate.atStartOfDay())).stream()
                .mapToInt(tx -> tx.getTransactionType().name().equals("IN") ? tx.getQuantity() : -tx.getQuantity())
                .sum();
    }

    /**
     * Calculate value delta from snapshot to start date
     */
    public BigDecimal calculateValueDelta(InventoryItem item, Department department,
            LocalDate snapshotDate, LocalDate startDate, CostFlowMethod method) {
        if (snapshotDate.isAfter(startDate) || snapshotDate.equals(startDate)) {
            return BigDecimal.ZERO;
        }

        List<StockTransaction> deltaTransactions = transactionRepository.findByInventoryItemAndTransactionDateBetween(
                item,
                Timestamp.valueOf(snapshotDate.plusDays(1).atStartOfDay()),
                Timestamp.valueOf(startDate.atStartOfDay()));

        BigDecimal deltaValue = BigDecimal.ZERO;
        for (StockTransaction tx : deltaTransactions) {
            if (tx.getTransactionType().name().equals("IN")) {
                deltaValue = deltaValue.add(tx.getUnitPrice().multiply(BigDecimal.valueOf(tx.getQuantity())));
            } else if (tx.getTransactionType().name().equals("OUT")) {
                // This is simplified - in practice, you'd need proper cost calculation
                if (method == CostFlowMethod.FIFO) {
                    // Use FIFO calculation for issued value
                    deltaValue = deltaValue
                            .subtract(fifoCalculator.calculateIssuedValue(item, department, snapshotDate, startDate));
                } else {
                    // Use average calculation for issued value
                    deltaValue = deltaValue
                            .subtract(avgCalculator.calculateIssuedValue(item, department, snapshotDate, startDate));
                }
            }
        }

        return deltaValue;
    }
}
