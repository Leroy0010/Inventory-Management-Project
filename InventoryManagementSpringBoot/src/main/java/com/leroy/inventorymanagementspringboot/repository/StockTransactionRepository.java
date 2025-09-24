package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportSummaryDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.entity.StockTransaction;
import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    List<StockTransaction> findByInventoryItemAndTransactionDateBetweenOrderByTransactionDateAsc(
            InventoryItem item, Timestamp start, Timestamp end);

    @Query("SELECT COALESCE(SUM(CASE WHEN st.transactionType = 'IN' THEN st.quantity ELSE -st.quantity END), 0) " +
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
                WHERE st.transactionType = 'OUT'
                  AND st.request.user.id = :userId
                  AND EXTRACT(YEAR FROM st.transactionDate) = :year
                GROUP BY st.inventoryItem.id, st.inventoryItem.name, st.inventoryItem.unit
                ORDER BY
                    CASE WHEN :sortBy = 'itemId' AND :sortOrder = 'asc' THEN st.inventoryItem.id END ASC,
                    CASE WHEN :sortBy = 'itemId' AND :sortOrder = 'desc' THEN st.inventoryItem.id END DESC,
                    CASE WHEN :sortBy = 'itemName' AND :sortOrder = 'asc' THEN st.inventoryItem.name END ASC,
                    CASE WHEN :sortBy = 'itemName' AND :sortOrder = 'desc' THEN st.inventoryItem.name END DESC,
                    CASE WHEN :sortBy = 'quantityReceived' AND :sortOrder = 'asc' THEN SUM(st.quantity) END ASC,
                    CASE WHEN :sortBy = 'quantityReceived' AND :sortOrder = 'desc' THEN SUM(st.quantity) END DESC,
                    st.inventoryItem.name ASC
            """)
    List<UserReportItemDto> getUserReportItems(@Param("userId") Integer userId, @Param("year") int year,
            @Param("sortBy") String sortBy, @Param("sortOrder") String sortOrder);

    @Query("""
                SELECT new com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto(
                    st.inventoryItem.id,
                    st.inventoryItem.name,
                    st.inventoryItem.unit,
                    SUM(st.quantity)
                )
                FROM StockTransaction st
                WHERE st.transactionType = 'OUT'
                  AND st.request.user.id = :userId
                  AND st.transactionDate >= :startDate
                  AND st.transactionDate <= :endDate
                GROUP BY st.inventoryItem.id, st.inventoryItem.name, st.inventoryItem.unit
                ORDER BY
                    CASE WHEN :sortBy = 'itemId' AND :sortOrder = 'asc' THEN st.inventoryItem.id END ASC,
                    CASE WHEN :sortBy = 'itemId' AND :sortOrder = 'desc' THEN st.inventoryItem.id END DESC,
                    CASE WHEN :sortBy = 'itemName' AND :sortOrder = 'asc' THEN st.inventoryItem.name END ASC,
                    CASE WHEN :sortBy = 'itemName' AND :sortOrder = 'desc' THEN st.inventoryItem.name END DESC,
                    CASE WHEN :sortBy = 'quantityReceived' AND :sortOrder = 'asc' THEN SUM(st.quantity) END ASC,
                    CASE WHEN :sortBy = 'quantityReceived' AND :sortOrder = 'desc' THEN SUM(st.quantity) END DESC,
                    st.inventoryItem.name ASC
            """)
    List<UserReportItemDto> getUserReportItemsByDateRange(
            @Param("userId") Integer userId,
            @Param("startDate") java.time.LocalDate startDate,
            @Param("endDate") java.time.LocalDate endDate,
            @Param("sortBy") String sortBy,
            @Param("sortOrder") String sortOrder);

    @Query("SELECT MIN(st.transactionDate) FROM StockTransaction st WHERE st.inventoryItem = :item")
    Timestamp getFirstTransactionDate(InventoryItem item);

    List<StockTransaction> findByInventoryItem(InventoryItem item);

    List<StockTransaction> findByInventoryItemAndTransactionDateBetween(InventoryItem item, Timestamp start,
            Timestamp end);

    // New: Count issued transactions between dates for a specific department
    @Query("SELECT COALESCE(SUM(st.quantity), 0) FROM StockTransaction st WHERE st.transactionType = :type AND st.transactionDate BETWEEN :start AND :end AND st.department = :department")
    long countTransactionsBetweenAndDepartment(@Param("type") StockTransactionType type,
            @Param("start") Timestamp start, @Param("end") Timestamp end, @Param("department") Department department);

    // Get user report summaries for users in the same department as storekeeper
    @Query("""
                SELECT new com.leroy.inventorymanagementspringboot.dto.report.UserReportSummaryDto(
                    u.id,
                    CONCAT(u.firstName, ' ', u.lastName),
                    u.email,
                    o.name,
                    COUNT(DISTINCT st.inventoryItem.id),
                    COALESCE(SUM(st.quantity), 0)
                )
                FROM StockTransaction st
                JOIN st.request r
                JOIN r.user u
                JOIN u.office o
                WHERE st.transactionType = 'OUT'
                  AND u.office.department.id = :departmentId
                  AND (:year IS NULL OR EXTRACT(YEAR FROM st.transactionDate) = :year)
                  AND (:search IS NULL OR LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :search, '%'))
                                           OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))
                GROUP BY u.id, u.firstName, u.lastName, u.email, o.name
                ORDER BY
                    CASE WHEN :sortBy = 'userName' AND :sortOrder = 'asc' THEN CONCAT(u.firstName, ' ', u.lastName) END ASC,
                    CASE WHEN :sortBy = 'userName' AND :sortOrder = 'desc' THEN CONCAT(u.firstName, ' ', u.lastName) END DESC,
                    CASE WHEN :sortBy = 'quantityReceived' AND :sortOrder = 'asc' THEN COALESCE(SUM(st.quantity), 0) END ASC,
                    CASE WHEN :sortBy = 'quantityReceived' AND :sortOrder = 'desc' THEN COALESCE(SUM(st.quantity), 0) END DESC,
                    CASE WHEN :sortBy = 'inventoryCode' AND :sortOrder = 'asc' THEN u.id END ASC,
                    CASE WHEN :sortBy = 'inventoryCode' AND :sortOrder = 'desc' THEN u.id END DESC,
                    CONCAT(u.firstName, ' ', u.lastName) ASC
            """)
    List<UserReportSummaryDto> getUserReportSummariesByDepartment(
            @Param("departmentId") Integer departmentId,
            @Param("year") Integer year,
            @Param("search") String search,
            @Param("sortBy") String sortBy,
            @Param("sortOrder") String sortOrder);

    // Get individual items for a specific user
    @Query("""
                SELECT new com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto(
                    st.inventoryItem.id,
                    st.inventoryItem.name,
                    st.inventoryItem.unit,
                    SUM(st.quantity)
                )
                FROM StockTransaction st
                JOIN st.request r
                WHERE st.transactionType = 'OUT'
                  AND r.user.id = :userId
                  AND (:year IS NULL OR EXTRACT(YEAR FROM st.transactionDate) = :year)
                GROUP BY st.inventoryItem.id, st.inventoryItem.name, st.inventoryItem.unit
                ORDER BY st.inventoryItem.name
            """)
    List<UserReportItemDto> getUserReportItemsForUser(
            @Param("userId") Integer userId,
            @Param("year") Integer year);
}
