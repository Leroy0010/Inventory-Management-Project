package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.entity.InventoryBatch;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.entity.Request;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;

import java.math.BigDecimal;

public interface StockTransactionServiceInterface {
    void recordTransaction(InventoryItem item, StockTransactionType type, int quantity,
                           BigDecimal unitPrice, Request request, String supplier,
                           String invoiceId, InventoryBatch batch, User user);
}
