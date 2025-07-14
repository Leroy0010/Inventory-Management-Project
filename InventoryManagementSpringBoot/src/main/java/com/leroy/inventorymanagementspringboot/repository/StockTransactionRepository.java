package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.sql.Timestamp;
import java.util.List;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    List<StockTransaction> findByInventoryItemAndTransactionDateBetweenOrderByTransactionDateAsc(
            InventoryItem item, Timestamp start, Timestamp end);

    @Query("SELECT COALESCE(SUM(CASE WHEN st.transactionType = 'RECEIVED' THEN st.quantity ELSE -st.quantity END), 0) " +
            "FROM StockTransaction st WHERE st.inventoryItem.id = :itemId AND st.transactionDate < :start")
    int getBalanceBefore(int itemId, Timestamp start);

    @Query("""
    SELECT new com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto(
        st.inventoryItem.id,
        st.inventoryItem.name,
        st.inventoryItem.unit,
        SUM(st.quantity)
    )
    FROM StockTransaction st
    WHERE st.transactionType = 'RECEIVED'
      AND st.request.user.id = :userId
      AND FUNCTION('YEAR', st.transactionDate) = :year
    GROUP BY st.inventoryItem.id, st.inventoryItem.name, st.inventoryItem.unit
""")
    List<UserReportItemDto> getUserReportItems(Integer userId, int year);

    @Query("SELECT MIN(st.transactionDate) FROM StockTransaction st WHERE st.inventoryItem = :item")
    Timestamp getFirstTransactionDate(InventoryItem item);




    List<StockTransaction> findByInventoryItem(InventoryItem item);
    List<StockTransaction> findByInventoryItemAndTransactionDateBetween(InventoryItem item, Timestamp start, Timestamp end);
}
