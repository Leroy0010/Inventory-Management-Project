package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.entity.InventoryBatch;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InventoryBatchRepository extends JpaRepository<InventoryBatch, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM InventoryBatch b WHERE b.inventoryItem = :item AND b.remainingQuantity > 0 ORDER BY b.batchDate ASC")
    List<InventoryBatch> findAvailableBatchesForUpdate(@Param("item") InventoryItem item);

    // In InventoryBatchRepository.java
    @Query("SELECT COALESCE(SUM(b.remainingQuantity), 0) FROM InventoryBatch b WHERE b.inventoryItem = :item AND b.remainingQuantity > 0")
    Integer sumRemainingQuantityByItem(@Param("item") InventoryItem item);

}
