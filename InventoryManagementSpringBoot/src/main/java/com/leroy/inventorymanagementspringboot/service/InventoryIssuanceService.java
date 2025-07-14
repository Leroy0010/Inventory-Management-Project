package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.annotation.Auditable;
import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.enums.AuditAction;
import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import com.leroy.inventorymanagementspringboot.repository.InventoryBatchRepository;
import com.leroy.inventorymanagementspringboot.repository.InventoryIssuanceRepository;
import com.leroy.inventorymanagementspringboot.servicei.InventoryIssuanceServiceInterface;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryIssuanceService implements InventoryIssuanceServiceInterface {

    private final InventoryIssuanceRepository issuanceRepository;
    private final InventoryBatchRepository batchRepository;
    private final StockTransactionService stockTransactionService;
    private final NotificationService notificationService;

    public InventoryIssuanceService(InventoryIssuanceRepository issuanceRepository, InventoryBatchRepository batchRepository, StockTransactionService stockTransactionService, NotificationService notificationService) {
        this.issuanceRepository = issuanceRepository;
        this.batchRepository = batchRepository;
        this.stockTransactionService = stockTransactionService;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    @Auditable(
            action = AuditAction.CREATE,
            entityClass = InventoryIssuance.class
    )
    @Auditable(
            action = AuditAction.CREATE,
            entityClass = StockTransaction.class
    )
    @Auditable(
            action = AuditAction.UPDATE,
            entityClass = InventoryBatch.class,
            logBefore = true
    )
    public void fulfillRequestItem(RequestItem requestItem, Request request, User staff) {
        int neededQuantity = requestItem.getQuantity();
        InventoryItem inventoryItem = requestItem.getItem();

        // Find batches with stock, ordered by oldest
        List<InventoryBatch> batches = batchRepository
                .findAvailableBatchesForUpdate(inventoryItem);

        for (InventoryBatch batch : batches) {
            if (neededQuantity <= 0) break;

            int available = batch.getRemainingQuantity();
            int toIssue = Math.min(available, neededQuantity);

            // Deduct from batch
            batch.setRemainingQuantity(available - toIssue);

            // Create issuance
            InventoryIssuance issuance = new InventoryIssuance(requestItem, batch, toIssue);
            issuanceRepository.save(issuance);
            stockTransactionService.recordTransaction(inventoryItem, StockTransactionType.ISSUED, toIssue, batch.getUnitPrice(), request, null, null, batch, staff);



            // Update batch
            batchRepository.save(batch);

            neededQuantity -= toIssue;
        }

        if (neededQuantity > 0) {
            throw new RuntimeException("Insufficient inventory to fulfill request item: " + inventoryItem.getName());
        }

        notificationService.notifyLowStockIfNeeded(inventoryItem);

    }
}
