package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import com.leroy.inventorymanagementspringboot.repository.StockTransactionRepository;
import com.leroy.inventorymanagementspringboot.servicei.StockTransactionServiceInterface;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Transactional
public class StockTransactionService implements StockTransactionServiceInterface {
    private final StockTransactionRepository repository;

    public StockTransactionService(StockTransactionRepository repository) {
        this.repository = repository;
    }

    public void recordTransaction(InventoryItem item, StockTransactionType type, int quantity,
                                  BigDecimal unitPrice, Request request, String supplier,
                                  String invoiceId, InventoryBatch batch, User user) {
        StockTransaction tx = new StockTransaction(item, type, quantity, unitPrice, request, supplier, invoiceId, batch, user);

        repository.save(tx);
    }

}