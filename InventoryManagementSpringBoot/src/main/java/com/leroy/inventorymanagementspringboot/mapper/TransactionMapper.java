package com.leroy.inventorymanagementspringboot.mapper;

import com.leroy.inventorymanagementspringboot.dto.report.TransactionDto;
import com.leroy.inventorymanagementspringboot.entity.StockTransaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {
    public TransactionDto toDto(StockTransaction tx) {
        TransactionDto dto = new TransactionDto();
        dto.setDate(tx.getTransactionDate());
        dto.setTransactionType(tx.getTransactionType());
        dto.setQuantity(tx.getQuantity());
        dto.setSupplier(tx.getSupplier());
        dto.setInvoiceId(tx.getInvoiceId());
        dto.setReceiver(tx.getRequest() != null ? tx.getRequest().getUser().getFullName() : null);
        return dto;
    }
}