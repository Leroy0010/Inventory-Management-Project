package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.annotation.Auditable;
import com.leroy.inventorymanagementspringboot.dto.request.CreateBatchDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryBatchResponseDto;
import com.leroy.inventorymanagementspringboot.entity.InventoryBatch;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.entity.StockTransaction;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.AuditAction;
import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import com.leroy.inventorymanagementspringboot.exception.ResourceNotFoundException;
import com.leroy.inventorymanagementspringboot.mapper.InventoryBatchMapper;
import com.leroy.inventorymanagementspringboot.repository.InventoryBatchRepository;
import com.leroy.inventorymanagementspringboot.repository.InventoryItemRepository;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.servicei.InventoryBatchServiceInterface;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;

@Service
@Transactional
public class InventoryBatchService implements InventoryBatchServiceInterface {
    private final InventoryBatchMapper inventoryBatchMapper;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final StockTransactionService  stockTransactionService;
    private final UserRepository userRepository;

    public InventoryBatchService(InventoryBatchMapper inventoryBatchMapper, InventoryBatchRepository inventoryBatchRepository, InventoryItemRepository inventoryItemRepository, StockTransactionService stockTransactionService, UserRepository userRepository) {
        this.inventoryBatchMapper = inventoryBatchMapper;
        this.inventoryBatchRepository = inventoryBatchRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.stockTransactionService = stockTransactionService;
        this.userRepository = userRepository;
    }

    @Override
    @Auditable(
            action = AuditAction.RESTOCK,
            entityClass = InventoryBatch.class
    )
    @Auditable(
            action = AuditAction.CREATE,
            entityClass = StockTransaction.class
    )
    public InventoryBatchResponseDto addInventoryBatch(CreateBatchDto createBatchDto, UserDetails userDetails) {
        User storeKeeper = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        InventoryItem inventoryItem = inventoryItemRepository.findByName(createBatchDto.getItemName())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory Item Not Found"));

        if (createBatchDto.getQuantity() <= 0)
            throw new IllegalArgumentException("Quantity should be greater than 0");

        InventoryBatch inventoryBatch = inventoryBatchMapper.toInventoryBatch(createBatchDto);
        inventoryBatch.setInventoryItem(inventoryItem);
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        inventoryBatch.setBatchDate(timestamp);
        inventoryBatch.setRemainingQuantity(createBatchDto.getQuantity());
        BigDecimal unitPrice = createBatchDto.getTotalPrice().divide(BigDecimal.valueOf(createBatchDto.getQuantity()) , 2 , RoundingMode.HALF_UP);
        inventoryBatch.setUnitPrice(unitPrice);
        inventoryBatchRepository.save(inventoryBatch);
        InventoryBatchResponseDto inventoryBatchResponseDto = inventoryBatchMapper.toInventoryBatchResponseDto(inventoryBatch);
        inventoryBatchResponseDto.setTotalPrice(createBatchDto.getTotalPrice());
        stockTransactionService
                .recordTransaction(inventoryItem, StockTransactionType.RECEIVED, createBatchDto.getQuantity(), unitPrice, null, createBatchDto.getSupplierName(), createBatchDto.getInvoiceId(), inventoryBatch, storeKeeper);

        return inventoryBatchResponseDto;
    }
}
