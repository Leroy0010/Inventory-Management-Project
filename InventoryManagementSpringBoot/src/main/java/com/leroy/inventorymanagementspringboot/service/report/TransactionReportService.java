package com.leroy.inventorymanagementspringboot.service.report;

import com.leroy.inventorymanagementspringboot.dto.report.*;
import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import com.leroy.inventorymanagementspringboot.mapper.TransactionMapper;
import com.leroy.inventorymanagementspringboot.repository.*;
import com.leroy.inventorymanagementspringboot.servicei.TransactionReportServiceInterface;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionReportService implements TransactionReportServiceInterface {

    private final StockTransactionRepository stockTransactionRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryBalanceRepository inventoryBalanceRepository;
    private final TransactionMapper transactionMapper;

    public TransactionReportService(StockTransactionRepository stockTransactionRepository,
                                    InventoryItemRepository inventoryItemRepository,
                                    InventoryBalanceRepository inventoryBalanceRepository,
                                    TransactionMapper transactionMapper) {
        this.stockTransactionRepository = stockTransactionRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.inventoryBalanceRepository = inventoryBalanceRepository;
        this.transactionMapper = transactionMapper;
    }

    @Override
    public TransactionReportDto generateReport(TransactionReportRequest request, User storekeeper) {
        // Validate request
        validateRequest(request);

        // Get inventory item
        InventoryItem item = inventoryItemRepository.findById(request.getItemId())
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        // Get department
        Department department = storekeeper.getDepartment();
        // Calculate date range
        LocalDateTime startDateTime;
        LocalDateTime endDateTime;

        if (request.getStartDate() != null) {
            startDateTime = request.getStartDate().atStartOfDay();
            endDateTime = request.getEndDate().atTime(23, 59, 59);
        } else {

            LocalDate start = request.getMonth() == null ?
                    LocalDate.of(request.getYear(), 1, 1) :
                    LocalDate.of(request.getYear(), request.getMonth(), 1);
            LocalDate end = request.getMonth() == null ?
                    start.withMonth(12).withDayOfMonth(31) :
                    start.withDayOfMonth(start.lengthOfMonth());
            startDateTime = start.atStartOfDay();
            endDateTime = end.atTime(23, 59, 59);
        }





        // Get transactions (already sorted by date)
        List<StockTransaction> transactions = stockTransactionRepository
                .findByInventoryItemAndTransactionDateBetweenOrderByTransactionDateAsc(
                        item,
                        java.sql.Timestamp.valueOf(startDateTime),
                        java.sql.Timestamp.valueOf(endDateTime)
                );

        // Filter by transaction type if specified
        if (request.getTransactionType() != null) {
            transactions = transactions.stream()
                    .filter(tx -> tx.getTransactionType() == request.getTransactionType())
                    .toList();
        }

        // Calculate running balance and summary information
        int initialBalance = getBalanceBefore(item, department, startDateTime.toLocalDate());
        int totalReceived = 0;
        int totalIssued = 0;

        // First pass: convert to DTOs
        List<TransactionDto> txDtos = transactions.stream()
                .map(transactionMapper::toDto)
                .collect(Collectors.toList());

        // Second pass: calculate running balance
        int runningBalance = initialBalance;
        for (TransactionDto dto : txDtos) {
            if (dto.getTransactionType() == StockTransactionType.RECEIVED) {
                totalReceived += dto.getQuantity();
                runningBalance += dto.getQuantity();
            } else {
                totalIssued += dto.getQuantity();
                runningBalance -= dto.getQuantity();
            }
            dto.setBalance(runningBalance);
        }

        // Calculate net change
        int netChange = totalReceived - totalIssued;

        // Create and populate report
        TransactionReportDto report = new TransactionReportDto();
        report.setItemId(item.getId());
        report.setItemName(item.getName());
        report.setUnitOfMeasurement(item.getUnit());
        report.setTransactions(txDtos);
        report.setTotalReceived(totalReceived);
        report.setTotalIssued(totalIssued);
        report.setNetChange(netChange);

        return report;
    }

    private void validateRequest(TransactionReportRequest request) {
        if (request.getItemId() == null) {
            throw new IllegalArgumentException("Item ID is required");
        }
        if (request.getYear() == null && request.getStartDate() == null) {
            throw new IllegalArgumentException("Year or Start Date is required");
        } else if(request.getStartDate() != null && request.getEndDate() == null) {
            throw new IllegalArgumentException("End Date is required");
        } else if ((request.getYear() != null && request.getStartDate() == null) && (request.getYear() < 2000 || request.getYear() > 2100)) {
            throw new IllegalArgumentException("Invalid year: " + request.getYear());
        } else if (request.getMonth() != null && (request.getMonth() < 1 || request.getMonth() > 12)) {
            throw new IllegalArgumentException("Invalid month: " + request.getMonth());
        }

    }

    private int getBalanceBefore(InventoryItem item, Department department, LocalDate startDate) {
        return inventoryBalanceRepository.findTopByInventoryItemAndDepartmentAndSnapshotDateBeforeOrderBySnapshotDateDesc(
                item,
                department,
                java.sql.Date.valueOf(startDate)
        ).map(InventoryBalance::getQuantity).orElse(0);
    }
}
